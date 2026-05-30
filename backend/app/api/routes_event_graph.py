from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.security import require_admin
from backend.app.models import AuthUser
from backend.app.schemas.event_graph import (
    EventGraphGeneratedProjectDraftCreateRequest,
    EventGraphGeneratedProjectDraftRead,
    EventGraphIdeaRequest,
    EventGraphPositioningResponse,
    EventGraphProjectDraftExportResponse,
    EventGraphProjectPackageReviewRequest,
    EventGraphProjectPackageReviewResponse,
    EventGraphProjectDraftRequest,
    EventGraphProjectDraftResponse,
    EventGraphReviewRecordCreateRequest,
    EventGraphReviewRecordRead,
    EventGraphTeacherIdeaSubmissionRequest,
    EventGraphTeacherIdeaSubmissionResponse,
)
from backend.app.services.event_graph_draft_export_service import export_project_draft_package
from backend.app.services.event_graph_generated_draft_service import (
    create_generated_project_draft,
    get_generated_project_draft,
    list_generated_project_drafts,
)
from backend.app.services.event_graph_package_review_service import prepare_generated_draft_for_project_package_review
from backend.app.services.event_graph_planner_service import generate_project_draft, position_teacher_idea
from backend.app.services.event_graph_review_service import (
    create_project_graph_review_record,
    get_project_graph_review_record,
    list_project_graph_review_records,
)
from backend.app.services.event_graph_teacher_submission_service import submit_teacher_project_idea

router = APIRouter(prefix="/event-graph", tags=["event-graph"])


@router.post("/ideas/position", response_model=EventGraphPositioningResponse)
def position_event_graph_idea(payload: EventGraphIdeaRequest) -> EventGraphPositioningResponse:
    return position_teacher_idea(payload)


@router.post("/teacher-project-ideas", response_model=EventGraphTeacherIdeaSubmissionResponse)
def submit_event_graph_teacher_project_idea(
    payload: EventGraphTeacherIdeaSubmissionRequest,
    db: Session = Depends(get_db),
) -> EventGraphTeacherIdeaSubmissionResponse:
    return submit_teacher_project_idea(db, payload)


@router.post("/ideas/{idea_id}/generate-project-draft", response_model=EventGraphProjectDraftResponse)
def generate_event_graph_project_draft(
    idea_id: str,
    payload: EventGraphProjectDraftRequest,
) -> EventGraphProjectDraftResponse:
    return generate_project_draft(idea_id, payload)


@router.post("/ideas/{idea_id}/export-project-draft", response_model=EventGraphProjectDraftExportResponse)
def export_event_graph_project_draft(
    idea_id: str,
    payload: EventGraphProjectDraftRequest,
) -> EventGraphProjectDraftExportResponse:
    return export_project_draft_package(idea_id, payload)


@router.post("/ideas/{idea_id}/generated-project-drafts", response_model=EventGraphGeneratedProjectDraftRead)
def create_event_graph_generated_project_draft(
    idea_id: str,
    payload: EventGraphGeneratedProjectDraftCreateRequest,
    db: Session = Depends(get_db),
) -> EventGraphGeneratedProjectDraftRead:
    return create_generated_project_draft(
        db,
        idea_id,
        payload.draft,
        created_by=payload.created_by,
        overwrite_export=payload.overwrite_export,
    )


@router.get("/generated-project-drafts", response_model=list[EventGraphGeneratedProjectDraftRead])
def list_event_graph_generated_project_drafts(
    status: Optional[str] = Query(default=None),
    idea_id: Optional[str] = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[EventGraphGeneratedProjectDraftRead]:
    return list_generated_project_drafts(db, status=status, idea_id=idea_id, limit=limit)


@router.get("/generated-project-drafts/{draft_id}", response_model=EventGraphGeneratedProjectDraftRead)
def get_event_graph_generated_project_draft(
    draft_id: str,
    db: Session = Depends(get_db),
) -> EventGraphGeneratedProjectDraftRead:
    try:
        return get_generated_project_draft(db, draft_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/generated-project-drafts/{draft_id}/review-records", response_model=EventGraphReviewRecordRead)
def create_event_graph_review_record(
    draft_id: str,
    payload: EventGraphReviewRecordCreateRequest,
    db: Session = Depends(get_db),
) -> EventGraphReviewRecordRead:
    try:
        return create_project_graph_review_record(db, draft_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/generated-project-drafts/{draft_id}/review-records", response_model=list[EventGraphReviewRecordRead])
def list_event_graph_review_records(
    draft_id: str,
    review_stage: Optional[str] = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[EventGraphReviewRecordRead]:
    return list_project_graph_review_records(db, draft_id=draft_id, review_stage=review_stage, limit=limit)


@router.get("/generated-project-drafts/{draft_id}/review-records/{review_id}", response_model=EventGraphReviewRecordRead)
def get_event_graph_review_record(
    draft_id: str,
    review_id: str,
    db: Session = Depends(get_db),
) -> EventGraphReviewRecordRead:
    try:
        record = get_project_graph_review_record(db, review_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    if record.draft_id != draft_id:
        raise HTTPException(status_code=404, detail=f"审核记录不属于草案：{draft_id}")
    return record


@router.post(
    "/generated-project-drafts/{draft_id}/project-package-review",
    response_model=EventGraphProjectPackageReviewResponse,
)
def prepare_event_graph_project_package_review(
    draft_id: str,
    payload: EventGraphProjectPackageReviewRequest,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(require_admin),
) -> EventGraphProjectPackageReviewResponse:
    try:
        effective_payload = payload.model_copy(update={"actor": current_user.user_id})
        return prepare_generated_draft_for_project_package_review(db, draft_id, effective_payload)
    except ValueError as exc:
        status_code = 409 if "ready_for_project_package_review" in str(exc) else 404
        raise HTTPException(status_code=status_code, detail=str(exc)) from exc
