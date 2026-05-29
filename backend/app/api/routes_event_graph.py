from __future__ import annotations

from fastapi import APIRouter

from backend.app.schemas.event_graph import (
    EventGraphIdeaRequest,
    EventGraphPositioningResponse,
    EventGraphProjectDraftRequest,
    EventGraphProjectDraftResponse,
)
from backend.app.services.event_graph_planner_service import generate_project_draft, position_teacher_idea

router = APIRouter(prefix="/event-graph", tags=["event-graph"])


@router.post("/ideas/position", response_model=EventGraphPositioningResponse)
def position_event_graph_idea(payload: EventGraphIdeaRequest) -> EventGraphPositioningResponse:
    return position_teacher_idea(payload)


@router.post("/ideas/{idea_id}/generate-project-draft", response_model=EventGraphProjectDraftResponse)
def generate_event_graph_project_draft(
    idea_id: str,
    payload: EventGraphProjectDraftRequest,
) -> EventGraphProjectDraftResponse:
    return generate_project_draft(idea_id, payload)
