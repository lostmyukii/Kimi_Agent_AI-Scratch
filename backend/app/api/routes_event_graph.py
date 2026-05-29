from __future__ import annotations

from fastapi import APIRouter

from backend.app.schemas.event_graph import EventGraphIdeaRequest, EventGraphPositioningResponse
from backend.app.services.event_graph_planner_service import position_teacher_idea

router = APIRouter(prefix="/event-graph", tags=["event-graph"])


@router.post("/ideas/position", response_model=EventGraphPositioningResponse)
def position_event_graph_idea(payload: EventGraphIdeaRequest) -> EventGraphPositioningResponse:
    return position_teacher_idea(payload)
