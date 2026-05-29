from __future__ import annotations

import unittest

from backend.app.schemas.event_graph import EventGraphIdeaRequest
from backend.app.services.event_graph_planner_service import position_teacher_idea


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


if __name__ == "__main__":
    unittest.main()
