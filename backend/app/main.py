from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes_admin import router as admin_router
from backend.app.api.routes_admin_console import router as admin_console_router
from backend.app.api.routes_assessment import router as assessment_router
from backend.app.api.routes_auth import router as auth_router
from backend.app.api.routes_competitions import alias_router as competition_points_alias_router
from backend.app.api.routes_competitions import router as competitions_router
from backend.app.api.routes_competition_materials import router as competition_materials_router
from backend.app.api.routes_coverage import router as coverage_router
from backend.app.api.routes_evidence import router as evidence_router
from backend.app.api.routes_evaluation import router as evaluation_router
from backend.app.api.routes_event_graph import router as event_graph_router
from backend.app.api.routes_graph import router as graph_router
from backend.app.api.routes_health import router as health_router
from backend.app.api.routes_integrations import admin_router as integrations_admin_router
from backend.app.api.routes_integrations import router as integrations_router
from backend.app.api.routes_knowledge import router as knowledge_router
from backend.app.api.routes_mobile import router as mobile_router
from backend.app.api.routes_portfolio import router as portfolio_router
from backend.app.api.routes_project_plugins import router as project_plugins_router
from backend.app.api.routes_projects import router as projects_router
from backend.app.api.routes_rag import router as rag_router
from backend.app.api.routes_sources import router as sources_router
from backend.app.api.routes_student import router as student_router
from backend.app.api.routes_teacher import router as teacher_router
from backend.app.api.routes_teacher import runtime_ws_router as teacher_runtime_ws_router
from backend.app.api.routes_workbuddy import admin_router as workbuddy_admin_router
from backend.app.api.routes_workbuddy import router as workbuddy_router
from backend.app.api.routes_workbuddy_automation import admin_router as workbuddy_automation_admin_router
from backend.app.api.routes_workbuddy_automation import router as workbuddy_automation_router
from backend.app.api.routes_xiaomai import admin_router as xiaomai_admin_router
from backend.app.api.routes_xiaomai import teacher_router as xiaomai_teacher_router
from backend.app.api.routes_xiaomai_mcp import router as xiaomai_mcp_router
from backend.app.api.routes_zongping import router as zongping_router
from backend.app.core.config import get_settings
from backend.app.core.database import create_db_and_tables
from backend.app.services.export_cleanup_scheduler import start_export_cleanup_scheduler, stop_export_cleanup_scheduler


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    create_db_and_tables()
    export_cleanup_task = start_export_cleanup_scheduler()
    try:
        yield
    finally:
        await stop_export_cleanup_scheduler(export_cleanup_task)


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(knowledge_router, prefix=settings.api_prefix)
app.include_router(competitions_router, prefix=settings.api_prefix)
app.include_router(competition_points_alias_router, prefix=settings.api_prefix)
app.include_router(competition_materials_router, prefix=settings.api_prefix)
app.include_router(projects_router, prefix=settings.api_prefix)
app.include_router(assessment_router, prefix=settings.api_prefix)
app.include_router(rag_router, prefix=settings.api_prefix)
app.include_router(sources_router, prefix=settings.api_prefix)
app.include_router(student_router, prefix=settings.api_prefix)
app.include_router(teacher_router, prefix=settings.api_prefix)
app.include_router(teacher_runtime_ws_router, prefix=settings.api_prefix)
app.include_router(mobile_router, prefix=settings.api_prefix)
app.include_router(evidence_router, prefix=settings.api_prefix)
app.include_router(evaluation_router, prefix=settings.api_prefix)
app.include_router(event_graph_router, prefix=settings.api_prefix)
app.include_router(admin_console_router, prefix=settings.api_prefix)
app.include_router(admin_router, prefix=settings.api_prefix)
app.include_router(integrations_admin_router, prefix=settings.api_prefix)
app.include_router(integrations_router, prefix=settings.api_prefix)
app.include_router(workbuddy_router, prefix=settings.api_prefix)
app.include_router(workbuddy_admin_router, prefix=settings.api_prefix)
app.include_router(workbuddy_automation_router, prefix=settings.api_prefix)
app.include_router(workbuddy_automation_admin_router, prefix=settings.api_prefix)
app.include_router(xiaomai_mcp_router, prefix=settings.api_prefix)
app.include_router(xiaomai_teacher_router, prefix=settings.api_prefix)
app.include_router(xiaomai_admin_router, prefix=settings.api_prefix)
app.include_router(graph_router, prefix=settings.api_prefix)
app.include_router(coverage_router, prefix=settings.api_prefix)
app.include_router(zongping_router, prefix=settings.api_prefix)
app.include_router(portfolio_router, prefix=settings.api_prefix)
app.include_router(project_plugins_router, prefix=settings.api_prefix)


@app.get("/")
def root() -> dict:
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": f"{settings.api_prefix}/health",
    }
