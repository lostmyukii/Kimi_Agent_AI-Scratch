from __future__ import annotations

from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.event_graph import GeneratedProjectDraft
from backend.app.schemas.event_graph import EventGraphProjectDraftRequest
from backend.app.services.event_graph_draft_export_service import write_project_draft_package
from backend.app.services.event_graph_planner_service import generate_project_draft


def _draft_id_for(package_id: str) -> str:
    return f"draft-{package_id}"


def create_generated_project_draft(
    db: Session,
    idea_id: str,
    request: EventGraphProjectDraftRequest,
    output_root: Path | None = None,
    created_by: str = "event_graph_planner",
    overwrite_export: bool = True,
) -> GeneratedProjectDraft:
    draft = generate_project_draft(idea_id, request)
    export = write_project_draft_package(draft, output_root=output_root, overwrite=overwrite_export)
    manifest = draft.project_manifest
    positioning = draft.positioning.model_dump()
    draft_payload = draft.model_dump()
    export_paths = {
        "package_dir": export.package_dir,
        "manifest_path": export.manifest_path,
        "export_manifest_path": export.export_manifest_path,
        "files": export.files,
    }

    draft_id = _draft_id_for(export.package_id)
    record = db.get(GeneratedProjectDraft, draft_id)
    values = {
        "idea_id": idea_id,
        "package_id": export.package_id,
        "project_id": export.project_id,
        "title": str(manifest["name"]),
        "age_band": str(manifest["age_band"]),
        "slot_type": str(manifest["insert_slot_type"]),
        "generation_mode": str(manifest["generation_mode"]),
        "status": "draft",
        "lifecycle_stage": "draft",
        "package_dir": export.package_dir,
        "manifest_path": export.manifest_path,
        "export_manifest_path": export.export_manifest_path,
        "request_json": request.model_dump(),
        "positioning_json": positioning,
        "draft_payload_json": draft_payload,
        "validation_summary_json": draft.validation_preview,
        "export_paths_json": export_paths,
        "created_by": created_by,
        "reviewed_by": None,
    }

    if record is None:
        record = GeneratedProjectDraft(draft_id=draft_id, **values)
        db.add(record)
    else:
        for field, value in values.items():
            setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


def get_generated_project_draft(db: Session, draft_id: str) -> GeneratedProjectDraft:
    record = db.get(GeneratedProjectDraft, draft_id)
    if record is None:
        raise ValueError(f"生成项目草案不存在：{draft_id}")
    return record


def list_generated_project_drafts(
    db: Session,
    *,
    status: str | None = None,
    idea_id: str | None = None,
    limit: int = 100,
) -> list[GeneratedProjectDraft]:
    stmt = select(GeneratedProjectDraft).order_by(GeneratedProjectDraft.created_at.desc())
    if status:
        stmt = stmt.where(GeneratedProjectDraft.status == status)
    if idea_id:
        stmt = stmt.where(GeneratedProjectDraft.idea_id == idea_id)
    return list(db.scalars(stmt.limit(limit)).all())
