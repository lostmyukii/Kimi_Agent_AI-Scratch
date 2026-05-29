from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import backend.app.models  # noqa: F401
from backend.app.api.routes_event_graph import router
from backend.app.core.database import Base
from backend.app.models.event_graph import GeneratedProjectDraft
from backend.app.models.project_plugin import ProjectPackage, ProjectRAGIndexJob
from backend.app.schemas.event_graph import EventGraphIdeaRequest, EventGraphProjectDraftRequest
from backend.app.services.event_graph_generated_draft_service import (
    create_generated_project_draft,
    get_generated_project_draft,
    list_generated_project_drafts,
)


class EventGraphGeneratedDraftPersistenceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def tearDown(self) -> None:
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def test_create_generated_project_draft_persists_reviewable_record_and_export_paths(self) -> None:
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

        with tempfile.TemporaryDirectory() as tmpdir, self.SessionLocal() as db:
            record = create_generated_project_draft(
                db,
                "IDEA-VOICE-CAR-L2",
                request,
                output_root=Path(tmpdir),
                created_by="teacher-a",
            )

            self.assertEqual(record.status, "draft")
            self.assertEqual(record.lifecycle_stage, "draft")
            self.assertEqual(record.created_by, "teacher-a")
            self.assertEqual(record.package_id, "pkg-event-graph-idea-voice-car-l2")
            self.assertTrue(Path(record.package_dir).exists())
            self.assertTrue(Path(record.manifest_path).exists())
            self.assertTrue(Path(record.export_manifest_path).exists())
            self.assertEqual(record.draft_payload_json["status"], "draft")
            self.assertFalse(record.draft_payload_json["project_manifest"]["rag_indexable"])
            self.assertFalse(record.draft_payload_json["project_manifest"]["recommendable"])
            self.assertFalse(record.validation_summary_json["can_activate"])
            self.assertIn("project_package_validation", record.validation_summary_json["required_review"])

            persisted = get_generated_project_draft(db, record.draft_id)
            self.assertEqual(persisted.draft_id, record.draft_id)
            self.assertEqual(list_generated_project_drafts(db, idea_id="IDEA-VOICE-CAR-L2")[0].draft_id, record.draft_id)

            self.assertEqual(db.scalar(select(func.count()).select_from(GeneratedProjectDraft)), 1)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectPackage)), 0)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectRAGIndexJob)), 0)

    def test_l1_generated_project_draft_persists_without_competition_targets(self) -> None:
        request = EventGraphProjectDraftRequest(
            idea=EventGraphIdeaRequest(
                idea_text="幼儿园孩子想参加机器人竞赛，做一个自动完成任务的小车",
                age=5,
                target_use="competition",
            )
        )

        with tempfile.TemporaryDirectory() as tmpdir, self.SessionLocal() as db:
            record = create_generated_project_draft(
                db,
                "IDEA-L1-COMPETITION",
                request,
                output_root=Path(tmpdir),
                created_by="teacher-a",
            )

        manifest = record.draft_payload_json["project_manifest"]
        self.assertEqual(manifest["age_band"], "L1")
        self.assertEqual(manifest["target_competitions"], [])
        self.assertIn("age_risk", record.validation_summary_json["risk_flags"])

    def test_generated_project_draft_routes_are_registered(self) -> None:
        route_paths = {getattr(route, "path", "") for route in router.routes}
        self.assertIn("/event-graph/ideas/{idea_id}/generated-project-drafts", route_paths)
        self.assertIn("/event-graph/generated-project-drafts", route_paths)
        self.assertIn("/event-graph/generated-project-drafts/{draft_id}", route_paths)


if __name__ == "__main__":
    unittest.main()
