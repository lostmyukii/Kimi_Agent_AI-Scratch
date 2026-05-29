from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.models.event_graph import ProjectGraphReviewRecord
from backend.app.models.project_plugin import ProjectRAGIndexJob, ProjectValidationResult
from backend.app.schemas.event_graph import (
    EventGraphProjectPackageReviewRequest,
    EventGraphProjectPackageReviewResponse,
)
from backend.app.services.event_graph_generated_draft_service import get_generated_project_draft
from backend.app.services.project_plugin_service import (
    checksum_text,
    manifest_core,
    package_validation_summary,
    read_package_payloads,
    set_package_status,
    upsert_package_from_manifest,
    validate_project_package,
)


READY_STATUS = "ready_for_project_package_review"


def _latest_ready_review(db: Session, draft_id: str) -> ProjectGraphReviewRecord | None:
    return db.scalars(
        select(ProjectGraphReviewRecord)
        .where(ProjectGraphReviewRecord.draft_id == draft_id, ProjectGraphReviewRecord.draft_status_after == READY_STATUS)
        .order_by(ProjectGraphReviewRecord.created_at.desc())
        .limit(1)
    ).first()


def _deterministic_package_checksum(manifest: dict[str, Any], file_rows: list[tuple[str, str, str, str]]) -> str:
    payload = {
        "manifest": manifest_core(manifest),
        "files": [
            {"file_type": file_type, "file_name": file_name, "checksum": checksum}
            for file_type, _, file_name, checksum in sorted(file_rows, key=lambda row: (row[0], row[2], row[3]))
        ],
    }
    return checksum_text(json.dumps(payload, ensure_ascii=False, sort_keys=True))


def _validation_result_payload(rows: list[ProjectValidationResult]) -> list[dict[str, Any]]:
    return [
        {
            "validation_id": row.validation_id,
            "validation_type": row.validation_type,
            "passed": row.passed,
            "severity": row.severity,
            "message": row.message,
            "details_json": row.details_json or {},
        }
        for row in rows
    ]


def prepare_generated_draft_for_project_package_review(
    db: Session,
    draft_id: str,
    request: EventGraphProjectPackageReviewRequest,
) -> EventGraphProjectPackageReviewResponse:
    draft = get_generated_project_draft(db, draft_id)
    ready_review = _latest_ready_review(db, draft_id)
    if ready_review is None:
        raise ValueError(f"草案尚未达到 {READY_STATUS}，不能进入 ProjectPackage 校验/提审。")

    package_dir = Path(draft.package_dir)
    if not (package_dir / "project.json").exists():
        raise ValueError(f"草案项目包目录不可用：{package_dir}")

    manifest, _, file_rows = read_package_payloads(package_dir)
    manifest["status"] = "draft"
    manifest["lifecycle_stage"] = "draft"
    manifest["rag_indexable"] = False
    manifest["recommendable"] = False
    manifest["event_graph_review"] = {
        "source_draft_id": draft.draft_id,
        "source_idea_id": draft.idea_id,
        "ready_review_id": ready_review.review_id,
        "ready_review_stage": ready_review.review_stage,
        "ready_review_decision": ready_review.decision,
        "import_actor": request.actor,
    }

    checksum = _deterministic_package_checksum(manifest, file_rows)
    package = upsert_package_from_manifest(
        db,
        manifest,
        str(package_dir),
        checksum,
        file_rows,
        actor=request.actor,
        default_status="draft",
    )
    validation_rows = validate_project_package(db, package.package_id)
    validation_summary = package_validation_summary(validation_rows)

    submitted_for_review = False
    if request.submit_for_review and validation_summary["can_activate"]:
        package = set_package_status(db, package.package_id, "in_review", actor=request.actor)
        submitted_for_review = True
    else:
        package = db.get(type(package), package.package_id)

    rag_job_count = int(
        db.scalar(
            select(func.count()).select_from(ProjectRAGIndexJob).where(ProjectRAGIndexJob.package_id == package.package_id)
        )
        or 0
    )

    return EventGraphProjectPackageReviewResponse(
        draft_id=draft.draft_id,
        package_id=package.package_id,
        project_id=package.project_id,
        package_status=package.status,
        lifecycle_stage=package.lifecycle_stage,
        validation_summary=validation_summary,
        validation_results=_validation_result_payload(validation_rows),
        submitted_for_review=submitted_for_review,
        review_gate={
            "ready": True,
            "required_status": READY_STATUS,
            "review_id": ready_review.review_id,
            "reviewer_id": ready_review.reviewer_id,
        },
        rag_job_count=rag_job_count,
    )
