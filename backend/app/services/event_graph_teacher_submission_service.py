from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from sqlalchemy.orm import Session

from backend.app.schemas.event_graph import (
    EventGraphProjectDraftRequest,
    EventGraphReviewRecordCreateRequest,
    EventGraphTeacherIdeaSubmissionRequest,
    EventGraphTeacherIdeaSubmissionResponse,
)
from backend.app.services.event_graph_generated_draft_service import create_generated_project_draft
from backend.app.services.event_graph_review_service import create_project_graph_review_record


def _submission_idea_id(request: EventGraphTeacherIdeaSubmissionRequest) -> str:
    if request.idea_id:
        return request.idea_id
    return f"IDEA-TEACHER-{uuid4().hex[:12].upper()}"


def submit_teacher_project_idea(
    db: Session,
    request: EventGraphTeacherIdeaSubmissionRequest,
    output_root: Path | None = None,
) -> EventGraphTeacherIdeaSubmissionResponse:
    idea_id = _submission_idea_id(request)
    draft_request = EventGraphProjectDraftRequest(
        idea=request.idea,
        draft_title=request.draft_title,
        teacher_notes=request.teacher_notes,
    )
    draft = create_generated_project_draft(
        db,
        idea_id,
        draft_request,
        output_root=output_root,
        created_by=request.teacher_id,
        overwrite_export=request.overwrite_export,
    )
    teacher_confirmation = create_project_graph_review_record(
        db,
        draft.draft_id,
        EventGraphReviewRecordCreateRequest(
            review_stage="teacher_confirmation",
            reviewer_id=request.teacher_id,
            reviewer_role="teacher",
            decision="teacher_confirmed",
            decision_reason=request.teacher_confirmation_reason,
            required_changes=[],
            graph_changes_json={
                "source": "teacher_project_idea_submission",
                "positioning": draft.positioning_json,
                "risk_flags": draft.validation_summary_json.get("risk_flags", []),
            },
        ),
    )
    db.refresh(draft)
    return EventGraphTeacherIdeaSubmissionResponse(
        draft=draft,
        teacher_confirmation=teacher_confirmation,
        positioning=draft.positioning_json,
    )
