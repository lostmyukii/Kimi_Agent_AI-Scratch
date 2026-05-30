import type {
  AuthPermissionResponse,
  AuthLogoutResponse,
  AuthSessionResponse,
  AdminClassDetailResponse,
  AdminClassListResponse,
  AdminAcceptanceDetailResponse,
  AdminAcceptanceResponse,
  AdminCompetitionZongpingResponse,
  AdminCampusListResponse,
  AdminDashboardResponse,
  AdminDataQualityResponse,
  AdminDataQualityResolvePayload,
  AdminDataQualityRunResponse,
  AdminDeliverablesResponse,
  AdminKnowledgeCoverageResponse,
  AdminNotificationBulkClosePayload,
  AdminNotificationBulkCloseResponse,
  AdminNotificationDispatchApprovalPayload,
  AdminNotificationDispatchAuditResponse,
  AdminNotificationDispatchDryRunPayload,
  AdminNotificationDispatchDryRunResponse,
  AdminNotificationDispatchPolicyPayload,
  AdminNotificationDispatchPolicyResponse,
  AdminNotificationProviderProbePayload,
  AdminNotificationProviderProbeResponse,
  AdminNotificationProviderReleaseAuditResponse,
  AdminNotificationProviderReleaseBatchActionPayload,
  AdminNotificationProviderReleaseBatchPayload,
  AdminNotificationProviderReleaseBatchResponse,
  AdminNotificationProviderReleaseExportCleanupActionPayload,
  AdminNotificationProviderReleaseExportCleanupActionResponse,
  AdminNotificationProviderWebhookAlertStatusPayload,
  AdminNotificationProviderWebhookAlertStatusResponse,
  AdminNotificationDispatchSendPayload,
  AdminNotificationsListResponse,
  AdminNotificationOutboxListResponse,
  AdminNotificationOutboxReplayApprovalPayload,
  AdminNotificationOutboxReplayApprovalResponse,
  AdminNotificationOutboxReplayExecutePayload,
  AdminNotificationOutboxReplayExecuteResponse,
  AdminNotificationOutboxReplayRevokePayload,
  AdminNotificationOutboxReplayRevokeResponse,
  AdminNotificationStatsResponse,
  AdminNotificationStatusPayload,
  AdminNotificationStatusResponse,
  AdminProviderReleaseAuditViewsImportRequest,
  AdminProviderReleaseAuditViewsImportPreviewResponse,
  AdminProviderReleaseAuditViewsImportResponse,
  AdminProviderReleaseAuditViewsMigrationPackage,
  AdminRagHealthEvaluateResponse,
  AdminRagHealthReindexResponse,
  AdminOperationalRiskBulkAssignPayload,
  AdminOperationalRiskBulkResponse,
  AdminOperationalRiskBulkStatusPayload,
  AdminRagHealthResponse,
  AdminReportsResponse,
  AdminSettingAuditTrailResponse,
  AdminSettingsRollbackDecisionRequest,
  AdminSettingsRollbackDecisionResponse,
  AdminSettingsRollbackReminderGenerateResponse,
  AdminSettingsRollbackRequestResponse,
  AdminSettingsRollbackRequestsResponse,
  AdminSettingsResponse,
  AdminSettingsRollbackRequest,
  AdminExportJob,
  AdminProjectProgressDetailResponse,
  AdminProjectProgressResponse,
  AdminStudentProjectDetailResponse,
  AdminStudentProjectListResponse,
  AdminTeacherDetailResponse,
  AdminTeacherListResponse,
  AnswerAuditConfirmPayload,
  AnswerAuditBatchDryRunPayload,
  AnswerAuditBatchDryRunResponse,
  AnswerAuditExportAuditTrailResponse,
  AnswerAuditExportPayload,
  AnswerAuditListResponse,
  AnswerAuditMutationResponse,
  AnswerAuditOptionsResponse,
  AnswerAuditReviewCreatePayload,
  AnswerAuditReviewDecisionPayload,
  AnswerAuditReviewListResponse,
  AnswerAuditReviewRequest,
  AnswerAuditRevokePayload,
  AnswerAuditSlaReminderResponse,
  ClassroomBulkFailedItemsRetryPayload,
  ClassroomBulkFailedItemsRetryResponse,
  ClassroomCaptureAuditResponse,
  ClassroomFailedItemsResponse,
  ClassroomFailedItemsRetryPayload,
  ClassroomFailedItemsRetryResponse,
  ClassroomReliabilityDashboardResponse,
  CompetitionPoint,
  CompetitionMaterialsGenerateRequest,
  CompetitionMaterialsGenerateResponse,
  ClassroomCompletePayload,
  ClassroomCaptureBatch,
  ClassroomObservationPayload,
  InteractiveRuntimeAnswerAttempt,
  InteractiveRuntimeSession,
  InteractiveRuntimeTraceSyncPayload,
  ClassroomSessionUpdatePayload,
  ClassroomStartPayload,
  CompetencyNode,
  CoverageScopeResponse,
  EvaluationRunRequest,
  EvaluationRunResponse,
  EventGraphGeneratedProjectDraft,
  EventGraphProjectPackageReviewPayload,
  EventGraphProjectPackageReviewResponse,
  EventGraphReviewRecord,
  GraphEdge,
  GraphNeighborsResponse,
  GroupCapabilityMapResponse,
  HighFrequencyKnowledgePoint,
  HealthResponse,
  KnowledgeApplicationCase,
  KnowledgeEvidence,
  KnowledgeProjectCoverageResponse,
  KnowledgePointParentView,
  KnowledgePointSummary,
  KnowledgePointTeacherView,
  KnowledgeQuestionPattern,
  KnowledgePoint,
  LessonGenerateRequest,
  LessonGenerateResponse,
  LessonBuilderRequest,
  LessonBuilderResponse,
  MarkdownFlowDraftImportRequest,
  MarkdownFlowDraftImportResponse,
  MarkdownFlowDraftRead,
  MarkdownFlowDraftSaveRequest,
  MarkdownFlowDraftVersionRead,
  MarkdownFlowReviewBulkStatusPayload,
  MarkdownFlowReviewBulkStatusResponse,
  MarkdownFlowReviewBulkAssignPayload,
  MarkdownFlowReviewBulkAssignResponse,
  MarkdownFlowReviewExportPayload,
  MarkdownFlowReviewOptionsResponse,
  MarkdownFlowRuntimeInputRead,
  MarkdownFlowValidateRequest,
  MarkdownFlowValidateResponse,
  ParentFeedbackRequest,
  ParentFeedbackResponse,
  ParentMessageRequest,
  ParentMessageResponse,
  PortfolioGenerateRequest,
  ProgressionAlertActionPayload,
  ProgressionAlertExplanation,
  ProgressionPlanStatusPayload,
  Project,
  ProjectFacetResponse,
  ProjectListResponse,
  ProjectPackage,
  ProjectPackageDetail,
  ProjectRAGIndexJob,
  ProjectValidationResult,
  ProjectUpgradeAdviceRequest,
  ProjectUpgradeAdviceResponse,
  ProjectSet,
  RAGAuditDashboardResponse,
  RagAnswerMode,
  RagResponse,
  RecommendationResult,
  ClassProgressionAlertResponse,
  ClassProgressionStatusResponse,
  StudentAssessment,
  StudentGapDiagnosisRequest,
  StudentGapDiagnosisResponse,
  StudentKnowledgeProgress,
  StudentLearningEvent,
  StudentLearningEventCreateRequest,
  StudentPortfolioResponse,
  StudentProgressionAlert,
  StudentProgressionAlertHistory,
  StudentProgressionAnalysisResponse,
  StudentProgressionPlan,
  StudentProgressionPlanHistory,
  StudentProgressionPlanResponse,
  StudentProgressionPlanSaveRequest,
  TeacherClassDetailResponse,
  TeacherClassroomCompleteResponse,
  TeacherClassroomMaterialUploadResponse,
  TeacherClassroomObservationResponse,
  TeacherClassroomResponse,
  TeacherClassInfo,
  TeacherContextResponse,
  TeacherDataExportResponse,
  TeacherEvidenceMaterialImportRequest,
  TeacherGroupMemberUpdateRequest,
  TeacherGroupMemberUpsertRequest,
  TeacherImportResultResponse,
  TeacherProjectGroupCreateRequest,
  TeacherProjectGroupUpdateRequest,
  TeacherProjectRecordImportRequest,
  TeacherProjectGroup,
  TeacherScheduleLesson,
  TeacherScheduleLessonCreateRequest,
  TeacherScheduleLessonUpdateRequest,
  TeacherScheduleResponse,
  TeacherStudentRosterItem,
  TeacherTask,
  TeacherTaskCenterResponse,
  TeacherTaskConfirmationPayload,
  TeacherTaskConfirmationResponse,
  TeacherTaskStatusHistory,
  TeacherTaskStatusPayload,
  TeacherTerm,
  TeacherTermSwitchRequest,
  TeacherOpsAuditResponse,
  TeacherWorkspaceRequest,
  TeacherWorkspaceResponse,
  WorkBuddyAdoptionWorkbenchResponse,
  WorkBuddyArtifact,
  WorkBuddyArtifactListResponse,
  WorkBuddyArtifactStatusUpdatePayload,
  WorkBuddyQuestionAnalysisReviewPayload,
  WorkBuddyQuestionAnalysisReviewResponse,
  WorkBuddyTeacherDailyDispatchPayload,
  WorkBuddyTeacherDailyDispatchPreviewResponse,
  WorkBuddyTeacherDailyDispatchResponse,
  XiaomaiAcceptanceResponse,
  XiaomaiAccountTestRequest,
  XiaomaiAccountTestResponse,
  XiaomaiAccountRead,
  XiaomaiConnectorHealthResponse,
  XiaomaiEmbedConfigResponse,
  XiaomaiIntegrationStatusResponse,
  XiaomaiPaperRead,
  XiaomaiQuestionBankItemRead,
  XiaomaiResourceDownloadResponse,
  XiaomaiSyncJobRead,
  XiaomaiSyncJobRequest,
  XiaomaiSyncJobResponse,
  XiaomaiSyncReportResponse,
  ZongpingCategory,
  ZongpingEvidenceMaterial,
  ZongpingExportResponse,
  ZongpingGenerateEntryRequest,
  ZongpingGenerateEntryResponse,
  ZongpingGeneratedEntry,
  ZongpingMaterialAudit,
  ZongpingMappedEntryOption,
  ZongpingResumeResponse,
  ZongpingStudentProfile,
  ZongpingStudentRecords,
  ZongpingTeacherDashboard,
  ZongpingTemplate,
} from "@/types/api";

type AdminProviderReleaseAuditViewsImportPreviewExportRequest = AdminProviderReleaseAuditViewsImportRequest & {
  format: string;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const AUTH_TOKEN_STORAGE_KEY = "vsle_auth_token";
const DEFAULT_AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || "dev-teacher-token";

function getAuthToken() {
  if (typeof window === "undefined") return DEFAULT_AUTH_TOKEN;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || DEFAULT_AUTH_TOKEN;
}

function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function buildWebSocketUrl(path: string, params: QueryParams = {}) {
  const baseUrl = new URL(API_BASE_URL);
  baseUrl.protocol = baseUrl.protocol === "https:" ? "wss:" : "ws:";
  baseUrl.pathname = path;
  baseUrl.search = "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const token = getAuthToken();
  if (token) query.set("token", token);
  baseUrl.search = query.toString();
  return baseUrl.toString();
}

function buildHeaders(headersInit: HeadersInit | undefined, includeJson = true) {
  const headers = new Headers(headersInit);
  if (includeJson && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init?.headers),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `API ${response.status}`);
  }

  return (await response.json()) as T;
}

async function requestForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers: buildHeaders(undefined, false),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `API ${response.status}`);
  }

  return (await response.json()) as T;
}

async function requestBlob(path: string, init?: RequestInit): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init?.headers, false),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `API ${response.status}`);
  }

  const disposition = response.headers.get("Content-Disposition") || "";
  const encodedMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return {
    blob: await response.blob(),
    filename: encodedMatch ? decodeURIComponent(encodedMatch[1]) : match?.[1] || "lesson_plan_export",
  };
}

type QueryParams = Record<string, string | number | boolean | undefined>;

function withParams(path: string, params: QueryParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

export const api = {
  baseUrl: API_BASE_URL,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  teacherInteractiveRuntimeWsUrl: (lessonId: string) =>
    buildWebSocketUrl(`/api/teacher/interactive-runtime/${encodeURIComponent(lessonId)}/ws`),
  authMe: () => request<AuthPermissionResponse>("/api/auth/me"),
  authLogin: (payload: { username: string; password: string }) =>
    request<AuthSessionResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  authRefresh: (payload: { refresh_token: string }) =>
    request<AuthSessionResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  authLogout: (payload: { refresh_token?: string | null } = {}) =>
    request<AuthLogoutResponse>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  health: () => request<HealthResponse>("/api/health"),
  knowledgePoints: (params: Record<string, string | number | undefined> = {}) =>
    request<KnowledgePoint[]>(withParams("/api/knowledge-points", params)),
  knowledgePoint: (id: string) => request<KnowledgePoint>(`/api/knowledge-points/${id}`),
  knowledgePointParentView: (id: string) => request<KnowledgePointParentView>(`/api/knowledge-points/${id}/parent-view`),
  knowledgePointTeacherView: (id: string) => request<KnowledgePointTeacherView>(`/api/knowledge-points/${id}/teacher-view`),
  knowledgePointEvidence: (id: string) => request<KnowledgeEvidence[]>(`/api/knowledge-points/${id}/evidence`),
  knowledgePointQuestionPatterns: (id: string) => request<KnowledgeQuestionPattern[]>(`/api/knowledge-points/${id}/question-patterns`),
  knowledgePointApplicationCases: (id: string) => request<KnowledgeApplicationCase[]>(`/api/knowledge-points/${id}/application-cases`),
  highFrequencyKnowledgePoints: (params: Record<string, string | number | undefined> = {}) =>
    request<HighFrequencyKnowledgePoint[]>(withParams("/api/knowledge-points/high-frequency", params)),
  evidence: (params: Record<string, string | number | undefined> = {}) =>
    request<KnowledgeEvidence[]>(withParams("/api/evidence", params)),
  graphNeighbors: (nodeId: string, params: Record<string, string | number | undefined> = {}) =>
    request<GraphNeighborsResponse>(withParams(`/api/graph/neighbors/${nodeId}`, params)),
  graphEdges: (params: Record<string, string | number | undefined> = {}) =>
    request<GraphEdge[]>(withParams("/api/graph/edges", params)),
  competencyNodes: (params: Record<string, string | number | undefined> = {}) =>
    request<CompetencyNode[]>(withParams("/api/graph/competencies", params)),
  knowledgeProjectCoverage: () => request<KnowledgeProjectCoverageResponse>("/api/coverage/knowledge-project"),
  classCoverage: (classId: string) =>
    request<CoverageScopeResponse>(`/api/coverage/class/${encodeURIComponent(classId)}`),
  campusCoverage: (campusId: string) =>
    request<CoverageScopeResponse>(`/api/coverage/campus/${encodeURIComponent(campusId)}`),
  competitions: (params: Record<string, string | number | undefined> = {}) =>
    request<CompetitionPoint[]>(withParams("/api/competitions", params)),
  projectSets: (params: Record<string, string | number | undefined> = {}) =>
    request<ProjectSet[]>(withParams("/api/project-sets", params)),
  projectSet: (id: string) => request<ProjectSet>(`/api/project-sets/${id}`),
  projects: (params: QueryParams = {}) =>
    request<ProjectListResponse>(withParams("/api/projects", params)),
  projectFacets: (params: QueryParams = {}) =>
    request<ProjectFacetResponse>(withParams("/api/projects/facets", params)),
  availableProjects: (params: Record<string, string | number | undefined> = {}) =>
    request<Project[]>(withParams("/api/projects/available", params)),
  project: (id: string) => request<Project>(`/api/projects/${id}`),
  updateLessonPlanStatus: (projectId: string, payload: {
    alignment_quality_status: string;
    lifecycle_stage: string;
    plugin_status?: string;
    recommendable?: boolean;
    rag_indexable?: boolean;
    note?: string;
    actor?: string;
  }) =>
    request<Project>(`/api/teacher/lesson-plans/${encodeURIComponent(projectId)}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  exportLessonPlan: (projectId: string, format: "docx" | "pdf") =>
    requestBlob(withParams(`/api/teacher/lesson-plans/${encodeURIComponent(projectId)}/export`, { format })),
  projectPlugins: (params: Record<string, string | number | undefined> = {}) =>
    request<ProjectPackage[]>(withParams("/api/admin/project-packages", params)),
  projectPlugin: (packageId: string) =>
    request<ProjectPackageDetail>(`/api/admin/project-packages/${packageId}`),
  eventGraphGeneratedProjectDrafts: (params: Record<string, string | number | undefined> = {}) =>
    request<EventGraphGeneratedProjectDraft[]>(withParams("/api/event-graph/generated-project-drafts", params)),
  eventGraphGeneratedProjectDraft: (draftId: string) =>
    request<EventGraphGeneratedProjectDraft>(`/api/event-graph/generated-project-drafts/${encodeURIComponent(draftId)}`),
  eventGraphReviewRecords: (draftId: string, params: Record<string, string | number | undefined> = {}) =>
    request<EventGraphReviewRecord[]>(withParams(`/api/event-graph/generated-project-drafts/${encodeURIComponent(draftId)}/review-records`, params)),
  prepareEventGraphProjectPackageReview: (draftId: string, payload: EventGraphProjectPackageReviewPayload = {}) =>
    request<EventGraphProjectPackageReviewResponse>(`/api/event-graph/generated-project-drafts/${encodeURIComponent(draftId)}/project-package-review`, {
      method: "POST",
      body: JSON.stringify({ submit_for_review: true, ...payload }),
    }),
  uploadProjectPlugin: (formData: FormData) =>
    requestForm<ProjectPackageDetail>("/api/admin/project-packages/upload", formData),
  validateProjectPlugin: (packageId: string) =>
    request<ProjectValidationResult[]>(`/api/admin/project-packages/${packageId}/validate`, { method: "POST" }),
  submitProjectPluginReview: (packageId: string) =>
    request<ProjectPackageDetail>(`/api/admin/project-packages/${packageId}/submit-review`, { method: "POST", body: JSON.stringify({ actor: "admin" }) }),
  approveProjectPlugin: (packageId: string) =>
    request<ProjectPackageDetail>(`/api/admin/project-packages/${packageId}/approve`, { method: "POST", body: JSON.stringify({ actor: "admin" }) }),
  activateProjectPlugin: (packageId: string) =>
    request<ProjectPackageDetail>(`/api/admin/project-packages/${packageId}/activate`, { method: "POST", body: JSON.stringify({ actor: "admin" }) }),
  deprecateProjectPlugin: (packageId: string) =>
    request<ProjectPackageDetail>(`/api/admin/project-packages/${packageId}/deprecate`, { method: "POST", body: JSON.stringify({ actor: "admin" }) }),
  archiveProjectPlugin: (packageId: string) =>
    request<ProjectPackageDetail>(`/api/admin/project-packages/${packageId}/archive`, { method: "POST", body: JSON.stringify({ actor: "admin" }) }),
  ragIndexProjectPlugin: (packageId: string) =>
    request<ProjectRAGIndexJob>(`/api/admin/project-packages/${packageId}/rag-index`, { method: "POST", body: JSON.stringify({ actor: "admin" }) }),
  projectKnowledgePoints: (id: string) => request<KnowledgePointSummary[]>(`/api/projects/${id}/knowledge-points`),
  projectUpgradeAdvice: (payload: ProjectUpgradeAdviceRequest) =>
    request<ProjectUpgradeAdviceResponse>("/api/projects/upgrade-advice", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  competitionMaterialsGenerate: (payload: CompetitionMaterialsGenerateRequest) =>
    request<CompetitionMaterialsGenerateResponse>("/api/competition/materials-generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  assessmentRecommend: (payload: StudentAssessment) =>
    request<RecommendationResult>("/api/assessment/recommend", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  assessmentNextKnowledgePoints: (id: number) =>
    request<KnowledgePointSummary[]>(`/api/assessment/${id}/next-knowledge-points`),
  ragQuery: (question: string, options: { age_band?: string; top_k?: number; answer_mode?: RagAnswerMode; use_llm?: boolean; show_debug?: boolean } = {}) =>
    request<RagResponse>("/api/rag/query", {
      method: "POST",
      body: JSON.stringify({ question, ...options }),
    }),
  teacherWorkspace: (payload: TeacherWorkspaceRequest) =>
    request<TeacherWorkspaceResponse>("/api/teacher/workspace", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherLessonGenerate: (payload: LessonGenerateRequest) =>
    request<LessonGenerateResponse>("/api/teacher/lesson-generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherLessonBuilder: (payload: LessonBuilderRequest) =>
    request<LessonBuilderResponse>("/api/teacher/lesson-builder", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherMarkdownFlowValidate: (payload: MarkdownFlowValidateRequest) =>
    request<MarkdownFlowValidateResponse>("/api/teacher/markdownflow/validate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherMarkdownFlowSaveDraft: (payload: MarkdownFlowDraftSaveRequest) =>
    request<MarkdownFlowDraftRead>("/api/teacher/markdownflow/drafts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherMarkdownFlowDraft: (draftId: string) =>
    request<MarkdownFlowDraftRead>(`/api/teacher/markdownflow/drafts/${encodeURIComponent(draftId)}`),
  teacherMarkdownFlowDraftVersions: (draftId: string) =>
    request<MarkdownFlowDraftVersionRead[]>(`/api/teacher/markdownflow/drafts/${encodeURIComponent(draftId)}/versions`),
  teacherMarkdownFlowImportToLesson: (draftId: string, payload: MarkdownFlowDraftImportRequest) =>
    request<MarkdownFlowDraftImportResponse>(`/api/teacher/markdownflow/drafts/${encodeURIComponent(draftId)}/import-to-lesson`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherParentFeedback: (payload: ParentFeedbackRequest) =>
    request<ParentFeedbackResponse>("/api/teacher/parent-feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherParentMessage: (payload: ParentMessageRequest) =>
    request<ParentMessageResponse>("/api/teacher/parent-message", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherContext: () =>
    request<TeacherContextResponse>("/api/teacher/context"),
  teacherClasses: () =>
    request<TeacherClassInfo[]>("/api/teacher/classes"),
  teacherClassDetail: (classId: string) =>
    request<TeacherClassDetailResponse>(`/api/teacher/classes/${encodeURIComponent(classId)}`),
  teacherClassTerms: (classId: string) =>
    request<TeacherTerm[]>(`/api/teacher/classes/${encodeURIComponent(classId)}/terms`),
  teacherSwitchClassTerm: (classId: string, payload: TeacherTermSwitchRequest) =>
    request<TeacherClassDetailResponse>(`/api/teacher/classes/${encodeURIComponent(classId)}/term`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  teacherClassSchedule: (classId: string) =>
    request<TeacherScheduleResponse>(`/api/teacher/classes/${encodeURIComponent(classId)}/schedule`),
  teacherCreateScheduleLesson: (classId: string, payload: TeacherScheduleLessonCreateRequest) =>
    request<TeacherScheduleLesson>(`/api/teacher/classes/${encodeURIComponent(classId)}/schedule-lessons`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherUpdateScheduleLesson: (lessonId: string, payload: TeacherScheduleLessonUpdateRequest) =>
    request<TeacherScheduleLesson>(`/api/teacher/schedule-lessons/${encodeURIComponent(lessonId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  teacherClassroom: (lessonId: string) =>
    request<TeacherClassroomResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}`),
  teacherStartClassroom: (lessonId: string, payload: ClassroomStartPayload = {}) =>
    request<TeacherClassroomResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}/start`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherUpdateClassroom: (lessonId: string, payload: ClassroomSessionUpdatePayload) =>
    request<TeacherClassroomResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  teacherSyncInteractiveRuntime: (lessonId: string, payload: InteractiveRuntimeTraceSyncPayload) =>
    request<InteractiveRuntimeSession>(`/api/teacher/interactive-runtime/${encodeURIComponent(lessonId)}/sync`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  teacherLatestInteractiveRuntime: (lessonId: string) =>
    request<InteractiveRuntimeSession>(`/api/teacher/interactive-runtime/${encodeURIComponent(lessonId)}/latest`),
  teacherInteractiveRuntimeAnswerAttempts: (lessonId: string, sessionId?: string) => {
    const query = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
    return request<InteractiveRuntimeAnswerAttempt[]>(`/api/teacher/interactive-runtime/${encodeURIComponent(lessonId)}/answer-attempts${query}`);
  },
  teacherAnswerAuditAttempts: (params: QueryParams = {}) =>
    request<AnswerAuditListResponse>(withParams("/api/teacher/answer-audit/attempts", params)),
  teacherAnswerAuditOptions: () => request<AnswerAuditOptionsResponse>("/api/teacher/answer-audit/options"),
  teacherAnswerAuditBatchDryRun: (payload: AnswerAuditBatchDryRunPayload) =>
    request<AnswerAuditBatchDryRunResponse>("/api/teacher/answer-audit/batch-dry-run", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherAnswerAuditReviews: (params: QueryParams = {}) =>
    request<AnswerAuditReviewListResponse>(withParams("/api/teacher/answer-audit/reviews", params)),
  teacherAnswerAuditReview: (requestId: string) =>
    request<AnswerAuditReviewRequest>(`/api/teacher/answer-audit/reviews/${encodeURIComponent(requestId)}`),
  teacherAnswerAuditReviewCreate: (payload: AnswerAuditReviewCreatePayload) =>
    request<AnswerAuditMutationResponse>("/api/teacher/answer-audit/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherAnswerAuditExportTrail: () => request<AnswerAuditExportAuditTrailResponse>("/api/teacher/answer-audit/export-trail"),
  teacherAnswerAuditExport: (payload: AnswerAuditExportPayload) =>
    request<AdminExportJob>("/api/teacher/answer-audit/export", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherAnswerAuditExportJob: (jobId: string) =>
    request<AdminExportJob>(`/api/teacher/answer-audit/export-jobs/${encodeURIComponent(jobId)}`),
  teacherAnswerAuditExportJobDownloadUrl: (jobId: string) =>
    `/api/teacher/answer-audit/export-jobs/${encodeURIComponent(jobId)}/download`,
  teacherAnswerAuditExportJobDownload: (jobId: string) =>
    requestBlob(`/api/teacher/answer-audit/export-jobs/${encodeURIComponent(jobId)}/download`),
  teacherAnswerAuditConfirm: (payload: AnswerAuditConfirmPayload) =>
    request<AnswerAuditMutationResponse>("/api/teacher/answer-audit/attempts/confirm", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherAnswerAuditRevoke: (payload: AnswerAuditRevokePayload) =>
    request<AnswerAuditMutationResponse>("/api/teacher/answer-audit/attempts/revoke", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminAnswerAuditReviews: (params: QueryParams = {}) =>
    request<AnswerAuditReviewListResponse>(withParams("/api/admin/answer-audit/reviews", params)),
  adminAnswerAuditReview: (requestId: string) =>
    request<AnswerAuditReviewRequest>(`/api/admin/answer-audit/reviews/${encodeURIComponent(requestId)}`),
  adminAnswerAuditSlaRemindersGenerate: () =>
    request<AnswerAuditSlaReminderResponse>("/api/admin/answer-audit/reviews/sla-reminders/generate", {
      method: "POST",
    }),
  adminAnswerAuditReviewApprove: (requestId: string, payload: AnswerAuditReviewDecisionPayload) =>
    request<AnswerAuditMutationResponse>(`/api/admin/answer-audit/reviews/${encodeURIComponent(requestId)}/approve`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminAnswerAuditReviewReject: (requestId: string, payload: AnswerAuditReviewDecisionPayload) =>
    request<AnswerAuditMutationResponse>(`/api/admin/answer-audit/reviews/${encodeURIComponent(requestId)}/reject`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminAnswerAuditExportTrail: () => request<AnswerAuditExportAuditTrailResponse>("/api/admin/answer-audit/export-trail"),
  teacherInteractiveRuntimeInput: (lessonId: string) =>
    request<MarkdownFlowRuntimeInputRead>(`/api/teacher/interactive-runtime/${encodeURIComponent(lessonId)}/input`),
  teacherRecordClassroomObservations: (lessonId: string, payload: ClassroomObservationPayload) =>
    request<TeacherClassroomObservationResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}/observations`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherClassroomCaptureBatches: (lessonId: string) =>
    request<ClassroomCaptureBatch[]>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}/capture-batches`),
  teacherClassroomCaptureAudit: (params: QueryParams = {}) =>
    request<ClassroomCaptureAuditResponse>(withParams("/api/teacher/classroom/capture-audit", params)),
  teacherClassroomReliabilityDashboard: (params: QueryParams = {}) =>
    request<ClassroomReliabilityDashboardResponse>(withParams("/api/teacher/classroom/reliability-dashboard", params)),
  teacherClassroomFailedItems: (lessonId: string) =>
    request<ClassroomFailedItemsResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}/failed-items`),
  teacherRetryClassroomFailedItems: (lessonId: string, payload: ClassroomFailedItemsRetryPayload) =>
    request<ClassroomFailedItemsRetryResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}/failed-items/retry`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherRetryClassroomFailedItemsBulk: (payload: ClassroomBulkFailedItemsRetryPayload) =>
    request<ClassroomBulkFailedItemsRetryResponse>("/api/teacher/classroom/failed-items/retry-bulk", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherUploadClassroomMaterial: (lessonId: string, formData: FormData) =>
    requestForm<TeacherClassroomMaterialUploadResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}/materials/upload`, formData),
  teacherCompleteClassroom: (lessonId: string, payload: ClassroomCompletePayload = {}) =>
    request<TeacherClassroomCompleteResponse>(`/api/teacher/classroom/${encodeURIComponent(lessonId)}/complete`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherTasks: (params: QueryParams = {}) =>
    request<TeacherTaskCenterResponse>(withParams("/api/teacher/tasks", params)),
  teacherMarkdownFlowReviewOptions: () =>
    request<MarkdownFlowReviewOptionsResponse>("/api/teacher/tasks/markdownflow-review/options"),
  teacherMarkdownFlowReviewBulkStatus: (payload: MarkdownFlowReviewBulkStatusPayload) =>
    request<MarkdownFlowReviewBulkStatusResponse>("/api/teacher/tasks/markdownflow-review/bulk-status", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherMarkdownFlowReviewBulkAssign: (payload: MarkdownFlowReviewBulkAssignPayload) =>
    request<MarkdownFlowReviewBulkAssignResponse>("/api/teacher/tasks/markdownflow-review/bulk-assign", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherMarkdownFlowReviewExport: (payload: MarkdownFlowReviewExportPayload) =>
    request<AdminExportJob>("/api/teacher/tasks/markdownflow-review/export", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherTaskExportJob: (jobId: string) =>
    request<AdminExportJob>(`/api/teacher/tasks/export-jobs/${encodeURIComponent(jobId)}`),
  teacherTaskExportJobDownloadUrl: (jobId: string) =>
    `/api/teacher/tasks/export-jobs/${encodeURIComponent(jobId)}/download`,
  teacherTaskExportJobDownload: (jobId: string) =>
    requestBlob(`/api/teacher/tasks/export-jobs/${encodeURIComponent(jobId)}/download`),
  teacherUpdateTaskStatus: (taskId: string, payload: TeacherTaskStatusPayload) =>
    request<TeacherTask>(`/api/teacher/tasks/${encodeURIComponent(taskId)}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  teacherConfirmTask: (taskId: string, payload: TeacherTaskConfirmationPayload) =>
    request<TeacherTaskConfirmationResponse>(`/api/teacher/tasks/${encodeURIComponent(taskId)}/confirm`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherTaskHistory: (taskId: string) =>
    request<TeacherTaskStatusHistory[]>(`/api/teacher/tasks/${encodeURIComponent(taskId)}/history`),
  teacherGroups: () =>
    request<TeacherProjectGroup[]>("/api/teacher/groups"),
  teacherCreateProjectGroup: (classId: string, payload: TeacherProjectGroupCreateRequest) =>
    request<TeacherProjectGroup>(`/api/teacher/classes/${encodeURIComponent(classId)}/groups`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherUpdateProjectGroup: (groupId: string, payload: TeacherProjectGroupUpdateRequest) =>
    request<TeacherProjectGroup>(`/api/teacher/groups/${encodeURIComponent(groupId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  teacherUpsertGroupMember: (groupId: string, payload: TeacherGroupMemberUpsertRequest) =>
    request<TeacherProjectGroup>(`/api/teacher/groups/${encodeURIComponent(groupId)}/members`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherUpdateGroupMember: (groupId: string, membershipId: string, payload: TeacherGroupMemberUpdateRequest) =>
    request<TeacherProjectGroup>(`/api/teacher/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(membershipId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  teacherStudents: () =>
    request<TeacherStudentRosterItem[]>("/api/teacher/students"),
  teacherStudentKnowledgeProgress: (studentId: string) =>
    request<StudentKnowledgeProgress[]>(`/api/teacher/students/${encodeURIComponent(studentId)}/knowledge-progress`),
  teacherStudentProgressionAlerts: (studentId: string) =>
    request<StudentProgressionAlert[]>(`/api/teacher/students/${encodeURIComponent(studentId)}/progression-alerts`),
  teacherStudentLearningEvents: (studentId: string, knowledgePointId?: string) =>
    request<StudentLearningEvent[]>(
      withParams(`/api/teacher/students/${encodeURIComponent(studentId)}/learning-events`, { knowledge_point_id: knowledgePointId }),
    ),
  teacherRecordLearningEvent: (studentId: string, payload: StudentLearningEventCreateRequest) =>
    request<StudentLearningEvent>(`/api/teacher/students/${encodeURIComponent(studentId)}/learning-events`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherAnalyzeProgression: (studentId: string) =>
    request<StudentProgressionAnalysisResponse>(`/api/teacher/students/${encodeURIComponent(studentId)}/progression-analyze`, {
      method: "POST",
    }),
  teacherProgressionPlan: (studentId: string) =>
    request<StudentProgressionPlanResponse>(`/api/teacher/students/${encodeURIComponent(studentId)}/progression-plan`, {
      method: "POST",
    }),
  teacherSaveProgressionPlan: (studentId: string, payload: StudentProgressionPlanSaveRequest) =>
    request<StudentProgressionPlan>(`/api/teacher/students/${encodeURIComponent(studentId)}/progression-plans`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherStudentProgressionPlans: (studentId: string) =>
    request<StudentProgressionPlan[]>(`/api/teacher/students/${encodeURIComponent(studentId)}/progression-plans`),
  teacherClassProgressionAlerts: (classId: string) =>
    request<ClassProgressionAlertResponse>(`/api/teacher/classes/${encodeURIComponent(classId)}/progression-alerts`),
  teacherClassProgressionStatus: (classId: string) =>
    request<ClassProgressionStatusResponse>(`/api/teacher/classes/${encodeURIComponent(classId)}/progression-status`),
  teacherImportProjectRecords: (classId: string, payload: TeacherProjectRecordImportRequest) =>
    request<TeacherImportResultResponse>(`/api/teacher/classes/${encodeURIComponent(classId)}/imports/project-records`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherImportEvidenceMaterials: (classId: string, payload: TeacherEvidenceMaterialImportRequest) =>
    request<TeacherImportResultResponse>(`/api/teacher/classes/${encodeURIComponent(classId)}/imports/evidence-materials`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  teacherExportClassProgressionAlerts: (classId: string, format = "csv") =>
    request<TeacherDataExportResponse>(
      withParams(`/api/teacher/classes/${encodeURIComponent(classId)}/exports/progression-alerts`, { format }),
    ),
  teacherExportRepeatedKnowledgeAudit: (classId: string, format = "csv") =>
    request<TeacherDataExportResponse>(
      withParams(`/api/teacher/classes/${encodeURIComponent(classId)}/exports/repeated-knowledge-audit`, { format }),
    ),
  teacherExportStudentProgressionPlans: (studentId: string, format = "csv") =>
    request<TeacherDataExportResponse>(
      withParams(`/api/teacher/students/${encodeURIComponent(studentId)}/exports/progression-plans`, { format }),
    ),
  teacherGroupCapabilityMap: (groupId: string) =>
    request<GroupCapabilityMapResponse>(`/api/teacher/groups/${encodeURIComponent(groupId)}/capability-map`),
  teacherResolveProgressionAlert: (alertId: string, payload: ProgressionAlertActionPayload = {}) =>
    request<StudentProgressionAlert>(`/api/teacher/progression-alerts/${encodeURIComponent(alertId)}/resolve`, { method: "POST", body: JSON.stringify(payload) }),
  teacherIgnoreProgressionAlert: (alertId: string, payload: ProgressionAlertActionPayload = {}) =>
    request<StudentProgressionAlert>(`/api/teacher/progression-alerts/${encodeURIComponent(alertId)}/ignore`, { method: "POST", body: JSON.stringify(payload) }),
  teacherGenerateProgressionAlertTask: (alertId: string, payload: ProgressionAlertActionPayload = {}) =>
    request<StudentProgressionAlert>(`/api/teacher/progression-alerts/${encodeURIComponent(alertId)}/task`, { method: "POST", body: JSON.stringify(payload) }),
  teacherAddProgressionAlertToLessonPlan: (alertId: string, payload: ProgressionAlertActionPayload = {}) =>
    request<StudentProgressionAlert>(`/api/teacher/progression-alerts/${encodeURIComponent(alertId)}/lesson-plan`, { method: "POST", body: JSON.stringify(payload) }),
  teacherProgressionAlertLessonBuilder: (alertId: string) =>
    request<LessonBuilderResponse>(`/api/teacher/progression-alerts/${encodeURIComponent(alertId)}/lesson-builder`, { method: "POST" }),
  teacherProgressionAlertExplanation: (alertId: string) =>
    request<ProgressionAlertExplanation>(`/api/teacher/progression-alerts/${encodeURIComponent(alertId)}/explanation`),
  teacherProgressionAlertHistory: (alertId: string) =>
    request<StudentProgressionAlertHistory[]>(`/api/teacher/progression-alerts/${encodeURIComponent(alertId)}/history`),
  teacherUpdateProgressionPlanStatus: (planId: string, payload: ProgressionPlanStatusPayload) =>
    request<StudentProgressionPlan>(`/api/teacher/progression-plans/${encodeURIComponent(planId)}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
  teacherProgressionPlanHistory: (planId: string) =>
    request<StudentProgressionPlanHistory[]>(`/api/teacher/progression-plans/${encodeURIComponent(planId)}/history`),
  teacherBatchAnalyzeProgression: () =>
    request<ClassProgressionAlertResponse>("/api/teacher/progression/batch-analyze", { method: "POST" }),
  studentGapDiagnosis: (payload: StudentGapDiagnosisRequest) =>
    request<StudentGapDiagnosisResponse>("/api/student/gap-diagnosis", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminRagAudit: () => request<RAGAuditDashboardResponse>("/api/admin/rag-audit"),
  adminDashboard: (params: Record<string, string | number | undefined> = {}) =>
    request<AdminDashboardResponse>(withParams("/api/admin/dashboard", params)),
  adminDataQuality: (params: Record<string, string | number | undefined> = {}) =>
    request<AdminDataQualityResponse>(withParams("/api/admin/data-quality", params)),
  adminDataQualityRun: (params: Record<string, string | number | undefined> = {}, note?: string) =>
    request<AdminDataQualityRunResponse>(withParams("/api/admin/data-quality/run", params), {
      method: "POST",
      body: JSON.stringify({ note }),
    }),
  adminDataQualityResolve: (issueId: string, payload: AdminDataQualityResolvePayload) =>
    request<AdminDataQualityResponse["issues"][number]>(`/api/admin/data-quality/${encodeURIComponent(issueId)}/resolve`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminTeachers: (params: Record<string, string | number | undefined> = {}) =>
    request<AdminTeacherListResponse>(withParams("/api/admin/teachers", params)),
  adminTeacherDetail: (teacherId: string, params: Record<string, string | number | undefined> = {}) =>
    request<AdminTeacherDetailResponse>(withParams(`/api/admin/teachers/${encodeURIComponent(teacherId)}`, params)),
  adminClasses: (params: Record<string, string | number | undefined> = {}) =>
    request<AdminClassListResponse>(withParams("/api/admin/classes", params)),
  adminClassDetail: (classId: string, params: Record<string, string | number | undefined> = {}) =>
    request<AdminClassDetailResponse>(withParams(`/api/admin/classes/${encodeURIComponent(classId)}`, params)),
  adminStudentProjects: (params: Record<string, string | number | undefined> = {}) =>
    request<AdminStudentProjectListResponse>(withParams("/api/admin/student-projects", params)),
  adminStudentProjectDetail: (studentId: string) =>
    request<AdminStudentProjectDetailResponse>(`/api/admin/student-projects/${encodeURIComponent(studentId)}`),
  adminProjectProgress: (params: Record<string, string | number | boolean | undefined> = {}) =>
    request<AdminProjectProgressResponse>(withParams("/api/admin/project-progress", params)),
  adminProjectProgressDetail: (runId: string) =>
    request<AdminProjectProgressDetailResponse>(`/api/admin/project-progress/${encodeURIComponent(runId)}`),
  adminAcceptance: (params: Record<string, string | number | boolean | undefined> = {}) =>
    request<AdminAcceptanceResponse>(withParams("/api/admin/acceptance", params)),
  adminAcceptanceDetail: (acceptanceId: string) =>
    request<AdminAcceptanceDetailResponse>(`/api/admin/acceptance/${encodeURIComponent(acceptanceId)}`),
  adminDeliverables: (params: Record<string, string | number | boolean | undefined> = {}) =>
    request<AdminDeliverablesResponse>(withParams("/api/admin/deliverables", params)),
  adminKnowledgeCoverage: (params: Record<string, string | number | boolean | undefined> = {}) =>
    request<AdminKnowledgeCoverageResponse>(withParams("/api/admin/knowledge-coverage", params)),
  adminCompetitionZongping: (params: Record<string, string | number | boolean | undefined> = {}) =>
    request<AdminCompetitionZongpingResponse>(withParams("/api/admin/competition-zongping", params)),
  adminCampuses: () => request<AdminCampusListResponse>("/api/admin/campuses"),
  adminRagHealth: (params: QueryParams = {}) => request<AdminRagHealthResponse>(withParams("/api/admin/rag-health", params)),
  adminOperationalRiskStatus: (riskId: string, payload: { status: string; owner_user_id?: string | null; owner_role?: string | null; note?: string | null }) =>
    request<{ audit_id: string; risk: AdminRagHealthResponse["risk_queue"][number] }>(`/api/admin/rag-health/risks/${encodeURIComponent(riskId)}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminOperationalRiskBulkStatus: (payload: AdminOperationalRiskBulkStatusPayload) =>
    request<AdminOperationalRiskBulkResponse>("/api/admin/rag-health/risks/bulk-status", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminOperationalRiskBulkAssign: (payload: AdminOperationalRiskBulkAssignPayload) =>
    request<AdminOperationalRiskBulkResponse>("/api/admin/rag-health/risks/bulk-assign", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminMarkdownFlowReviewOptions: () =>
    request<MarkdownFlowReviewOptionsResponse>("/api/admin/rag-health/markdownflow-review-tasks/options"),
  adminMarkdownFlowReviewBulkStatus: (payload: MarkdownFlowReviewBulkStatusPayload) =>
    request<MarkdownFlowReviewBulkStatusResponse>("/api/admin/rag-health/markdownflow-review-tasks/bulk-status", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminMarkdownFlowReviewBulkAssign: (payload: MarkdownFlowReviewBulkAssignPayload) =>
    request<MarkdownFlowReviewBulkAssignResponse>("/api/admin/rag-health/markdownflow-review-tasks/bulk-assign", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminMarkdownFlowReviewExport: (payload: MarkdownFlowReviewExportPayload) =>
    request<AdminExportJob>("/api/admin/rag-health/markdownflow-review-tasks/export", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminExportJobDownloadUrl: (jobId: string) =>
    `/api/admin/reports/export-jobs/${encodeURIComponent(jobId)}/download`,
  adminExportJobDownload: (jobId: string) =>
    requestBlob(`/api/admin/reports/export-jobs/${encodeURIComponent(jobId)}/download`),
  adminExportJobsCleanup: () =>
    request<Record<string, unknown>>("/api/admin/reports/export-jobs/cleanup", { method: "POST" }),
  adminRagHealthEvaluate: (payload: { dataset_name?: string; sample_size?: number } = {}) =>
    request<AdminRagHealthEvaluateResponse>("/api/admin/rag-health/evaluate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminRagHealthReindex: (payload: { package_id?: string; project_id?: string; action?: string } = {}) =>
    request<AdminRagHealthReindexResponse>("/api/admin/rag-health/reindex", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminReports: () => request<AdminReportsResponse>("/api/admin/reports"),
  adminReportExport: (payload: { report_type: string; format: string; filters?: Record<string, string> }) =>
    request<AdminExportJob>("/api/admin/reports/export", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminOperationalRiskSubscriptionsGenerate: () =>
    request<Record<string, unknown>>("/api/admin/reports/operational-risk-subscriptions/generate", { method: "POST" }),
  adminNotificationStatus: (notificationId: string, payload: AdminNotificationStatusPayload) =>
    request<AdminNotificationStatusResponse>(`/api/admin/notifications/${encodeURIComponent(notificationId)}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotifications: (params: QueryParams = {}) =>
    request<AdminNotificationsListResponse>(withParams("/api/admin/notifications", params)),
  adminNotificationsBulkClose: (payload: AdminNotificationBulkClosePayload) =>
    request<AdminNotificationBulkCloseResponse>("/api/admin/notifications/bulk-close", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsDispatchDryRun: (payload: AdminNotificationDispatchDryRunPayload) =>
    request<AdminNotificationDispatchDryRunResponse>("/api/admin/notifications/dispatch/dry-run", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsDispatchPolicy: () =>
    request<AdminNotificationDispatchPolicyResponse>("/api/admin/notifications/dispatch/policy"),
  adminNotificationsDispatchPolicyUpdate: (payload: AdminNotificationDispatchPolicyPayload) =>
    request<AdminNotificationDispatchPolicyResponse>("/api/admin/notifications/dispatch/policy", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderProbe: (payload: AdminNotificationProviderProbePayload) =>
    request<AdminNotificationProviderProbeResponse>("/api/admin/notifications/dispatch/provider-probe", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderReleaseAudit: (params: QueryParams = {}) =>
    request<AdminNotificationProviderReleaseAuditResponse>(withParams("/api/admin/notifications/provider-release-audit", params)),
  adminNotificationsProviderWebhookAlertStatus: (alertId: string, payload: AdminNotificationProviderWebhookAlertStatusPayload) =>
    request<AdminNotificationProviderWebhookAlertStatusResponse>(`/api/admin/notifications/provider-release-audit/webhook-alerts/${encodeURIComponent(alertId)}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderReleaseExportCleanupAction: (payload: AdminNotificationProviderReleaseExportCleanupActionPayload) =>
    request<AdminNotificationProviderReleaseExportCleanupActionResponse>("/api/admin/notifications/provider-release-audit/export-cleanup-risks/action", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderReleaseBatchCreate: (payload: AdminNotificationProviderReleaseBatchPayload) =>
    request<AdminNotificationProviderReleaseBatchResponse>("/api/admin/notifications/provider-release-batches", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderReleaseBatchProbe: (releaseBatchId: string, payload: AdminNotificationProviderReleaseBatchActionPayload = {}) =>
    request<AdminNotificationProviderProbeResponse>(`/api/admin/notifications/provider-release-batches/${encodeURIComponent(releaseBatchId)}/probe`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderReleaseBatchApprove: (releaseBatchId: string, payload: AdminNotificationProviderReleaseBatchActionPayload = {}) =>
    request<AdminNotificationProviderReleaseBatchResponse>(`/api/admin/notifications/provider-release-batches/${encodeURIComponent(releaseBatchId)}/approve`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderReleaseBatchReject: (releaseBatchId: string, payload: AdminNotificationProviderReleaseBatchActionPayload = {}) =>
    request<AdminNotificationProviderReleaseBatchResponse>(`/api/admin/notifications/provider-release-batches/${encodeURIComponent(releaseBatchId)}/reject`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsProviderReleaseBatchRollback: (releaseBatchId: string, payload: AdminNotificationProviderReleaseBatchActionPayload = {}) =>
    request<AdminNotificationProviderReleaseBatchResponse>(`/api/admin/notifications/provider-release-batches/${encodeURIComponent(releaseBatchId)}/rollback`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsDispatchApprove: (payload: AdminNotificationDispatchApprovalPayload) =>
    request<AdminNotificationDispatchAuditResponse>("/api/admin/notifications/dispatch/approve", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsDispatchSend: (payload: AdminNotificationDispatchSendPayload) =>
    request<AdminNotificationDispatchAuditResponse>("/api/admin/notifications/dispatch/send", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationOutbox: (params: QueryParams = {}) =>
    request<AdminNotificationOutboxListResponse>(withParams("/api/admin/notifications/outbox", params)),
  adminNotificationOutboxReplayApprove: (payload: AdminNotificationOutboxReplayApprovalPayload) =>
    request<AdminNotificationOutboxReplayApprovalResponse>("/api/admin/notifications/outbox/replay-approve", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationOutboxReplayRevoke: (payload: AdminNotificationOutboxReplayRevokePayload) =>
    request<AdminNotificationOutboxReplayRevokeResponse>("/api/admin/notifications/outbox/replay-revoke", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationOutboxReplay: (payload: AdminNotificationOutboxReplayExecutePayload) =>
    request<AdminNotificationOutboxReplayExecuteResponse>("/api/admin/notifications/outbox/replay", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminNotificationsStats: (params: QueryParams = {}) => request<AdminNotificationStatsResponse>(withParams("/api/admin/notifications/stats", params)),
  adminSettings: () => request<AdminSettingsResponse>("/api/admin/settings"),
  adminSettingsAuditTrail: (params: QueryParams = {}) =>
    request<AdminSettingAuditTrailResponse>(withParams("/api/admin/settings/audit-trail", params)),
  adminSettingsRollback: (payload: AdminSettingsRollbackRequest) =>
    request<AdminSettingsResponse>("/api/admin/settings/rollback", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminSettingsRollbackRequests: (params: QueryParams = {}) =>
    request<AdminSettingsRollbackRequestsResponse>(withParams("/api/admin/settings/rollback-requests", params)),
  adminSettingsRollbackRequest: (payload: AdminSettingsRollbackRequest) =>
    request<AdminSettingsRollbackRequestResponse>("/api/admin/settings/rollback-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminSettingsRollbackRemindersGenerate: (params: QueryParams = {}) =>
    request<AdminSettingsRollbackReminderGenerateResponse>(withParams("/api/admin/settings/rollback-requests/reminders/generate", params), { method: "POST" }),
  adminSettingsRollbackDecision: (requestId: string, payload: AdminSettingsRollbackDecisionRequest) =>
    request<AdminSettingsRollbackDecisionResponse>(`/api/admin/settings/rollback-requests/${encodeURIComponent(requestId)}/decision`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminSettingsUpdate: (payload: { setting_key: string; payload: Record<string, unknown> }) =>
    request<AdminSettingsResponse>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  adminProviderReleaseAuditViewsExport: () =>
    request<AdminProviderReleaseAuditViewsMigrationPackage>("/api/admin/settings/provider-release-audit-views/export"),
  adminProviderReleaseAuditViewsImportPreview: (payload: AdminProviderReleaseAuditViewsImportRequest) =>
    request<AdminProviderReleaseAuditViewsImportPreviewResponse>("/api/admin/settings/provider-release-audit-views/import-preview", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminProviderReleaseAuditViewsImportPreviewExport: (payload: AdminProviderReleaseAuditViewsImportPreviewExportRequest) =>
    request<AdminExportJob>("/api/admin/settings/provider-release-audit-views/import-preview/export", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminProviderReleaseAuditViewsImportPreviewExportCleanupAction: (payload: AdminNotificationProviderReleaseExportCleanupActionPayload) =>
    request<AdminNotificationProviderReleaseExportCleanupActionResponse>("/api/admin/settings/provider-release-audit-views/import-preview/export-cleanup-risks/action", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminProviderReleaseAuditViewsImport: (payload: AdminProviderReleaseAuditViewsImportRequest) =>
    request<AdminProviderReleaseAuditViewsImportResponse>("/api/admin/settings/provider-release-audit-views/import", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminXiaomaiStatus: () => request<XiaomaiIntegrationStatusResponse>("/api/admin/integrations/xiaomai/status"),
  adminXiaomaiHealth: () => request<XiaomaiConnectorHealthResponse>("/api/admin/integrations/xiaomai/health"),
  adminXiaomaiAcceptance: () => request<XiaomaiAcceptanceResponse>("/api/admin/integrations/xiaomai/acceptance"),
  adminXiaomaiAccounts: () => request<XiaomaiAccountRead[]>("/api/admin/integrations/xiaomai/accounts"),
  adminXiaomaiTestAccount: (payload: XiaomaiAccountTestRequest) =>
    request<XiaomaiAccountTestResponse>("/api/admin/integrations/xiaomai/accounts/test", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminXiaomaiDryRun: (payload: XiaomaiSyncJobRequest) =>
    request<XiaomaiSyncJobResponse>("/api/admin/integrations/xiaomai/sync-jobs/dry-run", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminXiaomaiCreateSyncJob: (payload: XiaomaiSyncJobRequest) =>
    request<XiaomaiSyncJobResponse>("/api/admin/integrations/xiaomai/sync-jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminXiaomaiQueueSyncJob: (payload: XiaomaiSyncJobRequest) =>
    request<XiaomaiSyncJobResponse>("/api/admin/integrations/xiaomai/sync-jobs/queue", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminXiaomaiSyncJobs: (params: QueryParams = {}) =>
    request<XiaomaiSyncJobRead[]>(withParams("/api/admin/integrations/xiaomai/sync-jobs", params)),
  adminXiaomaiSyncJob: (jobId: string) =>
    request<XiaomaiSyncJobResponse>(`/api/admin/integrations/xiaomai/sync-jobs/${encodeURIComponent(jobId)}`),
  adminXiaomaiSyncJobReport: (jobId: string) =>
    request<XiaomaiSyncReportResponse>(`/api/admin/integrations/xiaomai/sync-jobs/${encodeURIComponent(jobId)}/report`),
  adminXiaomaiSyncJobReportCsv: (jobId: string) =>
    requestBlob(`/api/admin/integrations/xiaomai/sync-jobs/${encodeURIComponent(jobId)}/report.csv`),
  adminXiaomaiQuestionBank: (params: QueryParams = {}) =>
    request<XiaomaiQuestionBankItemRead[]>(withParams("/api/admin/integrations/xiaomai/question-bank", params)),
  adminXiaomaiPapers: (params: QueryParams = {}) =>
    request<XiaomaiPaperRead[]>(withParams("/api/admin/integrations/xiaomai/papers", params)),
  adminXiaomaiDownloadResource: (sourceId: string) =>
    request<XiaomaiResourceDownloadResponse>(`/api/admin/integrations/xiaomai/resources/${encodeURIComponent(sourceId)}/download`, {
      method: "POST",
    }),
  teacherXiaomaiEmbedConfig: () => request<XiaomaiEmbedConfigResponse>("/api/teacher/xiaomai/embed-config"),
  adminRagEvalRun: (payload: EvaluationRunRequest) =>
    request<EvaluationRunResponse>("/api/admin/rag-eval/run", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminTeacherOpsAudit: (params: Record<string, string | number | undefined> = {}) =>
    request<TeacherOpsAuditResponse>(withParams("/api/admin/teacher-ops-audit", params)),
  adminTeacherOpsAuditExport: (params: Record<string, string | number | undefined> = {}) =>
    request<TeacherDataExportResponse>(withParams("/api/admin/teacher-ops-audit/export", params)),
  adminWorkBuddyArtifacts: (params: QueryParams = {}) =>
    request<WorkBuddyArtifactListResponse>(withParams("/api/admin/workbuddy/artifacts", params)),
  adminWorkBuddyArtifact: (artifactId: string) =>
    request<WorkBuddyArtifact>(`/api/admin/workbuddy/artifacts/${encodeURIComponent(artifactId)}`),
  adminWorkBuddyArtifactUpdateStatus: (artifactId: string, payload: WorkBuddyArtifactStatusUpdatePayload) =>
    request<WorkBuddyArtifact>(`/api/admin/workbuddy/artifacts/${encodeURIComponent(artifactId)}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  adminWorkBuddyArtifactMarkdown: (artifactId: string) =>
    requestBlob(`/api/admin/workbuddy/artifacts/${encodeURIComponent(artifactId)}/markdown`),
  adminWorkBuddyAdoptionWorkbench: (params: QueryParams = {}) =>
    request<WorkBuddyAdoptionWorkbenchResponse>(withParams("/api/admin/workbuddy/adoption-workbench", params)),
  adminWorkBuddyQuestionAnalysisTeacherReview: (artifactId: string, payload: WorkBuddyQuestionAnalysisReviewPayload) =>
    request<WorkBuddyQuestionAnalysisReviewResponse>(`/api/admin/workbuddy/question-analysis/${encodeURIComponent(artifactId)}/teacher-review`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminWorkBuddyTeacherDailyDispatchPreview: (artifactId: string, payload: WorkBuddyTeacherDailyDispatchPayload) =>
    request<WorkBuddyTeacherDailyDispatchPreviewResponse>(`/api/admin/workbuddy/teacher-daily/${encodeURIComponent(artifactId)}/dispatch-preview`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminWorkBuddyTeacherDailyDispatch: (artifactId: string, payload: WorkBuddyTeacherDailyDispatchPayload) =>
    request<WorkBuddyTeacherDailyDispatchResponse>(`/api/admin/workbuddy/teacher-daily/${encodeURIComponent(artifactId)}/dispatch`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingCategories: (params: Record<string, string | number | undefined> = {}) =>
    request<ZongpingCategory[]>(withParams("/api/zongping/categories", params)),
  zongpingStudentProfile: (studentId: string) =>
    request<ZongpingStudentProfile>(`/api/zongping/students/${studentId}/profile`),
  zongpingStudentRecords: (studentId: string) =>
    request<ZongpingStudentRecords>(`/api/zongping/students/${studentId}/records`),
  zongpingResume: (studentId: string) =>
    request<ZongpingResumeResponse>(`/api/zongping/students/${studentId}/resume`, { method: "POST" }),
  portfolio: (studentId: string) =>
    request<StudentPortfolioResponse>(`/api/portfolio/${studentId}`),
  generatePortfolio: (payload: PortfolioGenerateRequest) =>
    request<StudentPortfolioResponse>("/api/portfolio/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingMapRecords: (payload: { student_id: string; source_type?: string; source_record_ids?: string[] }) =>
    request<ZongpingMappedEntryOption[]>("/api/zongping/map-records", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingGenerateEntry: (payload: ZongpingGenerateEntryRequest) =>
    request<ZongpingGenerateEntryResponse>("/api/zongping/generate-entry", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingComplianceCheck: (payload: Record<string, unknown>) =>
    request<Record<string, unknown>>("/api/zongping/compliance-check", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingEntries: (params: Record<string, string | number | undefined> = {}) =>
    request<ZongpingGeneratedEntry[]>(withParams("/api/zongping/entries", params)),
  zongpingEntry: (entryId: string) =>
    request<ZongpingGenerateEntryResponse>(`/api/zongping/entries/${entryId}`),
  zongpingUpdateEntry: (entryId: string, payload: Record<string, unknown>) =>
    request<ZongpingGenerateEntryResponse>(`/api/zongping/entries/${entryId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  zongpingConfirmAuthenticity: (entryId: string, payload: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/api/zongping/entries/${entryId}/confirm-authenticity`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingMaterials: (params: Record<string, string | number | undefined> = {}) =>
    request<ZongpingEvidenceMaterial[]>(withParams("/api/zongping/materials", params)),
  zongpingUploadMaterial: (payload: Record<string, unknown>) =>
    request<ZongpingEvidenceMaterial>("/api/zongping/materials/upload", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingUploadMaterialFile: (formData: FormData) =>
    requestForm<ZongpingEvidenceMaterial>("/api/zongping/materials/upload", formData),
  zongpingAuditMaterials: (payload: Record<string, unknown>) =>
    request<ZongpingMaterialAudit[]>("/api/zongping/materials/audit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingTeacherDashboard: (params: Record<string, string | number | undefined> = {}) =>
    request<ZongpingTeacherDashboard>(withParams("/api/zongping/teacher/class-dashboard", params)),
  zongpingExportWord: (payload: Record<string, unknown>) =>
    request<ZongpingExportResponse>("/api/zongping/export/word", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingExportExcel: (payload: Record<string, unknown>) =>
    request<ZongpingExportResponse>("/api/zongping/export/excel", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  zongpingTemplates: () => request<ZongpingTemplate[]>("/api/zongping/templates"),
  zongpingUpdateTemplate: (templateId: string, payload: Record<string, unknown>) =>
    request<ZongpingTemplate>(`/api/zongping/templates/${templateId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
