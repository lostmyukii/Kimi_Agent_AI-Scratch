from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import backend.app.models  # noqa: F401
from backend.app.api.routes_event_graph import router
from backend.app.core.database import Base
from backend.app.models.event_graph import ProjectGraphReviewRecord
from backend.app.models.project_plugin import ProjectPackage, ProjectRAGIndexJob
from backend.app.schemas.event_graph import (
    EventGraphIdeaRequest,
    EventGraphProjectDraftRequest,
    EventGraphReviewRecordCreateRequest,
)
from backend.app.services.event_graph_generated_draft_service import create_generated_project_draft
from backend.app.services.event_graph_review_service import (
    create_project_graph_review_record,
    get_project_graph_review_record,
    list_project_graph_review_records,
)


class EventGraphReviewRecordTest(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def tearDown(self) -> None:
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def _create_draft(self, db, tmpdir: str):
        request = EventGraphProjectDraftRequest(
            idea=EventGraphIdeaRequest(
                idea_text="我想做一个可以语音控制的送货小车",
                age=8,
                available_hardware=["Arduino", "超声波传感器", "小车底盘"],
            ),
            draft_title="语音送货小车项目",
        )
        return create_generated_project_draft(db, "IDEA-VOICE-CAR-L2", request, Path(tmpdir), created_by="teacher-a")

    def test_create_review_record_tracks_decision_without_activating_package(self) -> None:
        payload = EventGraphReviewRecordCreateRequest(
            review_stage="teaching_research_review",
            reviewer_id="researcher-a",
            reviewer_role="teaching_research",
            decision="approved",
            decision_reason="知识链、年龄阶段和AI边界均可进入项目包校验。",
            required_changes=[],
            graph_changes_json={
                "candidate_edges": [
                    {"relation_type": "generated_package", "from": "draft", "to": "package"},
                    {"relation_type": "idea_targets_knowledge", "from": "idea", "to": "knowledge"},
                ]
            },
        )

        with tempfile.TemporaryDirectory() as tmpdir, self.SessionLocal() as db:
            draft = self._create_draft(db, tmpdir)
            review = create_project_graph_review_record(db, draft.draft_id, payload)

            self.assertEqual(review.draft_id, draft.draft_id)
            self.assertEqual(review.package_id, draft.package_id)
            self.assertEqual(review.decision, "approved")
            self.assertEqual(review.review_stage, "teaching_research_review")
            self.assertEqual(review.draft_status_after, "ready_for_project_package_review")
            self.assertEqual(review.status_flow_json, ["draft", "teacher_confirmed", "system_validated", "ready_for_project_package_review"])
            self.assertEqual(review.graph_changes_json["candidate_edges"][0]["relation_type"], "generated_package")

            persisted = get_project_graph_review_record(db, review.review_id)
            self.assertEqual(persisted.review_id, review.review_id)
            self.assertEqual(list_project_graph_review_records(db, draft_id=draft.draft_id)[0].review_id, review.review_id)

            db.refresh(draft)
            self.assertEqual(draft.status, "draft")
            self.assertEqual(draft.lifecycle_stage, "draft")
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectPackage)), 0)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectRAGIndexJob)), 0)

    def test_changes_requested_review_keeps_required_changes_and_draft_status(self) -> None:
        payload = EventGraphReviewRecordCreateRequest(
            review_stage="teacher_confirmation",
            reviewer_id="teacher-a",
            reviewer_role="teacher",
            decision="changes_requested",
            decision_reason="材料数量不足，需要调整为半班轮换。",
            required_changes=["补充材料分组方案", "降低课堂一次性搭建复杂度"],
            graph_changes_json={},
        )

        with tempfile.TemporaryDirectory() as tmpdir, self.SessionLocal() as db:
            draft = self._create_draft(db, tmpdir)
            review = create_project_graph_review_record(db, draft.draft_id, payload)

            self.assertEqual(review.draft_status_after, "draft_changes_requested")
            self.assertEqual(review.required_changes, ["补充材料分组方案", "降低课堂一次性搭建复杂度"])
            db.refresh(draft)
            self.assertEqual(draft.status, "draft")

    def test_review_record_routes_are_registered(self) -> None:
        route_paths = {getattr(route, "path", "") for route in router.routes}
        self.assertIn("/event-graph/generated-project-drafts/{draft_id}/review-records", route_paths)
        self.assertIn("/event-graph/generated-project-drafts/{draft_id}/review-records/{review_id}", route_paths)


if __name__ == "__main__":
    unittest.main()
