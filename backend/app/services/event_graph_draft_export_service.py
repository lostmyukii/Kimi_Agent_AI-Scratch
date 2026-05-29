from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from backend.app.core.config import get_settings
from backend.app.schemas.event_graph import (
    EventGraphProjectDraftExportResponse,
    EventGraphProjectDraftRequest,
)
from backend.app.services.event_graph_planner_service import generate_project_draft
from backend.app.services.project_plugin_service import REQUIRED_PACKAGE_FILES


def event_graph_draft_export_root() -> Path:
    root = get_settings().project_root / "outputs" / "event_graph_drafts"
    root.mkdir(parents=True, exist_ok=True)
    return root


def _write_payload(path: Path, payload: Any) -> None:
    if path.suffix == ".json":
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        return
    path.write_text(str(payload), encoding="utf-8")


def export_project_draft_package(
    idea_id: str,
    request: EventGraphProjectDraftRequest,
    output_root: Path | None = None,
    overwrite: bool = True,
) -> EventGraphProjectDraftExportResponse:
    draft = generate_project_draft(idea_id, request)
    package_id = str(draft.project_manifest["package_id"])
    project_id = str(draft.project_manifest["project_id"])
    root = output_root or event_graph_draft_export_root()
    package_dir = root / package_id
    if package_dir.exists() and not overwrite:
        raise FileExistsError(f"Draft package already exists: {package_dir}")
    package_dir.mkdir(parents=True, exist_ok=True)

    for filename in REQUIRED_PACKAGE_FILES:
        _write_payload(package_dir / filename, draft.package_files[filename])

    export_manifest = {
        "idea_id": idea_id,
        "package_id": package_id,
        "project_id": project_id,
        "status": draft.status,
        "files": draft.files,
        "status_flow": ["draft", "in_review", "approved", "active"],
        "positioning": draft.positioning.model_dump(),
        "validation_preview": draft.validation_preview,
    }
    export_manifest_path = package_dir / "event_graph_export.json"
    _write_payload(export_manifest_path, export_manifest)

    return EventGraphProjectDraftExportResponse(
        idea_id=idea_id,
        package_id=package_id,
        project_id=project_id,
        status="draft",
        package_dir=str(package_dir),
        manifest_path=str(package_dir / "project.json"),
        export_manifest_path=str(export_manifest_path),
        files=list(REQUIRED_PACKAGE_FILES.keys()),
        validation_preview=draft.validation_preview,
    )
