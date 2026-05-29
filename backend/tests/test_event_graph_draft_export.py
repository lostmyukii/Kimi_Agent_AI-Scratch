from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from backend.app.api.routes_event_graph import router
from backend.app.schemas.event_graph import EventGraphIdeaRequest, EventGraphProjectDraftRequest
from backend.app.services.event_graph_draft_export_service import export_project_draft_package
from backend.app.services.project_plugin_service import REQUIRED_PACKAGE_FILES, REQUIRED_PROJECT_FIELDS


class EventGraphDraftExportServiceTest(unittest.TestCase):
    def test_export_project_draft_package_writes_reviewable_draft_files(self) -> None:
        request = EventGraphProjectDraftRequest(
            idea=EventGraphIdeaRequest(
                idea_text="我想做一个可以语音控制的送货小车",
                age=8,
                available_hardware=["Arduino", "超声波传感器", "小车底盘"],
                duration_hours=8,
            ),
            draft_title="语音送货小车项目",
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            result = export_project_draft_package("IDEA-VOICE-CAR-L2", request, Path(tmpdir))

            self.assertEqual(result.status, "draft")
            self.assertEqual(set(result.files), set(REQUIRED_PACKAGE_FILES.keys()))
            for filename in REQUIRED_PACKAGE_FILES:
                self.assertTrue((Path(result.package_dir) / filename).exists(), filename)

            manifest = json.loads(Path(result.manifest_path).read_text(encoding="utf-8"))
            self.assertEqual(manifest["status"], "draft")
            self.assertEqual(manifest["lifecycle_stage"], "draft")
            self.assertFalse(manifest["rag_indexable"])
            self.assertFalse(manifest["recommendable"])
            for field in REQUIRED_PROJECT_FIELDS:
                self.assertIn(field, manifest)

            export_manifest = json.loads(Path(result.export_manifest_path).read_text(encoding="utf-8"))
            self.assertFalse(export_manifest["validation_preview"]["can_activate"])
            self.assertEqual(export_manifest["status_flow"], ["draft", "in_review", "approved", "active"])
            self.assertIn("project_package_validation", export_manifest["validation_preview"]["required_review"])

    def test_l1_competition_export_keeps_competition_targets_empty(self) -> None:
        request = EventGraphProjectDraftRequest(
            idea=EventGraphIdeaRequest(
                idea_text="幼儿园孩子想参加机器人竞赛，做一个自动完成任务的小车",
                age=5,
                target_use="competition",
            )
        )

        with tempfile.TemporaryDirectory() as tmpdir:
            result = export_project_draft_package("IDEA-L1-COMPETITION", request, Path(tmpdir))
            manifest = json.loads(Path(result.manifest_path).read_text(encoding="utf-8"))

        self.assertEqual(manifest["age_band"], "L1")
        self.assertEqual(manifest["target_competitions"], [])
        self.assertIn("age_risk", result.validation_preview["risk_flags"])
        self.assertIn("teacher_review", result.validation_preview["required_review"])

    def test_export_route_is_registered(self) -> None:
        route_paths = {getattr(route, "path", "") for route in router.routes}
        self.assertIn("/event-graph/ideas/{idea_id}/export-project-draft", route_paths)


if __name__ == "__main__":
    unittest.main()
