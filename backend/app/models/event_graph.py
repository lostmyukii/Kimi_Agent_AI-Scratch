from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base


class GeneratedProjectDraft(Base):
    """可审核的事理图谱项目草案记录。

    不复用 graph_edges.edge_metadata，因为草案有独立生命周期、导出文件血缘、
    审核摘要和回滚线索，不是图谱边上的轻量关系说明。
    """

    __tablename__ = "generated_project_drafts"

    draft_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    idea_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    package_id: Mapped[str] = mapped_column(String(96), nullable=False, index=True)
    project_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    age_band: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    slot_type: Mapped[str] = mapped_column(String(48), nullable=False, index=True)
    generation_mode: Mapped[str] = mapped_column(String(48), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), default="draft", index=True)
    lifecycle_stage: Mapped[str] = mapped_column(String(32), default="draft", index=True)
    package_dir: Mapped[str] = mapped_column(Text, nullable=False)
    manifest_path: Mapped[str] = mapped_column(Text, nullable=False)
    export_manifest_path: Mapped[str] = mapped_column(Text, nullable=False)
    request_json: Mapped[dict] = mapped_column(JSON, default=dict)
    positioning_json: Mapped[dict] = mapped_column(JSON, default=dict)
    draft_payload_json: Mapped[dict] = mapped_column(JSON, default=dict)
    validation_summary_json: Mapped[dict] = mapped_column(JSON, default=dict)
    export_paths_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_by: Mapped[str] = mapped_column(String(80), default="event_graph_planner", index=True)
    reviewed_by: Mapped[Optional[str]] = mapped_column(String(80), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
