from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import backend.app.models  # noqa: F401
from backend.app.api.routes_event_graph import router
from backend.app.core.database import Base, get_db
from backend.app.main import app
from backend.app.models.knowledge import KnowledgePoint
from backend.app.models.project import Project
from backend.app.models.project_plugin import ProjectPackage, ProjectRAGIndexJob, ProjectValidationResult
from backend.app.schemas.event_graph import (
    EventGraphIdeaRequest,
    EventGraphProjectDraftRequest,
    EventGraphProjectPackageReviewRequest,
    EventGraphReviewRecordCreateRequest,
)
from backend.app.services.event_graph_generated_draft_service import create_generated_project_draft
from backend.app.services.event_graph_package_review_service import prepare_generated_draft_for_project_package_review
from backend.app.services.event_graph_review_service import create_project_graph_review_record
from backend.app.services.auth_service import ensure_demo_auth_users


TEACHER_HEADERS = {"Authorization": "Bearer dev-teacher-token"}
ADMIN_HEADERS = {"Authorization": "Bearer dev-admin-token"}


class EventGraphPackageReviewTest(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def tearDown(self) -> None:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def _create_draft(self, db, tmpdir: str):
        request = EventGraphProjectDraftRequest(
            idea=EventGraphIdeaRequest(
                idea_text="我想做一个可以语音控制的送货小车",
                age=8,
                available_hardware=["Arduino", "超声波传感器", "小车底盘"],
                duration_hours=8,
            ),
            draft_title="语音送货小车项目",
            teacher_notes=["保留解释门", "先学生草稿再AI建议"],
        )
        return create_generated_project_draft(db, "IDEA-VOICE-CAR-L2", request, Path(tmpdir), created_by="teacher-a")

    def _approve_for_project_package_review(self, db, draft_id: str) -> None:
        create_project_graph_review_record(
            db,
            draft_id,
            EventGraphReviewRecordCreateRequest(
                review_stage="teaching_research_review",
                reviewer_id="researcher-a",
                reviewer_role="teaching_research",
                decision="approved",
                decision_reason="知识链、年龄阶段和AI边界均可进入项目包校验。",
            ),
        )

    def _seed_knowledge_points_for(self, db, manifest: dict) -> None:
        ids = list(dict.fromkeys([*manifest["knowledge_point_ids"], *manifest["ai_competency_ids"]]))
        for index, knowledge_id in enumerate(ids, start=1):
            db.add(
                KnowledgePoint(
                    id=knowledge_id,
                    name=knowledge_id,
                    system="event_graph_test",
                    level=manifest["age_band"],
                    domain="event_graph",
                    type="knowledge",
                    description=knowledge_id,
                    difficulty=min(index + 1, 5),
                    bloom_level="apply",
                    age_band=manifest["age_band"],
                )
            )
        db.commit()

    def test_ready_draft_imports_validates_and_submits_without_activation_or_rag(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir, self.SessionLocal() as db:
            draft = self._create_draft(db, tmpdir)
            self._seed_knowledge_points_for(db, draft.draft_payload_json["project_manifest"])
            self._approve_for_project_package_review(db, draft.draft_id)

            response = prepare_generated_draft_for_project_package_review(
                db,
                draft.draft_id,
                EventGraphProjectPackageReviewRequest(actor="researcher-a", submit_for_review=True),
            )

            self.assertEqual(response.draft_id, draft.draft_id)
            self.assertEqual(response.package_id, draft.package_id)
            self.assertTrue(response.review_gate["ready"])
            self.assertEqual(response.package_status, "in_review")
            self.assertTrue(response.submitted_for_review)
            self.assertEqual(response.validation_summary["failed_errors"], 0)
            self.assertGreater(response.validation_summary["total"], 0)
            self.assertEqual(response.rag_job_count, 0)

            package = db.get(ProjectPackage, draft.package_id)
            self.assertIsNotNone(package)
            self.assertEqual(package.status, "in_review")
            self.assertEqual(package.lifecycle_stage, "in_review")
            self.assertEqual(package.manifest_json["status"], "in_review")
            self.assertEqual(package.manifest_json["event_graph_review"]["source_draft_id"], draft.draft_id)
            self.assertIsNone(package.published_at)

            project = db.get(Project, draft.project_id)
            self.assertIsNotNone(project)
            self.assertEqual(project.plugin_status, "in_review")
            self.assertFalse(project.recommendable)
            self.assertFalse(project.rag_indexable)

            self.assertGreater(db.scalar(select(func.count()).select_from(ProjectValidationResult)), 0)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectRAGIndexJob)), 0)

            db.refresh(draft)
            self.assertEqual(draft.status, "draft")
            self.assertEqual(draft.lifecycle_stage, "draft")

    def test_draft_without_ready_review_is_blocked_before_project_package_import(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir, self.SessionLocal() as db:
            draft = self._create_draft(db, tmpdir)

            with self.assertRaisesRegex(ValueError, "ready_for_project_package_review"):
                prepare_generated_draft_for_project_package_review(
                    db,
                    draft.draft_id,
                    EventGraphProjectPackageReviewRequest(actor="researcher-a", submit_for_review=True),
                )

            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectPackage)), 0)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectRAGIndexJob)), 0)

    def test_package_review_route_is_registered(self) -> None:
        route_paths = {getattr(route, "path", "") for route in router.routes}
        self.assertIn("/event-graph/generated-project-drafts/{draft_id}/project-package-review", route_paths)

    def test_package_review_endpoint_requires_admin_and_uses_authenticated_actor(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            with self.SessionLocal() as db:
                ensure_demo_auth_users(db)
                draft = self._create_draft(db, tmpdir)
                self._seed_knowledge_points_for(db, draft.draft_payload_json["project_manifest"])
                self._approve_for_project_package_review(db, draft.draft_id)
                draft_id = draft.draft_id
                package_id = draft.package_id

            def override_db():
                db = self.SessionLocal()
                try:
                    yield db
                finally:
                    db.close()

            app.dependency_overrides[get_db] = override_db
            path = f"/api/event-graph/generated-project-drafts/{draft_id}/project-package-review"

            with TestClient(app) as client:
                no_auth = client.post(path, json={"actor": "spoofed-user", "submit_for_review": True})
                self.assertEqual(no_auth.status_code, 401)

                teacher = client.post(path, headers=TEACHER_HEADERS, json={"actor": "spoofed-user", "submit_for_review": True})
                self.assertEqual(teacher.status_code, 403)

                admin = client.post(path, headers=ADMIN_HEADERS, json={"actor": "spoofed-user", "submit_for_review": True})
                admin.raise_for_status()
                self.assertEqual(admin.json()["package_status"], "in_review")

            with self.SessionLocal() as db:
                package = db.get(ProjectPackage, package_id)
                self.assertEqual(package.manifest_json["event_graph_review"]["import_actor"], "ADM-001")
                self.assertEqual(package.uploaded_by, "ADM-001")


if __name__ == "__main__":
    unittest.main()
