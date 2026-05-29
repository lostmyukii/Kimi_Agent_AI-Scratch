from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


EventGraphTargetUse = Literal["classroom", "parent_showcase", "competition", "portfolio", "zongping"]
EventGraphGenerationMode = Literal["reuse_existing", "variant", "new_package"]
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
