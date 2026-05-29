from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field

from backend.app.schemas.common import ORMModel


EventGraphTargetUse = Literal["classroom", "parent_showcase", "competition", "portfolio", "zongping"]
EventGraphGenerationMode = Literal["reuse_existing", "variant", "new_package"]
EventGraphReviewStage = Literal["teacher_confirmation", "system_validation", "teaching_research_review"]
EventGraphReviewDecision = Literal["approved", "changes_requested", "rejected", "teacher_confirmed", "system_validated"]
EventGraphSlotType = Literal[
    "pre_remediation",
    "synchronous_carrier",
    "extension_challenge",
    "review_repair",
    "competition_packaging",
    "zongping_portfolio",
]


class EventGraphIdeaRequest(BaseModel):
    idea_text: str = Field(..., min_length=1)
    age: Optional[int] = Field(default=None, ge=3, le=18)
    age_band: Optional[str] = None
    current_project_id: Optional[str] = None
    known_knowledge_point_ids: list[str] = Field(default_factory=list)
    available_hardware: list[str] = Field(default_factory=list)
    duration_hours: Optional[int] = Field(default=None, ge=1)
    target_use: EventGraphTargetUse = "classroom"
    teacher_constraints: list[str] = Field(default_factory=list)


class EventGraphStageDecision(BaseModel):
    age_band: str
    slot_type: EventGraphSlotType
    confidence: float
    reason: str


class EventGraphKnowledgeChain(BaseModel):
    before: list[str] = Field(default_factory=list)
    core: list[str] = Field(default_factory=list)
    after: list[str] = Field(default_factory=list)


class EventGraphInsertionSlot(BaseModel):
    slot_type: EventGraphSlotType
    position: str
    anchor_project_keywords: list[str] = Field(default_factory=list)
    score: float
    reason: str


class EventGraphGenerationRecommendation(BaseModel):
    mode: EventGraphGenerationMode
    reason: str
    required_review: list[str] = Field(default_factory=list)


class EventGraphPositioningResponse(BaseModel):
    stage_decision: EventGraphStageDecision
    knowledge_chain: EventGraphKnowledgeChain
    insertion_slots: list[EventGraphInsertionSlot] = Field(default_factory=list)
    candidate_existing_project_keywords: list[str] = Field(default_factory=list)
    generation_recommendation: EventGraphGenerationRecommendation
    risk_flags: list[str] = Field(default_factory=list)


class EventGraphProjectDraftRequest(BaseModel):
    idea: EventGraphIdeaRequest
    draft_title: Optional[str] = None
    teacher_notes: list[str] = Field(default_factory=list)


class EventGraphProjectDraftResponse(BaseModel):
    idea_id: str
    status: Literal["draft"]
    files: list[str] = Field(default_factory=list)
    positioning: EventGraphPositioningResponse
    project_manifest: dict[str, Any]
    package_files: dict[str, Any]
    validation_preview: dict[str, Any]


class EventGraphProjectDraftExportResponse(BaseModel):
    idea_id: str
    package_id: str
    project_id: str
    status: Literal["draft"]
    package_dir: str
    manifest_path: str
    export_manifest_path: str
    files: list[str] = Field(default_factory=list)
    validation_preview: dict[str, Any]


class EventGraphGeneratedProjectDraftCreateRequest(BaseModel):
    draft: EventGraphProjectDraftRequest
    created_by: str = "event_graph_planner"
    overwrite_export: bool = True


class EventGraphGeneratedProjectDraftRead(ORMModel):
    draft_id: str
    idea_id: str
    package_id: str
    project_id: str
    title: str
    age_band: str
    slot_type: str
    generation_mode: str
    status: Literal["draft"]
    lifecycle_stage: Literal["draft"]
    package_dir: str
    manifest_path: str
    export_manifest_path: str
    request_json: dict[str, Any] = Field(default_factory=dict)
    positioning_json: dict[str, Any] = Field(default_factory=dict)
    draft_payload_json: dict[str, Any] = Field(default_factory=dict)
    validation_summary_json: dict[str, Any] = Field(default_factory=dict)
    export_paths_json: dict[str, Any] = Field(default_factory=dict)
    created_by: str
    reviewed_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class EventGraphReviewRecordCreateRequest(BaseModel):
    review_stage: EventGraphReviewStage
    reviewer_id: str = Field(..., min_length=1)
    reviewer_role: str = Field(..., min_length=1)
    decision: EventGraphReviewDecision
    decision_reason: str = Field(..., min_length=1)
    required_changes: list[str] = Field(default_factory=list)
    graph_changes_json: dict[str, Any] = Field(default_factory=dict)


class EventGraphReviewRecordRead(ORMModel):
    review_id: str
    draft_id: str
    package_id: str
    project_id: str
    reviewer_id: str
    reviewer_role: str
    review_stage: str
    decision: str
    decision_reason: str
    required_changes: list[str] = Field(default_factory=list)
    graph_changes_json: dict[str, Any] = Field(default_factory=dict)
    status_flow_json: list[str] = Field(default_factory=list)
    draft_status_before: str
    draft_status_after: str
    created_at: datetime
