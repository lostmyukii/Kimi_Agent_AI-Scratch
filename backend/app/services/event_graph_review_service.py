from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.models.event_graph import ProjectGraphReviewRecord
from backend.app.schemas.event_graph import EventGraphReviewRecordCreateRequest
from backend.app.services.event_graph_generated_draft_service import get_generated_project_draft


STATUS_FLOW = ["draft", "teacher_confirmed", "system_validated", "ready_for_project_package_review"]


def _draft_status_after(review_stage: str, decision: str) -> str:
    if decision == "rejected":
        return "draft_rejected"
    if decision == "changes_requested":
        return "draft_changes_requested"
    if decision == "teacher_confirmed":
        return "teacher_confirmed"
    if decision == "system_validated":
        return "system_validated"
    if review_stage == "teaching_research_review" and decision == "approved":
        return "ready_for_project_package_review"
    return "draft_reviewed"


def _next_review_id(db: Session, draft_id: str, review_stage: str) -> str:
    count = db.scalar(
        select(func.count())
        .select_from(ProjectGraphReviewRecord)
        .where(ProjectGraphReviewRecord.draft_id == draft_id, ProjectGraphReviewRecord.review_stage == review_stage)
    )
    return f"review-{draft_id}-{review_stage}-{int(count or 0) + 1:03d}"


def create_project_graph_review_record(
    db: Session,
    draft_id: str,
    request: EventGraphReviewRecordCreateRequest,
) -> ProjectGraphReviewRecord:
    draft = get_generated_project_draft(db, draft_id)
    before_status = draft.status
    after_status = _draft_status_after(request.review_stage, request.decision)
    review = ProjectGraphReviewRecord(
        review_id=_next_review_id(db, draft_id, request.review_stage),
        draft_id=draft.draft_id,
        package_id=draft.package_id,
        project_id=draft.project_id,
        reviewer_id=request.reviewer_id,
        reviewer_role=request.reviewer_role,
        review_stage=request.review_stage,
        decision=request.decision,
        decision_reason=request.decision_reason,
        required_changes=request.required_changes,
        graph_changes_json=request.graph_changes_json,
        status_flow_json=STATUS_FLOW,
        draft_status_before=before_status,
        draft_status_after=after_status,
    )
    if request.decision in {"approved", "teacher_confirmed", "system_validated"}:
        draft.reviewed_by = request.reviewer_id
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def get_project_graph_review_record(db: Session, review_id: str) -> ProjectGraphReviewRecord:
    record = db.get(ProjectGraphReviewRecord, review_id)
    if record is None:
        raise ValueError(f"事理图谱审核记录不存在：{review_id}")
    return record


def list_project_graph_review_records(
    db: Session,
    *,
    draft_id: str | None = None,
    package_id: str | None = None,
    review_stage: str | None = None,
    limit: int = 100,
) -> list[ProjectGraphReviewRecord]:
    stmt = select(ProjectGraphReviewRecord).order_by(ProjectGraphReviewRecord.created_at.desc())
    if draft_id:
        stmt = stmt.where(ProjectGraphReviewRecord.draft_id == draft_id)
    if package_id:
        stmt = stmt.where(ProjectGraphReviewRecord.package_id == package_id)
    if review_stage:
        stmt = stmt.where(ProjectGraphReviewRecord.review_stage == review_stage)
    return list(db.scalars(stmt.limit(limit)).all())
