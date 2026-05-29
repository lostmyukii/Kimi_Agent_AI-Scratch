from __future__ import annotations

import re

from backend.app.schemas.event_graph import (
    EventGraphGenerationRecommendation,
    EventGraphIdeaRequest,
    EventGraphInsertionSlot,
    EventGraphKnowledgeChain,
    EventGraphProjectDraftRequest,
    EventGraphProjectDraftResponse,
    EventGraphPositioningResponse,
    EventGraphStageDecision,
    EventGraphSlotType,
)
from backend.app.services.project_plugin_service import REQUIRED_PACKAGE_FILES, SEVEN_DIMENSIONS


AGE_BANDS: tuple[tuple[str, int, int], ...] = (
    ("L1", 3, 6),
    ("L2", 7, 9),
    ("L3", 10, 12),
    ("L4", 13, 15),
    ("L5", 16, 18),
)

AGE_RANGES = {
    "L1": "3-6",
    "L2": "7-9",
    "L3": "10-12",
    "L4": "13-15",
    "L5": "16-18",
}

AI_ASSIST_LIMITS = {
    "L1": "0%，仅允许教师端演示和备课辅助",
    "L2": "不超过50%",
    "L3": "不超过30%",
    "L4": "不超过20%",
    "L5": "不超过10%",
}


def _has_any(text: str, keywords: tuple[str, ...]) -> bool:
    normalized = text.lower()
    return any(keyword.lower() in normalized for keyword in keywords)


def _unique(values: list[str]) -> list[str]:
    return list(dict.fromkeys(item for item in values if item))


def _slug(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return slug or "idea"


def infer_age_band(idea: EventGraphIdeaRequest) -> str:
    if idea.age_band:
        return idea.age_band
    if idea.age is None:
        return "L3"
    for age_band, start, end in AGE_BANDS:
        if start <= idea.age <= end:
            return age_band
    if idea.age < 3:
        return "L1"
    return "L5"


def build_knowledge_chain(idea: EventGraphIdeaRequest, age_band: str) -> EventGraphKnowledgeChain:
    text = idea.idea_text
    hardware_text = " ".join(idea.available_hardware)
    has_car = _has_any(f"{text} {hardware_text}", ("小车", "机器人", "车", "巡逻", "送货"))
    has_voice = _has_any(text, ("语音", "声音", "说话", "指令"))
    has_data = _has_any(text, ("数据", "统计", "图表", "分析", "监测"))
    has_ai = _has_any(text, ("AI", "人工智能", "识别", "模型", "视觉", "LLM", "RAG"))
    has_algorithm = _has_any(text, ("算法", "路径", "规划", "搜索", "排序", "图论", "动态规划"))

    if age_band == "L1":
        return EventGraphKnowledgeChain(
            before=["具身感知", "安全操作", "简单模仿"],
            core=["因果关系", "序列指令", "表达复述"],
            after=["条件逻辑体验", "分类排序", "合作展示"],
        )
    if age_band == "L2" and has_car:
        core = ["C2-L2-02 事件驱动", "C2-L2-03 条件判断", "P2-L2-06 电机控制基础", "E2-L2-01 项目规划"]
        if has_voice:
            core.insert(1, "C2-L2-08 AI对话/语音辅助")
        return EventGraphKnowledgeChain(
            before=["C1-L1-04 序列指令", "M2-L2-02 角度与方向"],
            core=core,
            after=["P2-L2-05 超声波测距", "E2-L2-03 测试调试", "C3-L3-02 函数与模块"],
        )
    if age_band == "L3" and (has_data or has_ai):
        return EventGraphKnowledgeChain(
            before=["C3-L3-01 Python基础", "C3-L3-02 函数与模块"],
            core=["C3-L3-04 简单AI Agent", "M3-L3-04 数据统计", "E3-L3-01 系统设计"],
            after=["C4-L4-03 Edge AI部署", "E4-L4-04 技术报告", "E4-L4-05 Git协作"],
        )
    if age_band in {"L4", "L5"} and has_algorithm:
        return EventGraphKnowledgeChain(
            before=["变量与数组", "函数模块化", "复杂度意识"],
            core=["C4-L4-01 C++算法基础", "M4-L4-01 复杂度分析", "E4-L4-01 竞赛策略"],
            after=["C5-L5-02 LLM应用开发", "E5-L5-04 科研报告", "系统架构设计"],
        )
    return EventGraphKnowledgeChain(
        before=["当前阶段基础知识点"],
        core=["项目规划", "逻辑建模", "交付表达"],
        after=["迭代优化", "综合展示", "下一阶段衔接"],
    )


def decide_slot_type(idea: EventGraphIdeaRequest, age_band: str) -> tuple[EventGraphSlotType, str]:
    if idea.target_use == "competition":
        if age_band == "L1":
            return "pre_remediation", "L1不直接进入竞赛路径，只做前置能力和课堂展示。"
        return "competition_packaging", "目标用途是竞赛，应优先生成竞赛包装和证据材料。"
    if idea.target_use in {"portfolio", "zongping"}:
        return "zongping_portfolio", "目标用途是作品集或综评，应强化证据、报告和展示材料。"
    if idea.known_knowledge_point_ids:
        return "extension_challenge", "已有知识点输入，适合作为延伸挑战或变体项目。"
    if age_band == "L1":
        return "pre_remediation", "L1适合作为具身体验和前置补齐，不直接生成学生端复杂项目。"
    return "synchronous_carrier", "教师思路可作为当前阶段核心知识点的项目载体。"


def candidate_project_keywords(idea: EventGraphIdeaRequest, age_band: str) -> list[str]:
    text = idea.idea_text
    candidates: list[str] = []
    if age_band == "L2" and _has_any(text, ("小车", "送货", "巡逻", "机器人")):
        candidates.extend(["Arduino超声波避障小车", "快递分拣机器人", "循线机器人挑战"])
    if _has_any(text, ("语音", "声音", "说话")):
        candidates.extend(["语音指令小车", "语音助手", "AI对话辅助"])
    if _has_any(text, ("数据", "统计", "图表", "分析", "监测")):
        candidates.extend(["智能数据侦探", "校园物联网数据监测中心", "数据侦探AI"])
    if _has_any(text, ("视觉", "识别", "图像", "手势")):
        candidates.extend(["AI视觉手势识别交互系统", "颜色魔法师", "表情识别相机"])
    return _unique(candidates or ["同阶段项目库候选项目"])


def risk_flags_for(idea: EventGraphIdeaRequest, age_band: str) -> list[str]:
    flags: list[str] = []
    if age_band == "L1" and (idea.target_use == "competition" or _has_any(idea.idea_text, ("生成代码", "AI直接做", "自动完成"))):
        flags.append("age_risk")
    if not idea.available_hardware and _has_any(idea.idea_text, ("小车", "机器人", "传感器", "Arduino", "ESP32")):
        flags.append("hardware_unknown")
    if _has_any(idea.idea_text, ("完整代码", "直接生成程序", "自动写完")):
        flags.append("ai_overreliance_risk")
    return flags


def generation_recommendation(
    idea: EventGraphIdeaRequest,
    candidates: list[str],
    risk_flags: list[str],
) -> EventGraphGenerationRecommendation:
    if "age_risk" in risk_flags:
        return EventGraphGenerationRecommendation(
            mode="reuse_existing",
            reason="存在年龄或AI使用风险，先复用现有项目或生成教师端活动，不生成新项目包。",
            required_review=["teacher_review", "teaching_research_review"],
        )
    if len(candidates) >= 2 and not re.search(r"全新|没有|补一个|新增|新方向", idea.idea_text):
        return EventGraphGenerationRecommendation(
            mode="variant",
            reason="已有相近项目，优先生成同ProjectSet下的场景变体，降低入库和实施风险。",
            required_review=["schema_validation", "teaching_research_review"],
        )
    return EventGraphGenerationRecommendation(
        mode="new_package",
        reason="现有项目匹配不足，可生成新的ProjectPackage草案并进入审核。",
        required_review=["schema_validation", "knowledge_map_review", "ai_guardrail_review", "teaching_research_review"],
    )


def position_teacher_idea(idea: EventGraphIdeaRequest) -> EventGraphPositioningResponse:
    age_band = infer_age_band(idea)
    slot_type, reason = decide_slot_type(idea, age_band)
    knowledge_chain = build_knowledge_chain(idea, age_band)
    candidates = candidate_project_keywords(idea, age_band)
    risks = risk_flags_for(idea, age_band)

    confidence = 0.72
    if idea.age_band or idea.age is not None:
        confidence += 0.08
    if candidates and candidates[0] != "同阶段项目库候选项目":
        confidence += 0.08
    if risks:
        confidence -= 0.12
    confidence = max(0.35, min(0.95, round(confidence, 2)))

    slot = EventGraphInsertionSlot(
        slot_type=slot_type,
        position="after_current_or_before_next",
        anchor_project_keywords=candidates[:3],
        score=confidence,
        reason=reason,
    )

    return EventGraphPositioningResponse(
        stage_decision=EventGraphStageDecision(age_band=age_band, slot_type=slot_type, confidence=confidence, reason=reason),
        knowledge_chain=knowledge_chain,
        insertion_slots=[slot],
        candidate_existing_project_keywords=candidates,
        generation_recommendation=generation_recommendation(idea, candidates, risks),
        risk_flags=risks,
    )


def _default_title(request: EventGraphProjectDraftRequest, positioning: EventGraphPositioningResponse) -> str:
    if request.draft_title:
        return request.draft_title
    if positioning.candidate_existing_project_keywords:
        return f"{positioning.candidate_existing_project_keywords[0]}变体项目"
    return "事理图谱生成项目草案"


def _difficulty_range(age_band: str) -> list[int]:
    return {
        "L1": [1, 3],
        "L2": [2, 5],
        "L3": [3, 6],
        "L4": [5, 8],
        "L5": [6, 10],
    }.get(age_band, [3, 6])


def _manifest_for_draft(
    idea_id: str,
    request: EventGraphProjectDraftRequest,
    positioning: EventGraphPositioningResponse,
    title: str,
) -> dict:
    age_band = positioning.stage_decision.age_band
    project_id = f"EG-{age_band}-{_slug(idea_id).upper()}"
    package_id = f"pkg-event-graph-{_slug(idea_id)}"
    hardware = request.idea.available_hardware or ["待教师确认的课堂器材"]
    target_competitions: list[str] = []
    if age_band != "L1" and request.idea.target_use == "competition":
        target_competitions = ["待按当年规则确认的竞赛方向"]

    return {
        "project_id": project_id,
        "package_id": package_id,
        "name": title,
        "version": "0.1.0",
        "status": "draft",
        "lifecycle_stage": "draft",
        "age_band": age_band,
        "age_range": AGE_RANGES.get(age_band, "10-12"),
        "course_series": "EVENT_GRAPH_GENERATED",
        "course_track": ["事理图谱", positioning.stage_decision.slot_type, positioning.generation_recommendation.mode],
        "duration_hours": request.idea.duration_hours or 8,
        "difficulty_range": _difficulty_range(age_band),
        "project_maturity_level": "draft",
        "target_exams": [],
        "target_competitions": target_competitions,
        "recommended_exams": [],
        "recommended_competitions": target_competitions,
        "display_exam_tags": [],
        "display_competition_tags": target_competitions,
        "knowledge_point_ids": positioning.knowledge_chain.core,
        "ai_competency_ids": [item for item in positioning.knowledge_chain.core if "AI" in item or "ai" in item.lower()],
        "hardware_stack": hardware,
        "software_stack": ["Scratch/图形化编程或同阶段工具", "教师确认后补齐"],
        "evidence_outputs": ["项目草图", "调试记录", "学生讲解卡", "课堂展示材料"],
        "zongping_categories": [] if age_band in {"L1", "L2"} else ["研究性学习", "科技创新活动"],
        "competition_categories": target_competitions,
        "prerequisite_project_ids": [],
        "successor_project_ids": [],
        "rag_indexable": False,
        "recommendable": False,
        "alignment_quality_status": "draft_pending_review",
        "alignment_generated_by": "event_graph_planner",
        "source_idea_id": idea_id,
        "source_idea_text": request.idea.idea_text,
        "insert_slot_type": positioning.stage_decision.slot_type,
        "generation_mode": positioning.generation_recommendation.mode,
        "ai_assist_limit": AI_ASSIST_LIMITS.get(age_band, "按阶段控制"),
        "review_required": True,
    }


def _package_files_for_draft(
    manifest: dict,
    request: EventGraphProjectDraftRequest,
    positioning: EventGraphPositioningResponse,
) -> dict:
    title = str(manifest["name"])
    required_reviews = positioning.generation_recommendation.required_review
    if "teacher_review" not in required_reviews:
        required_reviews = ["teacher_review", *required_reviews]

    return {
        "project.json": manifest,
        "curriculum.md": (
            f"# {title}\n\n"
            f"教师思路：{request.idea.idea_text}\n\n"
            f"插入阶段：{positioning.stage_decision.slot_type}。\n\n"
            "本草案只提供项目包骨架，必须经过教师确认和教研审核后才能进入插件审核流程。"
        ),
        "lesson_plan.json": {
            "lessons": [
                {"stage": "问题定义", "focus": "学生先描述任务、约束和成功标准。"},
                {"stage": "方案设计", "focus": "连接前置知识、核心知识和可观察证据。"},
                {"stage": "实现调试", "focus": "保留失败记录、调试过程和学生解释。"},
                {"stage": "展示复盘", "focus": "形成讲解卡、家长视角和后续挑战。"},
            ],
            "teacher_confirmation_required": True,
        },
        "knowledge_map.json": {
            "prerequisite_knowledge_point_ids": positioning.knowledge_chain.before,
            "core_knowledge_point_ids": positioning.knowledge_chain.core,
            "extension_knowledge_point_ids": positioning.knowledge_chain.after,
            "candidate_existing_project_keywords": positioning.candidate_existing_project_keywords,
        },
        "materials.json": {
            "hardware": manifest["hardware_stack"],
            "software": manifest["software_stack"],
            "safety": ["用电安全", "器材边界确认", "学生隐私保护"],
            "to_be_confirmed": ["班级设备数量", "课时长度", "教师可接受的AI辅助比例"],
        },
        "assessment.json": {
            "dimensions": [
                {"dimension": dimension, "levels": ["待补齐", "达标", "优秀"], "evidence": "课堂作品与过程记录"}
                for dimension in SEVEN_DIMENSIONS
            ]
        },
        "ai_guardrails.json": {
            "ai_capabilities": ["生成启发问题", "辅助教师备课", "提供调试建议"],
            "student_obligatory_tasks": ["亲自完成问题描述", "亲自完成核心搭建/代码/调试", "亲自解释作品"],
            "ai_output_validation": ["学生必须复述AI建议并说明取舍", "教师抽查关键步骤"],
            "anti_cognitive_offloading": ["先学生草稿，再AI建议，再学生修改", "AI不得直接替代最终作品"],
            "AI使用边界": [manifest["ai_assist_limit"], "不生成可直接复制的完整代码"],
            "防认知卸载机制": ["解释门", "过程证据保留", "教师确认后再进入审核"],
        },
        "zongping_map.json": {
            "categories": manifest["zongping_categories"],
            "materials": manifest["evidence_outputs"],
            "review_note": "综评映射需教研审核后固化。",
        },
        "competition_map.json": {
            "competitions": manifest["target_competitions"],
            "fit_basis": "L1只作为前置能力和展示项目；L2+需按当年竞赛规则复核。",
            "risk_tips": ["不得直接包装课堂项目为竞赛项目", "不得跳过教研审核"],
        },
        "parent_view.md": f"{title} 会让学生围绕真实问题完成可讲、可演示、可复盘的作品。",
        "teacher_notes.md": "\n".join(request.teacher_notes or required_reviews),
        "README.md": "本目录由事理图谱生成项目草案产生，状态固定为 draft，需通过 ProjectPackage 审核后才能入库。",
    }


def generate_project_draft(idea_id: str, request: EventGraphProjectDraftRequest) -> EventGraphProjectDraftResponse:
    positioning = position_teacher_idea(request.idea)
    title = _default_title(request, positioning)
    manifest = _manifest_for_draft(idea_id, request, positioning, title)
    package_files = _package_files_for_draft(manifest, request, positioning)
    missing_files = [filename for filename in REQUIRED_PACKAGE_FILES if filename not in package_files]
    required_review = _unique(["teacher_review", *positioning.generation_recommendation.required_review, "project_package_validation"])
    if "teaching_research_review" not in required_review:
        required_review.append("teaching_research_review")

    validation_preview = {
        "can_activate": False,
        "status_flow": ["draft", "in_review", "approved", "active"],
        "required_review": required_review,
        "missing_files": missing_files,
        "risk_flags": positioning.risk_flags,
        "reason": "项目草案必须先通过教师确认、教研审核和项目插件校验，不能直接 active。",
    }

    return EventGraphProjectDraftResponse(
        idea_id=idea_id,
        status="draft",
        files=list(REQUIRED_PACKAGE_FILES.keys()),
        positioning=positioning,
        project_manifest=manifest,
        package_files=package_files,
        validation_preview=validation_preview,
    )
