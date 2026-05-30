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
from backend.app.models.event_graph import GeneratedProjectDraft, ProjectGraphReviewRecord
from backend.app.models.project_plugin import ProjectPackage, ProjectRAGIndexJob
from backend.app.schemas.event_graph import EventGraphIdeaRequest, EventGraphTeacherIdeaSubmissionRequest
from backend.app.services.event_graph_teacher_submission_service import submit_teacher_project_idea


class EventGraphTeacherSubmissionTest(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def tearDown(self) -> None:
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def test_teacher_submission_generates_draft_and_teacher_confirmation_without_project_package(self) -> None:
        request = EventGraphTeacherIdeaSubmissionRequest(
            idea=EventGraphIdeaRequest(
                idea_text="我想给10岁孩子做一个能语音控制的送货小车项目",
                age=10,
                available_hardware=["Arduino", "小车底盘", "语音模块"],
                duration_hours=8,
                target_use="classroom",
                teacher_constraints=["只生成项目骨架，不给完整代码"],
            ),
            draft_title="语音控制送货小车",
            teacher_notes=["先让学生画流程图，再用AI做建议"],
            teacher_id="teacher-a",
            teacher_confirmation_reason="教师已确认推理建议，提交进入草案队列。",
        )

        with tempfile.TemporaryDirectory() as tmpdir, self.SessionLocal() as db:
            result = submit_teacher_project_idea(db, request, output_root=Path(tmpdir))

            self.assertEqual(result.draft.status, "draft")
            self.assertEqual(result.draft.lifecycle_stage, "draft")
            self.assertEqual(result.draft.created_by, "teacher-a")
            self.assertEqual(result.positioning.stage_decision.age_band, "L3")
            self.assertIn(result.positioning.stage_decision.slot_type, result.draft.slot_type)
            self.assertEqual(result.teacher_confirmation.review_stage, "teacher_confirmation")
            self.assertEqual(result.teacher_confirmation.decision, "teacher_confirmed")
            self.assertEqual(result.teacher_confirmation.reviewer_id, "teacher-a")
            self.assertEqual(result.teacher_confirmation.draft_status_after, "teacher_confirmed")
            self.assertFalse(result.draft.validation_summary_json["can_activate"])
            self.assertEqual(db.scalar(select(func.count()).select_from(GeneratedProjectDraft)), 1)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectGraphReviewRecord)), 1)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectPackage)), 0)
            self.assertEqual(db.scalar(select(func.count()).select_from(ProjectRAGIndexJob)), 0)

    def test_teacher_submission_route_is_registered(self) -> None:
        route_paths = {getattr(route, "path", "") for route in router.routes}
        self.assertIn("/event-graph/teacher-project-ideas", route_paths)


if __name__ == "__main__":
    unittest.main()
