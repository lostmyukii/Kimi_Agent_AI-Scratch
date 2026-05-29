from __future__ import annotations

import unittest

from backend.app.schemas.event_graph import EventGraphIdeaRequest, EventGraphProjectDraftRequest
from backend.app.api.routes_event_graph import generate_event_graph_project_draft, router
from backend.app.services.event_graph_planner_service import generate_project_draft, position_teacher_idea
from backend.app.services.project_plugin_service import REQUIRED_PACKAGE_FILES, REQUIRED_PROJECT_FIELDS, SEVEN_DIMENSIONS


class EventGraphPlannerServiceTest(unittest.TestCase):
    def test_l1_competition_request_stays_pre_remediation(self) -> None:
        result = position_teacher_idea(
            EventGraphIdeaRequest(
                idea_text="幼儿园孩子想参加机器人竞赛，做一个自动完成任务的小车",
                age=5,
                target_use="competition",
            )
        )

        self.assertEqual(result.stage_decision.age_band, "L1")
        self.assertEqual(result.stage_decision.slot_type, "pre_remediation")
        self.assertEqual(result.generation_recommendation.mode, "reuse_existing")
        self.assertIn("age_risk", result.risk_flags)

    def test_l2_voice_delivery_car_becomes_project_variant(self) -> None:
        result = position_teacher_idea(
            EventGraphIdeaRequest(
                idea_text="我想做一个可以语音控制的送货小车",
                age=8,
                available_hardware=["Arduino", "超声波传感器", "小车底盘"],
            )
        )

        self.assertEqual(result.stage_decision.age_band, "L2")
        self.assertEqual(result.stage_decision.slot_type, "synchronous_carrier")
        self.assertEqual(result.generation_recommendation.mode, "variant")
        self.assertIn("C2-L2-08 AI对话/语音辅助", result.knowledge_chain.core)
        self.assertIn("语音指令小车", result.candidate_existing_project_keywords)

    def test_l3_data_ai_idea_maps_to_system_design(self) -> None:
        result = position_teacher_idea(
            EventGraphIdeaRequest(
                idea_text="做一个能分析校园温湿度数据并给出AI建议的监测系统",
                age_band="L3",
                available_hardware=["ESP32", "温湿度传感器"],
            )
        )

        self.assertEqual(result.stage_decision.age_band, "L3")
        self.assertIn("E3-L3-01 系统设计", result.knowledge_chain.core)
        self.assertIn("校园物联网数据监测中心", result.candidate_existing_project_keywords)

    def test_direct_code_generation_is_flagged_as_ai_overreliance(self) -> None:
        result = position_teacher_idea(
            EventGraphIdeaRequest(
                idea_text="让AI直接生成完整代码，学生复制后展示",
                age=11,
            )
        )

        self.assertIn("ai_overreliance_risk", result.risk_flags)

    def test_generate_project_draft_returns_complete_project_package(self) -> None:
        draft = generate_project_draft(
            "IDEA-VOICE-CAR-L2",
            EventGraphProjectDraftRequest(
                idea=EventGraphIdeaRequest(
                    idea_text="我想做一个可以语音控制的送货小车",
                    age=8,
                    available_hardware=["Arduino", "超声波传感器", "小车底盘"],
                    duration_hours=8,
                ),
                draft_title="语音送货小车项目",
            ),
        )

        self.assertEqual(draft.status, "draft")
        self.assertEqual(set(draft.files), set(REQUIRED_PACKAGE_FILES.keys()))
        self.assertFalse(draft.validation_preview["can_activate"])
        self.assertIn("teaching_research_review", draft.validation_preview["required_review"])
        for field in REQUIRED_PROJECT_FIELDS:
            self.assertIn(field, draft.project_manifest)
        for filename in REQUIRED_PACKAGE_FILES:
            self.assertIn(filename, draft.package_files)
        guardrails = draft.package_files["ai_guardrails.json"]
        self.assertIn("anti_cognitive_offloading", guardrails)
        self.assertIn("防认知卸载机制", guardrails)
        dimensions = [item["dimension"] for item in draft.package_files["assessment.json"]["dimensions"]]
        for dimension in SEVEN_DIMENSIONS:
            self.assertIn(dimension, dimensions)

    def test_generate_project_draft_never_activates_l1_competition_request(self) -> None:
        draft = generate_project_draft(
            "IDEA-L1-COMPETITION",
            EventGraphProjectDraftRequest(
                idea=EventGraphIdeaRequest(
                    idea_text="幼儿园孩子想参加机器人竞赛，做一个自动完成任务的小车",
                    age=5,
                    target_use="competition",
                )
            ),
        )

        self.assertEqual(draft.status, "draft")
        self.assertEqual(draft.project_manifest["status"], "draft")
        self.assertEqual(draft.project_manifest["age_band"], "L1")
        self.assertEqual(draft.project_manifest["target_competitions"], [])
        self.assertIn("age_risk", draft.positioning.risk_flags)
        self.assertIn("teacher_review", draft.validation_preview["required_review"])

    def test_generate_project_draft_route_is_registered_and_returns_contract(self) -> None:
        route_paths = {getattr(route, "path", "") for route in router.routes}
        self.assertIn("/event-graph/ideas/{idea_id}/generate-project-draft", route_paths)

        draft = generate_event_graph_project_draft(
            "IDEA-VOICE-CAR-L2",
            EventGraphProjectDraftRequest(
                idea=EventGraphIdeaRequest(
                    idea_text="我想做一个可以语音控制的送货小车",
                    age=8,
                )
            ),
        )

        self.assertEqual(draft.idea_id, "IDEA-VOICE-CAR-L2")
        self.assertEqual(draft.status, "draft")
        self.assertIn("project.json", draft.files)


if __name__ == "__main__":
    unittest.main()
