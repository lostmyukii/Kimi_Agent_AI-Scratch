export interface HealthResponse {
  status: string;
  version: string;
  app_name: string;
  database: string;
  database_path: string;
}

export interface AuthUser {
  user_id: string;
  username: string;
  display_name: string;
  role: string;
  status: string;
  allowed_view_modes: string[];
  permissions: string[];
  scope_class_ids: string[];
  scope_student_ids: string[];
  scope_group_ids: string[];
}

export interface AuthPermissionResponse {
  user: AuthUser;
  user_id: string;
  username: string;
  display_name: string;
  role: string;
  allowed_view_modes: string[];
  permissions: string[];
  internal_tools_allowed: boolean;
  admin_tools_allowed: boolean;
  admin_console_allowed: boolean;
  default_view_mode: string;
}

export interface AuthSessionResponse {
  session_id: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_seconds: number;
  refresh_expires_in_seconds: number;
  access_expires_at: string;
  refresh_expires_at: string;
  auth: AuthPermissionResponse;
}

export interface AuthLogoutResponse {
  revoked: boolean;
  session_id?: string | null;
  status?: string | null;
}

export type WorkBuddyArtifactStatus = "draft" | "reviewed" | "adopted" | "archived";
export type WorkBuddyArtifactType =
  | "course_plan"
  | "parent_message"
  | "enrollment_copy"
  | "competition_material"
  | "question_analysis"
  | "teacher_daily_report";

export interface WorkBuddyArtifact {
  id: string;
  title: string;
  type: WorkBuddyArtifactType;
  contentMarkdown: string;
  sourceSkill: string;
  status: WorkBuddyArtifactStatus;
  createdBy: string;
  createdAt: string;
}

export interface WorkBuddyArtifactListResponse {
  items: WorkBuddyArtifact[];
}

export interface WorkBuddyArtifactStatusUpdatePayload {
  status: WorkBuddyArtifactStatus;
  reviewNote?: string;
  actor?: string;
}

export type WorkBuddyAdoptionNextAction =
  | "adoption_preview"
  | "target_review"
  | "teacher_review"
  | "dispatch_task_drafts"
  | "inspect_failure"
  | "view_latest_revision"
  | "target_not_available";

export interface WorkBuddyAdoptionWorkbenchSummary {
  totalArtifacts: number;
  draftArtifacts: number;
  reviewedArtifacts: number;
  adoptedArtifacts: number;
  archivedArtifacts: number;
  importedAdoptions: number;
  pendingTargetReview: number;
  actionRequired: number;
  failedAdoptions: number;
}

export interface WorkBuddyAdoptionWorkbenchItem {
  artifactId: string;
  artifactTitle: string;
  artifactType: WorkBuddyArtifactType;
  sourceSkill: string;
  artifactStatus: WorkBuddyArtifactStatus;
  adoptionStatus: string;
  targetType: string;
  targetId?: string | null;
  targetStatus: string;
  nextAction: WorkBuddyAdoptionNextAction;
  warnings: string[];
  nextActions: string[];
  contentMarkdownPreview: string;
  createdAt: string;
  updatedAt?: string | null;
  metadata: Record<string, unknown>;
}

export interface WorkBuddyAdoptionWorkbenchResponse {
  summary: WorkBuddyAdoptionWorkbenchSummary;
  items: WorkBuddyAdoptionWorkbenchItem[];
  warnings: string[];
}

export interface WorkBuddyQuestionAnalysisReviewPayload {
  action: "teacher_reviewed" | "approved_for_use" | "rejected" | "archived";
  reviewNote: string;
  correctedAnswer?: string;
  correctedExplanation?: string;
  correctedKnowledgePointIds?: string[];
}

export interface WorkBuddyQuestionAnalysisReviewResponse {
  artifactId: string;
  targetId: string;
  reviewStatus: WorkBuddyArtifactStatus;
  warnings: string[];
  nextActions: string[];
}

export interface WorkBuddyTeacherDailyDispatchPayload {
  draftTaskIds: string[];
  assigneeUserIds: string[];
  dueAt?: string | null;
  dispatchNote: string;
  confirmed?: boolean;
}

export interface WorkBuddyTeacherDailyDispatchTaskDraft {
  draftTaskId: string;
  title: string;
  description: string;
  priority: string;
  sourceKey: string;
  assigneeUserIds: string[];
  dueAt?: string | null;
  warnings: string[];
}

export interface WorkBuddyTeacherDailyDispatchPreviewResponse {
  artifactId: string;
  taskDrafts: WorkBuddyTeacherDailyDispatchTaskDraft[];
  warnings: string[];
  nextActions: string[];
}

export interface WorkBuddyTeacherDailyDispatchResponse {
  artifactId: string;
  createdTaskIds: string[];
  existingTaskIds: string[];
  warnings: string[];
  nextActions: string[];
}

export interface AdminScopeRead {
  actor_id: string;
  role: string;
  campus_ids: string[];
  class_ids: string[];
  student_ids: string[];
  can_view_student_private_fields: boolean;
  can_export: boolean;
  can_review_project_plugins: boolean;
  can_run_rag_evaluation: boolean;
  can_manage_settings: boolean;
}

export interface AdminDashboardStats {
  active_students: number;
  active_classes: number;
  running_projects: number;
  pending_acceptance: number;
  completed_projects: number;
  acceptance_pass_rate: number;
  deliverable_completion_rate: number;
  missing_materials: number;
  high_risk_alerts: number;
  data_quality_risks: number;
}

export interface AdminProjectStageBucket {
  stage: string;
  count: number;
  percentage: number;
}

export interface AdminCampusOperationProfile {
  campus_id: string;
  campus_name: string;
  manager_id: string | null;
  active_students: number;
  active_classes: number;
  active_teachers: number;
  running_projects: number;
  acceptance_pass_rate: number;
  deliverable_completion_rate: number;
  risk_count: number;
  data_quality_score: number;
  delivery_health_score: number;
}

export interface AdminTeacherDeliveryHealth {
  teacher_id: string;
  name: string;
  campus_id: string | null;
  class_count: number;
  student_count: number;
  running_project_count: number;
  weekly_update_rate: number;
  parent_feedback_completion_rate: number;
  project_acceptance_pass_rate: number;
  missing_material_count: number;
  progression_alert_resolve_rate: number;
  teacher_delivery_health_score: number;
  risk_level: string;
  status_label: string;
}

export interface AdminRiskItem {
  risk_id: string;
  risk_type: string;
  severity: string;
  scope_type: string;
  scope_id: string;
  campus_id: string | null;
  class_id: string | null;
  student_display_name: string | null;
  title: string;
  description: string;
  recommended_action: string;
  status: string;
  owner_user_id?: string | null;
  owner_role?: string | null;
  handled_by?: string | null;
  handled_at?: string | null;
  resolution_note?: string | null;
  confirmed_by?: string | null;
  confirmed_at?: string | null;
  ignored_by?: string | null;
  ignored_at?: string | null;
  reopened_by?: string | null;
  reopened_at?: string | null;
  first_seen_at?: string | null;
  last_seen_at?: string | null;
  source_url: string | null;
}

export interface AdminPendingTask {
  task_id: string;
  task_type: string;
  title: string;
  scope_type: string;
  scope_id: string | null;
  campus_id: string | null;
  priority: string;
  due_at: string | null;
  action_url: string | null;
}

export interface AdminDataQualityIssue {
  issue_id: string;
  issue_type: string;
  severity: string;
  scope: string;
  scope_id: string;
  campus_id: string | null;
  class_id: string | null;
  student_display_name: string | null;
  title: string;
  description: string;
  recommended_action: string;
  status: string;
  owner_role: string;
  owner_user_id: string | null;
  assigned_by: string | null;
  assigned_at: string | null;
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
  last_seen_at: string | null;
  last_scan_id: string | null;
}

export interface AdminDashboardResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  stats: AdminDashboardStats;
  project_stage_distribution: AdminProjectStageBucket[];
  campus_profiles: AdminCampusOperationProfile[];
  teacher_health: AdminTeacherDeliveryHealth[];
  high_risk_items: AdminRiskItem[];
  pending_tasks: AdminPendingTask[];
  data_quality_issues: AdminDataQualityIssue[];
  data_source_status: {
    mode: string;
    real_sources: string[];
    placeholders: string[];
  };
  generated_at: string;
}

export interface AdminDataQualityResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  issues: AdminDataQualityIssue[];
  generated_at: string;
}

export interface AdminDataQualityRunResponse {
  scan_id: string;
  scanned_issue_count: number;
  new_issue_count: number;
  updated_issue_count: number;
  resolved_visible_count: number;
  audit_id: string;
  data_quality: AdminDataQualityResponse;
}

export interface AdminDataQualityResolvePayload {
  status?: string;
  owner_role?: string;
  owner_user_id?: string;
  resolution_note?: string;
}

export interface AdminTeacherOperationProfile {
  teacher_id: string;
  name: string;
  campus_id: string | null;
  campus_name: string | null;
  class_count: number;
  student_count: number;
  running_project_count: number;
  weekly_update_rate: number;
  parent_feedback_completion_rate: number;
  project_acceptance_pass_rate: number;
  deliverable_completion_rate: number;
  missing_material_count: number;
  progression_alert_resolve_rate: number;
  delivery_health_score: number;
  risk_level: string;
  status_label: string;
  risk_count: number;
  data_quality_issue_count: number;
  last_update_at: string | null;
}

export interface AdminClassOperationProfile {
  class_id: string;
  class_name: string;
  campus_id: string | null;
  campus_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  age_band: string | null;
  course_track: string[];
  student_count: number;
  project_group_count: number;
  running_project_count: number;
  completion_rate: number;
  acceptance_rate: number;
  deliverable_rate: number;
  risk_count: number;
  data_quality_issue_count: number;
  delivery_health_score: number;
  status: string;
  last_update_at: string | null;
}

export interface AdminProjectGroupSummary {
  group_id: string;
  group_name: string;
  project_id: string | null;
  project_name: string | null;
  current_stage: string;
  progress_percent: number;
  member_count: number;
  status: string;
  risk_count: number;
}

export interface AdminStudentProjectStatus {
  student_id: string;
  student_display_name: string;
  campus_id: string | null;
  campus_name: string | null;
  class_id: string | null;
  class_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  group_id: string | null;
  group_name: string | null;
  current_project_id: string | null;
  current_project_name: string | null;
  project_stage: string;
  progress_percent: number;
  last_updated_at: string | null;
  missing_material_count: number;
  acceptance_status: string;
  student_profile_status: string;
  knowledge_repeat_alert: boolean;
  risk_level: string;
  risk_flags: string[];
  course_level: string | null;
  project_status: string | null;
  deliverable_rate: number;
  evidence_count: number;
  data_quality_issue_count: number;
}

export interface AdminProjectTemplateProgress {
  project_id: string;
  project_name: string;
  project_version: string | null;
  course_level: string | null;
  course_track: string[];
  using_class_count: number;
  using_student_count: number;
  current_running_count: number;
  completed_count: number;
  pending_acceptance_count: number;
  delayed_count: number;
  acceptance_pass_rate: number;
  average_completion_days: number;
  common_risks: string[];
  common_missing_materials: string[];
  teacher_feedback_count: number;
  average_quality_score: number;
  risk_level: string;
}

export interface AdminProjectRunSnapshot {
  run_id: string;
  project_id: string | null;
  project_name: string;
  project_version: string | null;
  campus_id: string | null;
  campus_name: string | null;
  class_id: string | null;
  class_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  group_id: string | null;
  group_name: string | null;
  student_id: string;
  student_display_name: string;
  course_level: string | null;
  current_stage: string;
  progress_percent: number;
  planned_end_date: string | null;
  is_delayed: boolean;
  delay_days: number;
  acceptance_status: string;
  risk_level: string;
  risk_flags: string[];
  missing_material_count: number;
  knowledge_point_count: number;
  deliverable_count: number;
  evidence_count: number;
  last_updated_at: string | null;
}

export interface AdminAcceptanceDimensionScore {
  dimension_id: string;
  dimension_name: string;
  score: number;
  status: string;
  comment: string | null;
}

export interface AdminProjectAcceptanceSummary {
  acceptance_id: string;
  record_id: string;
  project_id: string | null;
  project_name: string;
  campus_id: string | null;
  campus_name: string | null;
  class_id: string | null;
  class_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  group_id: string | null;
  group_name: string | null;
  student_id: string;
  student_display_name: string;
  course_level: string | null;
  acceptance_status: string;
  overall_score: number;
  seven_dimension_average: number;
  dimension_scores: AdminAcceptanceDimensionScore[];
  missing_material_count: number;
  evidence_count: number;
  deliverable_count: number;
  issue_count: number;
  risk_level: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_id: string | null;
  can_archive: boolean;
}

export interface AdminTeacherListResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  teachers: AdminTeacherOperationProfile[];
  generated_at: string;
}

export interface AdminTeacherDetailResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  profile: AdminTeacherOperationProfile;
  classes: AdminClassOperationProfile[];
  student_projects: AdminStudentProjectStatus[];
  risks: AdminRiskItem[];
  data_quality_issues: AdminDataQualityIssue[];
  generated_at: string;
}

export interface AdminClassListResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  classes: AdminClassOperationProfile[];
  generated_at: string;
}

export interface AdminClassDetailResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  profile: AdminClassOperationProfile;
  project_groups: AdminProjectGroupSummary[];
  student_projects: AdminStudentProjectStatus[];
  risks: AdminRiskItem[];
  data_quality_issues: AdminDataQualityIssue[];
  generated_at: string;
}

export interface AdminStudentProjectListResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  students: AdminStudentProjectStatus[];
  generated_at: string;
}

export interface AdminStudentProjectDetailResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  status: AdminStudentProjectStatus;
  project_history: AdminStudentProjectStatus[];
  risks: AdminRiskItem[];
  data_quality_issues: AdminDataQualityIssue[];
  generated_at: string;
}

export interface AdminProjectProgressResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  template_snapshots: AdminProjectTemplateProgress[];
  project_runs: AdminProjectRunSnapshot[];
  generated_at: string;
}

export interface AdminProjectProgressDetailResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  run: AdminProjectRunSnapshot;
  template: AdminProjectTemplateProgress | null;
  acceptance: AdminProjectAcceptanceSummary | null;
  risks: AdminRiskItem[];
  data_quality_issues: AdminDataQualityIssue[];
  generated_at: string;
}

export interface AdminAcceptanceResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  records: AdminProjectAcceptanceSummary[];
  generated_at: string;
}

export interface AdminAcceptanceDetailResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  record: AdminProjectAcceptanceSummary;
  project_run: AdminProjectRunSnapshot | null;
  risks: AdminRiskItem[];
  data_quality_issues: AdminDataQualityIssue[];
  generated_at: string;
}

export interface AdminDeliverableStatusSummary {
  deliverable_id: string;
  name: string;
  type: string;
  scope_type: string;
  scope_id: string;
  related_project_id: string | null;
  related_project_name: string | null;
  campus_id: string | null;
  campus_name: string | null;
  class_id: string | null;
  class_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  student_id: string | null;
  student_display_name: string | null;
  generation_status: string;
  review_status: string;
  export_status: string;
  parent_visible: boolean;
  missing_materials: string[];
  generation_source: string;
  created_by_teacher_id: string | null;
  risk_flags: string[];
  risk_level: string;
  evidence_count: number;
  material_ids: string[];
  created_at: string | null;
  updated_at: string | null;
  action_url: string | null;
}

export interface AdminDeliverableClassSnapshot {
  class_id: string;
  class_name: string;
  campus_id: string | null;
  campus_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  expected_count: number;
  completed_count: number;
  completion_rate: number;
  pending_review_count: number;
  export_ready_count: number;
  parent_visible_count: number;
  missing_count: number;
  high_risk_count: number;
  risk_level: string;
  risk_flags: string[];
}

export interface AdminDeliverablesResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  deliverables: AdminDeliverableStatusSummary[];
  class_snapshots: AdminDeliverableClassSnapshot[];
  risks: AdminRiskItem[];
  generated_at: string;
}

export interface AdminKnowledgeCoverageMatrixRow {
  knowledge_point_id: string;
  knowledge_point_name: string;
  system: string | null;
  domain: string | null;
  age_band: string | null;
  class_count: number;
  student_count: number;
  project_count: number;
  exposure_count: number;
  repeated_student_count: number;
  successor_count: number;
  successor_covered_count: number;
  successor_progression_rate: number;
  coverage_intensity: number;
  risk_level: string;
  risk_flags: string[];
  classes: string[];
}

export interface AdminKnowledgeCoverageSnapshot {
  scope_type: string;
  scope_id: string;
  scope_name: string;
  campus_id: string | null;
  campus_name: string | null;
  class_id: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  student_count: number;
  project_count: number;
  knowledge_count: number;
  core_coverage_rate: number;
  repeated_knowledge_rate: number;
  missing_key_knowledge_points: string[];
  repeated_low_level_points: string[];
  prerequisite_gaps: string[];
  successor_progression_rate: number;
  ai_era_competency_coverage_rate: number;
  exam_coverage_rate: number;
  competition_coverage_rate: number;
  single_project_risk: boolean;
  recommended_actions: string[];
  risk_level: string;
}

export interface AdminKnowledgeCoverageResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  coverage_matrix: AdminKnowledgeCoverageMatrixRow[];
  snapshots: AdminKnowledgeCoverageSnapshot[];
  risks: AdminRiskItem[];
  generated_at: string;
}

export interface AdminCompetitionZongpingStatus {
  scope_type: string;
  scope_id: string;
  student_id: string;
  student_display_name: string;
  campus_id: string | null;
  campus_name: string | null;
  class_id: string | null;
  class_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  competition_ready_project_count: number;
  competition_record_count: number;
  exam_record_count: number;
  competition_material_completed_count: number;
  missing_certificate_count: number;
  missing_report_count: number;
  missing_video_count: number;
  zongping_ready_entry_count: number;
  zongping_generated_entry_count: number;
  missing_evidence_count: number;
  pending_review_count: number;
  high_risk_entry_count: number;
  risk_flags: string[];
  risk_level: string;
  recommended_actions: string[];
}

export interface AdminCompetitionZongpingItem {
  item_id: string;
  item_type: string;
  title: string;
  student_id: string;
  student_display_name: string;
  campus_id: string | null;
  campus_name: string | null;
  class_id: string | null;
  class_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  source_record_id: string | null;
  source_record_ids: string[];
  competition_name: string | null;
  competition_code: string | null;
  track: string | null;
  award_level: string | null;
  date: string | null;
  material_status: string;
  audit_status: string;
  risk_level: string;
  missing_materials: string[];
  evidence_count: number;
  certificate_material_id: string | null;
  report_material_ids: string[];
  video_material_ids: string[];
  generation_source: string;
  action_url: string | null;
}

export interface AdminCompetitionZongpingResponse {
  scope: AdminScopeRead;
  filters: Record<string, string | null>;
  summary: Record<string, unknown>;
  statuses: AdminCompetitionZongpingStatus[];
  items: AdminCompetitionZongpingItem[];
  risks: AdminRiskItem[];
  generated_at: string;
}

export interface LLMTraceRead {
  provider?: string | null;
  model?: string | null;
  base_url_host?: string | null;
  requested: boolean;
  status: string;
  fallback_used: boolean;
  error_type?: string | null;
  latency_ms: number;
}

export interface AdminRagHealthSummary {
  total_sources?: number;
  total_answer_records?: number;
  no_citation_answers?: number;
  pending_sources?: number;
  reindex_job_count?: number;
  latest_pass_rate?: number;
  llm_provider?: string;
  llm_model?: string;
  llm_trace_record_count?: number;
  llm_requested_count?: number;
  llm_success_count?: number;
  llm_failed_count?: number;
  llm_fallback_count?: number;
  llm_disabled_count?: number;
  markdownflow_lesson_count?: number;
  markdownflow_question_count?: number;
  markdownflow_low_quality_count?: number;
  markdownflow_llm_failed_count?: number;
  markdownflow_fallback_count?: number;
  markdownflow_skipped_no_key_count?: number;
  markdownflow_open_review_task_count?: number;
  markdownflow_question_risk_count?: number;
  [key: string]: unknown;
}

export interface AdminRagHealthAnswerRiskRow {
  record_id: string | number;
  query?: string | null;
  feature_name?: string | null;
  citations?: string | number | null;
  evidence_score?: number | null;
  risk_level?: string | null;
  llm_trace?: LLMTraceRead;
  [key: string]: unknown;
}

export interface AdminMarkdownFlowQuestionRiskRow {
  lesson_id: string;
  lesson_title?: string | null;
  class_id?: string | null;
  term_id?: string | null;
  project_id?: string | null;
  draft_id?: string | null;
  content_hash?: string | null;
  question_id: string;
  knowledge_point_id?: string | null;
  pattern_id?: string | null;
  pattern_type?: string | null;
  quality_score: number;
  quality_grade: string;
  evidence_strength: string;
  frequency_score: number;
  review_status: string;
  error_type?: string | null;
  fallback_used: boolean;
  task_id?: string | null;
  task_status?: string | null;
  assignee_user_ids?: string[];
  latest_review_note?: string | null;
  latest_review_actor?: string | null;
  latest_review_at?: string | null;
  latest_review_action?: string | null;
  latest_review_template_id?: string | null;
  action_url?: string | null;
  imported_at?: string | null;
  [key: string]: unknown;
}

export interface AdminRagHealthResponse {
  scope: AdminScopeRead;
  summary: AdminRagHealthSummary;
  latest_evaluation: Record<string, unknown> | null;
  recent_evaluations: Record<string, unknown>[];
  answer_risk_rows: AdminRagHealthAnswerRiskRow[];
  markdownflow_question_health: Record<string, unknown>;
  markdownflow_question_rows: AdminMarkdownFlowQuestionRiskRow[];
  source_health: Record<string, unknown>;
  reindex_jobs: Record<string, unknown>[];
  risk_queue: AdminRiskItem[];
  recommended_actions: string[];
  generated_at: string;
}

export interface AdminOperationalRiskBulkStatusPayload {
  risk_ids: string[];
  status: "confirmed" | "ignored" | "reopened" | string;
  note?: string | null;
}

export interface AdminOperationalRiskBulkAssignPayload {
  risk_ids: string[];
  owner_user_id: string;
  owner_role?: string | null;
  note?: string | null;
}

export interface AdminOperationalRiskBulkResponse {
  status: string;
  updated_count: number;
  skipped_count: number;
  updated_risk_ids: string[];
  skipped_risk_ids: string[];
  audit_id: string;
}

export interface MarkdownFlowReviewBulkStatusPayload {
  task_ids: string[];
  status: "completed" | "dismissed" | string;
  note_template_id?: string | null;
  note?: string | null;
  actor?: string | null;
}

export interface MarkdownFlowReviewBulkStatusResponse {
  status: string;
  updated_count: number;
  skipped_count: number;
  updated_task_ids: string[];
  skipped_task_ids: string[];
}

export interface MarkdownFlowReviewNoteTemplate {
  template_id: string;
  label: string;
  action: string;
  reason: string;
  note: string;
}

export interface MarkdownFlowReviewAssigneeOption {
  user_id: string;
  display_name: string;
  role: string;
}

export interface MarkdownFlowReviewOptionsResponse {
  note_templates: MarkdownFlowReviewNoteTemplate[];
  assignees: MarkdownFlowReviewAssigneeOption[];
  export_formats: string[];
}

export interface MarkdownFlowReviewBulkAssignPayload {
  task_ids: string[];
  assignee_user_ids: string[];
  note_template_id?: string | null;
  note?: string | null;
  actor?: string | null;
}

export interface MarkdownFlowReviewBulkAssignResponse {
  assigned_count: number;
  skipped_count: number;
  assigned_task_ids: string[];
  skipped_task_ids: string[];
  assignee_user_ids: string[];
}

export interface MarkdownFlowReviewExportPayload {
  format?: "csv" | "json" | string;
  task_ids?: string[];
  class_id?: string | null;
  term_id?: string | null;
  task_status?: string | null;
  pattern_type?: string | null;
  knowledge_point_id?: string | null;
  error_type?: string | null;
  limit?: number;
}

export interface AdminRagHealthEvaluateResponse {
  evaluation_run: Record<string, unknown>;
  audit_id: string;
  rag_health: AdminRagHealthResponse;
}

export interface AdminRagHealthReindexResponse {
  job_count: number;
  jobs: Record<string, unknown>[];
  audit_id: string;
  rag_health: AdminRagHealthResponse;
}

export interface AdminCampusListResponse {
  scope: AdminScopeRead;
  summary: Record<string, unknown>;
  campuses: AdminCampusOperationProfile[];
  generated_at: string;
}

export interface AdminExportJob {
  job_id: string;
  report_type: string;
  status: string;
  format: string;
  actor_id: string;
  actor_role: string;
  scope_snapshot: Record<string, unknown>;
  file_url: string | null;
  download_url: string | null;
  is_expired: boolean;
  expires_in_seconds: number;
  error_message: string | null;
  created_at_text: string;
  started_at: string | null;
  completed_at: string | null;
  expired_at: string | null;
  audit_id: string | null;
  download_count: number;
  failed_download_count: number;
  last_downloaded_at: string | null;
  last_download_actor_id: string | null;
  last_download_status: string | null;
  created_at: string;
}

export interface AdminNotification {
  notification_id: string;
  recipient_user_id: string;
  category: string;
  title: string;
  body: string;
  status: string;
  priority: string;
  source_type: string;
  source_id: string;
  action_url: string | null;
  dedupe_key: string;
  payload: Record<string, unknown>;
  generated_by: string;
  generated_at_text: string;
  created_at: string;
}

export interface AdminNotificationStatusPayload {
  status: "pending" | "read" | "completed" | "closed" | string;
  note?: string | null;
}

export interface AdminNotificationStatusResponse {
  audit_id: string;
  notification: AdminNotification;
}

export interface AdminNotificationBulkClosePayload {
  notification_ids: string[];
  note?: string | null;
}

export interface AdminNotificationBulkCloseResponse {
  status: string;
  updated_count: number;
  skipped_count: number;
  updated_notification_ids: string[];
  skipped_notification_ids: string[];
  audit_id: string;
}

export interface AdminNotificationStatsResponse {
  scope: AdminScopeRead;
  filters: Record<string, unknown>;
  summary: Record<string, unknown>;
  by_recipient: Record<string, unknown>[];
  by_risk_type: Record<string, unknown>[];
  by_risk_family: Record<string, unknown>[];
  by_status: Record<string, unknown>[];
  by_priority: Record<string, unknown>[];
  daily_trend: Record<string, unknown>[];
  risk_type_trend: Record<string, unknown>[];
  risk_family_trend: Record<string, unknown>[];
  priority_trend: Record<string, unknown>[];
  dispatch_summary: Record<string, unknown>;
  dispatch_channels: Record<string, unknown>[];
  dispatch_daily_trend: Record<string, unknown>[];
  provider_failure_codes: Record<string, unknown>[];
  provider_failure_code_trend: Record<string, unknown>[];
  generated_at: string;
}

export interface AdminNotificationsListResponse {
  scope: AdminScopeRead;
  items: AdminNotification[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
  filters: Record<string, unknown>;
  stats: Record<string, unknown>;
  generated_at: string;
}

export interface AdminNotificationDispatchDryRunPayload {
  notification_ids: string[];
  channels: string[];
}

export interface AdminNotificationDispatchDryRunResponse {
  dry_run: boolean;
  planned_count: number;
  skipped_count: number;
  channel_results: Record<string, unknown>[];
  skipped_notification_ids: string[];
  audit_id: string;
}

export interface AdminNotificationDispatchPolicyPayload {
  real_send_enabled: boolean;
  require_approval: boolean;
  approval_expires_hours: number;
  email_enabled: boolean;
  wecom_enabled: boolean;
  email_provider_mode?: string | null;
  wecom_provider_mode?: string | null;
}

export interface AdminNotificationDispatchPolicyResponse {
  scope: AdminScopeRead;
  policy: Record<string, unknown>;
  generated_at: string;
}

export interface AdminNotificationProviderProbePayload {
  channel: string;
  provider_mode?: string | null;
  release_batch_id?: string | null;
  note?: string | null;
}

export interface AdminNotificationProviderProbeResponse {
  status: string;
  channel: string;
  provider_mode: string;
  configured: boolean;
  success: boolean;
  provider_message_id?: string | null;
  provider_status?: string | null;
  failure_code?: string | null;
  failure_reason?: string | null;
  retryable: boolean;
  provider_response: Record<string, unknown>;
  release_batch_id?: string | null;
  gray_scope: Record<string, unknown>;
  policy: Record<string, unknown>;
  audit_id: string;
  generated_at: string;
}

export interface AdminNotificationProviderReleaseBatch {
  release_batch_id: string;
  channel: string;
  target_provider_mode: string;
  status: string;
  requested_by: string;
  requested_by_role: string;
  requested_at_text: string;
  reviewed_by?: string | null;
  reviewed_by_role?: string | null;
  reviewed_at_text?: string | null;
  before_policy: Record<string, unknown>;
  target_policy: Record<string, unknown>;
  gray_scope: Record<string, unknown>;
  probe_audit_id?: string | null;
  apply_audit_id?: string | null;
  rollback_audit_id?: string | null;
  failure_code_snapshot: Record<string, unknown>;
  note?: string | null;
  decision_note?: string | null;
  created_at_text?: string | null;
  updated_at_text?: string | null;
}

export interface AdminNotificationProviderReleaseBatchPayload {
  channel: string;
  provider_mode: string;
  campus_ids?: string[];
  gray_percentage?: number;
  note?: string | null;
}

export interface AdminNotificationProviderReleaseBatchActionPayload {
  note?: string | null;
}

export interface AdminNotificationProviderReleaseBatchResponse {
  status: string;
  release_batch: AdminNotificationProviderReleaseBatch;
  policy: Record<string, unknown>;
  audit_id: string;
  generated_at: string;
}

export interface AdminNotificationProviderReleaseAuditResponse {
  scope: AdminScopeRead;
  filters: Record<string, unknown>;
  policy: Record<string, unknown>;
  release_batches: AdminNotificationProviderReleaseBatch[];
  timeline: Record<string, unknown>[];
  gray_scope_stats: Record<string, unknown>[];
  webhook_anomaly_alerts: Record<string, unknown>[];
  provider_failure_codes: Record<string, unknown>[];
  provider_failure_code_trend: Record<string, unknown>[];
  recent_policy_audits: Record<string, unknown>[];
  export_summary: Record<string, unknown>;
  export_jobs: AdminExportJob[];
  export_cleanup_risks: Record<string, unknown>[];
  preview_export_summary: Record<string, unknown>;
  preview_export_jobs: AdminExportJob[];
  preview_export_cleanup_risks: Record<string, unknown>[];
  preview_export_cleanup_receipts: Record<string, unknown>;
  generated_at: string;
}

export interface AdminNotificationProviderWebhookAlertStatusPayload {
  status: "confirmed" | "ignored" | "reopened" | "closed" | string;
  note?: string | null;
}

export interface AdminNotificationProviderWebhookAlertStatusResponse {
  audit_id: string;
  alert: Record<string, unknown>;
  notification_result: Record<string, unknown>;
  generated_at: string;
}

export interface AdminNotificationProviderReleaseExportCleanupActionPayload {
  action: "cleanup" | "reexport_json" | "reexport_csv" | "cleanup_and_reexport_json" | "cleanup_and_reexport_csv" | string;
  format?: "json" | "csv" | string | null;
  note?: string | null;
}

export interface AdminNotificationProviderReleaseExportCleanupActionResponse {
  status: string;
  action: string;
  cleanup_result: Record<string, unknown>;
  export_job?: AdminExportJob | null;
  cleanup_audit_id?: string | null;
  export_audit_id?: string | null;
  receipt_audit_id?: string | null;
  receipts?: Record<string, unknown>;
  generated_at: string;
}

export interface AdminNotificationDispatchApprovalPayload {
  notification_ids: string[];
  channels: string[];
  note?: string | null;
}

export interface AdminNotificationDispatchSendPayload {
  notification_ids: string[];
  channels: string[];
  approval_id?: string | null;
  simulate_failed_channels?: string[];
  note?: string | null;
}

export interface AdminNotificationDispatchAuditResponse {
  status: string;
  dry_run: boolean;
  approval_id: string | null;
  planned_count: number;
  attempted_count: number;
  delivered_count: number;
  failed_count: number;
  skipped_count: number;
  queued_count: number;
  retry_scheduled_count: number;
  dead_letter_count: number;
  outbox_ids: string[];
  channel_results: Record<string, unknown>[];
  skipped_notification_ids: string[];
  audit_id: string;
  policy: Record<string, unknown>;
}

export interface AdminNotificationOutbox {
  outbox_id: string;
  notification_id: string;
  recipient_user_id: string;
  channel: string;
  status: string;
  attempt_count: number;
  max_attempts: number;
  next_attempt_at_text: string;
  last_attempt_at_text: string | null;
  approval_id: string | null;
  provider_message_id: string | null;
  failure_reason: string | null;
  created_by: string;
  created_at_text: string;
  event_at_text: string | null;
  receipt: Record<string, unknown>;
  notification: Record<string, unknown>;
}

export interface AdminNotificationOutboxListResponse {
  scope: AdminScopeRead;
  items: AdminNotificationOutbox[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
  filters: Record<string, unknown>;
  stats: Record<string, unknown>;
  generated_at: string;
}

export interface AdminNotificationOutboxReplayApprovalPayload {
  outbox_ids: string[];
  note?: string | null;
}

export interface AdminNotificationOutboxReplayApprovalResponse {
  status: string;
  approval_id: string;
  planned_count: number;
  skipped_count: number;
  outbox_ids: string[];
  skipped_outbox_ids: string[];
  audit_id: string;
  expires_at: string;
}

export interface AdminNotificationOutboxReplayRevokePayload {
  approval_id: string;
  note?: string | null;
}

export interface AdminNotificationOutboxReplayRevokeResponse {
  status: string;
  approval_id: string;
  audit_id: string;
  revoked_at: string;
}

export interface AdminNotificationOutboxReplayExecutePayload {
  outbox_ids: string[];
  approval_id?: string | null;
  note?: string | null;
}

export interface AdminNotificationOutboxReplayExecuteResponse extends AdminNotificationDispatchAuditResponse {
  requeued_count: number;
  skipped_outbox_ids: string[];
  blocked_reason?: string | null;
}

export interface AdminReportsResponse {
  scope: AdminScopeRead;
  summary: Record<string, unknown>;
  report_types: Record<string, unknown>[];
  jobs: AdminExportJob[];
  markdownflow_review_ops: Record<string, unknown>;
  answer_audit_ops: AnswerAuditExportAuditTrailResponse;
  operational_risk_subscriptions: Record<string, unknown>;
  operational_risk_subscription_preview: Record<string, unknown>[];
  operational_risk_notifications: AdminNotification[];
  operational_risk_notification_stats: Record<string, unknown>;
  audit_logs: Record<string, unknown>[];
  generated_at: string;
}

export interface AdminSettingsResponse {
  scope: AdminScopeRead;
  settings: Record<string, unknown>;
  role_matrix: Record<string, unknown>[];
  generated_at: string;
}

export interface AdminSettingAuditTrailItem {
  audit_id: string;
  action: string;
  actor_id: string;
  actor_role: string;
  created_at_text: string;
  before_summary: Record<string, unknown>;
  after_summary: Record<string, unknown>;
  can_rollback: boolean;
  source_audit_id?: string | null;
  note_present: boolean;
  migration_summary: Record<string, unknown>;
}

export interface AdminSettingAuditTrailResponse {
  setting_key: string;
  items: AdminSettingAuditTrailItem[];
  generated_at: string;
}

export interface AdminSettingsRollbackRequest {
  setting_key: string;
  audit_id: string;
  note?: string | null;
  confirmation_text?: string | null;
}

export interface AdminSettingsRollbackRequestRead {
  request_id: string;
  setting_key: string;
  source_audit_id: string;
  status: string;
  severity?: string;
  sla_status?: string;
  sla_label?: string;
  sla_age_hours?: number;
  sla_overdue_hours?: number;
  sla_due_at_text?: string | null;
  sla_escalate_at_text?: string | null;
  requester_id: string;
  requester_role: string;
  approver_id?: string | null;
  approver_role?: string | null;
  created_at_text: string;
  decided_at_text?: string | null;
  current_summary: Record<string, unknown>;
  target_summary: Record<string, unknown>;
  can_approve: boolean;
  note_present: boolean;
}

export interface AdminSettingsRollbackRequestsResponse {
  setting_key?: string | null;
  status?: string | null;
  trend_granularity?: string;
  summary: Record<string, unknown>;
  by_status: Record<string, unknown>[];
  by_sla: Record<string, unknown>[];
  by_setting_key: Record<string, unknown>[];
  daily_trend: Record<string, unknown>[];
  sla_daily_trend: Record<string, unknown>[];
  reminder_trend: Record<string, unknown>[];
  export_boundary: Record<string, unknown>;
  items: AdminSettingsRollbackRequestRead[];
  generated_at: string;
}

export interface AdminSettingsRollbackRequestResponse {
  request: AdminSettingsRollbackRequestRead;
  generated_at: string;
}

export interface AdminSettingsRollbackReminderGenerateResponse {
  generated_count: number;
  skipped_count: number;
  notification_ids: string[];
  audit_id: string;
  sla_summary: Record<string, unknown>;
  notifications: AdminNotification[];
}

export interface AdminSettingsRollbackDecisionRequest {
  decision: string;
  note?: string | null;
  confirmation_text?: string | null;
}

export interface AdminSettingsRollbackDecisionResponse extends AdminSettingsResponse {
  request: AdminSettingsRollbackRequestRead;
}

export interface AdminProviderReleaseAuditViewsMigrationPackage {
  schema_version: string;
  setting_key: string;
  exported_at: string;
  exported_by: string;
  summary: Record<string, unknown>;
  views: Record<string, unknown>[];
}

export interface AdminProviderReleaseAuditViewsImportRequest {
  payload: Record<string, unknown>;
  mode?: string;
  note?: string | null;
}

export interface AdminProviderReleaseAuditViewsImportPreviewExportRequest extends AdminProviderReleaseAuditViewsImportRequest {
  format: string;
}

export interface AdminProviderReleaseAuditViewsImportPreviewResponse {
  schema_version: string;
  setting_key: string;
  mode: string;
  summary: Record<string, unknown>;
  diffs: Record<string, unknown>[];
  warnings: Record<string, unknown>[];
  export_boundary: Record<string, unknown>;
  can_import: boolean;
  audit_id?: string | null;
  generated_at: string;
}

export interface AdminProviderReleaseAuditViewsImportResponse extends AdminSettingsResponse {
  imported_count: number;
  skipped_count: number;
  mode: string;
}

export interface XiaomaiCampusRead {
  campus_external_id: string;
  campus_name: string;
  admin_external_id?: string | null;
  admin_name?: string | null;
  teacher_external_id?: string | null;
  public_resource_area_status: string;
  status_message?: string | null;
}

export interface XiaomaiAccountTestRequest {
  login_account: string;
  password: string;
  persist?: boolean;
  check_public_resource_area?: boolean;
}

export interface XiaomaiAccountTestResponse {
  success: boolean;
  message: string;
  login_account_masked: string;
  user_type?: string | null;
  user_id?: string | null;
  campus_count: number;
  campuses: XiaomaiCampusRead[];
  diagnostics: string[];
}

export interface XiaomaiEmbedConfigResponse {
  embed_url: string;
  fallback_url: string;
  can_try_iframe: boolean;
  notes: string[];
}

export interface XiaomaiIntegrationStatusResponse {
  phase: string;
  status: string;
  embed_url: string;
  gateway_base_url: string;
  persisted_accounts_enabled: boolean;
  capabilities: string[];
  limitations: string[];
}

export interface XiaomaiAccountRead {
  account_id: string;
  display_name: string;
  login_account_masked: string;
  status: string;
  last_login_at?: string | null;
  last_error?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface XiaomaiCampusContextRead {
  context_id: string;
  account_id: string;
  campus_external_id: string;
  campus_name: string;
  admin_external_id?: string | null;
  admin_name?: string | null;
  teacher_external_id?: string | null;
  public_resource_area_status: string;
  raw_payload: Record<string, unknown>;
  last_checked_at: string;
}

export interface XiaomaiSyncJobRequest {
  account_id?: string | null;
  login_account?: string | null;
  password?: string | null;
  campus_external_id?: string | null;
  modules: string[];
  mode?: string;
  range?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface XiaomaiSyncJobItemRead {
  item_id: string;
  job_id: string;
  entity_type: string;
  external_id?: string | null;
  local_id?: string | null;
  action: string;
  status: string;
  message: string;
  diff: Record<string, unknown>;
  raw_object_id?: string | null;
  created_at: string;
}

export interface XiaomaiSyncJobRead {
  job_id: string;
  account_id: string;
  campus_external_id?: string | null;
  modules: string[];
  mode: string;
  status: string;
  summary: Record<string, unknown>;
  range: Record<string, unknown>;
  options: Record<string, unknown>;
  queued_at?: string | null;
  heartbeat_at?: string | null;
  retry_count: number;
  max_retries: number;
  next_retry_at?: string | null;
  retry_of_job_id?: string | null;
  incremental_cursor: Record<string, unknown>;
  change_probe: Record<string, unknown>;
  report_generated_at?: string | null;
  sensitive_policy: Record<string, unknown>;
  started_at?: string | null;
  finished_at?: string | null;
  created_by?: string | null;
  error_message?: string | null;
}

export interface XiaomaiSyncJobResponse {
  job: XiaomaiSyncJobRead;
  items: XiaomaiSyncJobItemRead[];
  campuses: XiaomaiCampusContextRead[];
  warnings: string[];
}

export interface XiaomaiResourceDownloadResponse {
  source_id: string;
  file_path: string;
  file_size_bytes: number;
  ingestion_status: string;
  message: string;
}

export interface XiaomaiConnectorModuleHealthRead {
  module: string;
  status: string;
  last_job_id?: string | null;
  checked_at: string;
  total: number;
  failed: number;
  skipped: number;
  warnings: string[];
}

export interface XiaomaiConnectorHealthResponse {
  status: string;
  checked_at: string;
  probe_count: number;
  failed_count: number;
  warnings: string[];
  module_results: XiaomaiConnectorModuleHealthRead[];
  security: Record<string, unknown>;
  change_probe: Record<string, unknown>;
}

export interface XiaomaiSyncReportResponse {
  job: XiaomaiSyncJobRead;
  summary: Record<string, unknown>;
  quality: Record<string, unknown>;
  items: XiaomaiSyncJobItemRead[];
  exported_at: string;
  csv: string;
}

export interface XiaomaiAcceptanceMetricRead {
  key: string;
  label: string;
  value?: number | string | boolean | null;
  threshold?: number | null;
  status: string;
  message: string;
}

export interface XiaomaiAcceptanceResponse {
  status: string;
  generated_at: string;
  baseline_job_id?: string | null;
  baseline_mode?: string | null;
  baseline_finished_at?: string | null;
  metrics: XiaomaiAcceptanceMetricRead[];
  next_actions: string[];
  blockers: string[];
}

export interface XiaomaiQuestionBankItemRead {
  question_id: string;
  external_question_id: string;
  campus_external_id?: string | null;
  title: string;
  question_type: string;
  subject: string;
  difficulty: number;
  knowledge_tags: string[];
  project_tags: string[];
  options: Record<string, unknown>[];
  answer?: string | null;
  analysis?: string | null;
  source_paper_ids: string[];
  classification_status: string;
  ai_usable: boolean;
  created_at: string;
  updated_at: string;
}

export interface XiaomaiPaperRead {
  paper_id: string;
  external_paper_id: string;
  campus_external_id?: string | null;
  title: string;
  paper_type: string;
  subject: string;
  question_ids: string[];
  question_count: number;
  total_score: number;
  structure: Record<string, unknown>;
  classification_status: string;
  ai_usable: boolean;
  created_at: string;
  updated_at: string;
}

export interface KnowledgePoint {
  id: string;
  name: string;
  system: string;
  level: string | null;
  domain: string;
  type: string;
  summary: string | null;
  description: string;
  difficulty: number;
  bloom_level: string;
  age_band: string;
  knowledge_origin: string;
  growth_stage: string | null;
  growth_tree_node: string | null;
  cognitive_alignment: string | null;
  display_icon: string | null;
  display_tags: string[];
  why_it_matters: string | null;
  parent_explanation: string | null;
  teacher_explanation: string | null;
  classroom_explanation: string | null;
  common_misconceptions: string[];
  teaching_suggestions: string[];
  example_activities: string[];
  assessment_questions: string[];
  child_can_do: string[];
  used_in_projects: string[];
  related_exams: string[];
  related_competitions: string[];
  next_learning_points: string[];
  importance_score: number;
  importance_level: "high" | "medium" | "low" | string;
  importance_tags: string[];
  importance_reason: string | null;
  prerequisites: string[];
  successors: string[];
  cross_ref: Record<string, unknown>;
  exam_weight: string | null;
  exam_alignment_type: string;
  exam_alignment_note: string | null;
  project_tags: string[];
  source_ids: string[];
  source_status: string;
  zongping_dimension?: string | null;
  zongping_value?: string | null;
  zongping_expression?: string | null;
  visible_to_parent: boolean;
  show_id_by_default: boolean;
}

export interface CompetitionPoint {
  cmp_id: string;
  name: string | null;
  competition_code: string;
  competition_name: string;
  track: string | null;
  domain: string;
  ability_type: string;
  summary: string | null;
  difficulty: number;
  age_band: string;
  growth_tree_node: string | null;
  scoring_dimension: string | null;
  deliverables: string[];
  related_kp_ids: string[];
  source_ids: string[];
  project_fit_tags: string[];
  display_tags: string[];
  competition_entry_template?: string;
  award_record_template?: string;
  typical_case_template?: string;
  required_certificate?: boolean;
  why_it_matters: string | null;
  visible_to_parent: boolean;
  show_id_by_default: boolean;
  source_status: string;
  description: string | null;
}

export interface Project {
  project_id: string;
  project_set_id: string;
  variant: string;
  project_name: string;
  maturity_level: "P0" | "P1" | "P2" | "P3" | "P4" | string;
  scenario_type: string;
  scenario_summary: string;
  project_summary: string | null;
  age_band: string;
  age_range: string;
  duration_hours: number;
  difficulty_range: string;
  course_series: string;
  course_track: string[];
  project_tags: string[];
  primary_kit: string | null;
  secondary_kit: string | null;
  kit_stack: string[];
  programming_mode: string | null;
  ai_integration_type: string | null;
  target_exams: string[];
  target_competitions: string[];
  recommended_exams: string[];
  recommended_competitions: string[];
  core_kp_ids: string[];
  core_aicomp_kp_ids: string[];
  related_traditional_kp_ids: string[];
  core_cmp_ids: string[];
  competency_ids: string[];
  pre_exam_foundation_for: string[];
  future_exam_path: string[];
  exam_alignment_type: string;
  exam_alignment_note: string | null;
  competition_alignment_type: string;
  competition_alignment_note: string | null;
  display_exam_tags: string[];
  display_competition_tags: string[];
  alignment_quality_status: string;
  alignment_generated_by: string;
  hardware_stack: string[];
  software_stack: string[];
  project_outputs: string[];
  weekly_plan: Array<Record<string, unknown>>;
  assessment_rubric: Array<Record<string, unknown>>;
  feasibility_check: string[];
  safety_check: string[];
  competition_fit_score: number;
  portfolio_value_score: number;
  upgrade_path: string[];
  parent_value: string | null;
  teacher_notes: string | null;
  cognitive_load_check: string[];
  anti_ai_overreliance_design: string | null;
  teacher_guidance_script: string[];
  kit_preparation_checklist: string[];
  icon_programming_goals: string[];
  ai_kit_boundaries: string[];
  age_risk: string[];
  parent_feedback_talk: string | null;
  lesson_plan_template: Record<string, unknown>;
  parent_report_template: Record<string, unknown>;
  common_risks: string[];
  downgrade_options: string[];
  upgrade_options: string[];
  competition_packaging_angles: string[];
  zongping_mapping_tags?: string[];
  zongping_notes?: string | null;
  next_project_ids: string[];
  sibling_project_id: string | null;
  risk_tips: string[];
  package_id: string | null;
  plugin_version: string;
  plugin_status: string;
  lifecycle_stage: string;
  replaces_project_id: string | null;
  replaced_by_project_id: string | null;
  rag_indexable: boolean;
  recommendable: boolean;
  deprecated: boolean;
  project_maturity_level?: string | null;
  knowledge_point_ids?: string[];
  ai_competency_ids?: string[];
  ai_capabilities?: string[];
  capability_axes?: string[];
  knowledge_systems?: string[];
  knowledge_origins?: string[];
  knowledge_domains?: string[];
  growth_tree_nodes?: string[];
  bloom_levels?: string[];
  learning_goals?: string[];
  evidence_outputs?: string[];
  deliverables?: string[];
  zongping_categories?: string[];
  competition_categories?: string[];
  teacher_levels?: string[];
  implementation_requirements?: string[];
  data_quality_warnings?: string[];
  visibility?: string;
}

export interface ProjectFacetOption {
  value: string;
  label: string;
  count: number;
}

export interface ProjectFacets {
  age_band: ProjectFacetOption[];
  course_track: ProjectFacetOption[];
  learning_goal: ProjectFacetOption[];
  maturity_level: ProjectFacetOption[];
  target_exams: ProjectFacetOption[];
  target_competitions: ProjectFacetOption[];
  hardware: ProjectFacetOption[];
  software: ProjectFacetOption[];
  deliverables: ProjectFacetOption[];
  zongping_categories: ProjectFacetOption[];
  knowledge_systems: ProjectFacetOption[];
  knowledge_origins: ProjectFacetOption[];
  growth_tree_nodes: ProjectFacetOption[];
  knowledge_domains: ProjectFacetOption[];
  bloom_levels: ProjectFacetOption[];
  ai_capabilities: ProjectFacetOption[];
  capability_axes: ProjectFacetOption[];
  project_statuses: ProjectFacetOption[];
  teacher_levels: ProjectFacetOption[];
  implementation_requirements: ProjectFacetOption[];
}

export interface ProjectCoverageSummary {
  project_count: number;
  knowledge_point_count: number;
  exam_path_count: number;
  competition_path_count: number;
  zongping_ready_count: number;
  deliverable_ready_count: number;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  facets: ProjectFacets;
  coverage_summary: ProjectCoverageSummary;
}

export interface ProjectFacetResponse {
  age_bands: ProjectFacetOption[];
  course_tracks: ProjectFacetOption[];
  learning_goals: ProjectFacetOption[];
  maturity_levels: ProjectFacetOption[];
  hardware_options: ProjectFacetOption[];
  software_options: ProjectFacetOption[];
  exam_options: ProjectFacetOption[];
  competition_options: ProjectFacetOption[];
  zongping_options: ProjectFacetOption[];
  ai_capability_options: ProjectFacetOption[];
  knowledge_system_options: ProjectFacetOption[];
  knowledge_origin_options: ProjectFacetOption[];
  growth_tree_node_options: ProjectFacetOption[];
  knowledge_domain_options: ProjectFacetOption[];
  bloom_level_options: ProjectFacetOption[];
  capability_axis_options: ProjectFacetOption[];
  deliverable_options: ProjectFacetOption[];
  project_status_options: ProjectFacetOption[];
  teacher_level_options: ProjectFacetOption[];
  implementation_requirement_options: ProjectFacetOption[];
}

export interface ProjectPluginFile {
  file_id: string;
  package_id: string;
  file_type: string;
  file_path: string;
  file_name: string;
  checksum: string;
  parsed_status: string;
  validation_status: string;
}

export interface ProjectValidationResult {
  validation_id: string;
  package_id: string;
  project_id: string;
  validation_type: string;
  passed: boolean;
  severity: string;
  message: string;
  details_json: Record<string, unknown>;
  created_at: string;
}

export interface ProjectVersion {
  version_id: string;
  project_id: string;
  package_id: string;
  version: string;
  semantic_version_major: number;
  semantic_version_minor: number;
  semantic_version_patch: number;
  change_log: string | null;
  breaking_change: boolean;
  previous_version_id: string | null;
  created_at: string;
}

export interface ProjectRAGIndexJob {
  job_id: string;
  project_id: string;
  version: string;
  package_id: string;
  action: string;
  status: string;
  chunk_count: number;
  embedding_status: string;
  chunks_json: Array<Record<string, unknown>>;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export type EventGraphTargetUse = "classroom" | "parent_showcase" | "competition" | "portfolio" | "zongping";
export type EventGraphGenerationMode = "reuse_existing" | "variant" | "new_package";
export type EventGraphSlotType = "pre_remediation" | "synchronous_carrier" | "extension_challenge" | "review_repair" | "competition_packaging" | "zongping_portfolio";

export interface EventGraphIdeaRequest {
  idea_text: string;
  age?: number;
  age_band?: string;
  current_project_id?: string;
  known_knowledge_point_ids?: string[];
  available_hardware?: string[];
  duration_hours?: number;
  target_use?: EventGraphTargetUse;
  teacher_constraints?: string[];
}

export interface EventGraphStageDecision {
  age_band: string;
  slot_type: EventGraphSlotType | string;
  confidence: number;
  reason: string;
}

export interface EventGraphKnowledgeChain {
  before: string[];
  core: string[];
  after: string[];
}

export interface EventGraphInsertionSlot {
  slot_type: EventGraphSlotType | string;
  position: string;
  anchor_project_keywords: string[];
  score: number;
  reason: string;
}

export interface EventGraphGenerationRecommendation {
  mode: EventGraphGenerationMode | string;
  reason: string;
  required_review: string[];
}

export interface EventGraphPositioningResponse {
  stage_decision: EventGraphStageDecision;
  knowledge_chain: EventGraphKnowledgeChain;
  insertion_slots: EventGraphInsertionSlot[];
  candidate_existing_project_keywords: string[];
  generation_recommendation: EventGraphGenerationRecommendation;
  risk_flags: string[];
}

export interface EventGraphGeneratedProjectDraft {
  draft_id: string;
  idea_id: string;
  package_id: string;
  project_id: string;
  title: string;
  age_band: string;
  slot_type: string;
  generation_mode: string;
  status: "draft";
  lifecycle_stage: "draft";
  package_dir: string;
  manifest_path: string;
  export_manifest_path: string;
  request_json: Record<string, unknown>;
  positioning_json: Record<string, unknown>;
  draft_payload_json: Record<string, unknown>;
  validation_summary_json: Record<string, unknown>;
  export_paths_json: Record<string, unknown>;
  created_by: string;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventGraphTeacherIdeaSubmissionPayload {
  idea: EventGraphIdeaRequest;
  idea_id?: string;
  draft_title?: string;
  teacher_notes?: string[];
  teacher_id?: string;
  teacher_confirmation_reason?: string;
  overwrite_export?: boolean;
}

export type EventGraphReviewStage = "teacher_confirmation" | "system_validation" | "teaching_research_review";

export interface EventGraphReviewRecord {
  review_id: string;
  draft_id: string;
  package_id: string;
  project_id: string;
  reviewer_id: string;
  reviewer_role: string;
  review_stage: EventGraphReviewStage | string;
  decision: string;
  decision_reason: string;
  required_changes: string[];
  graph_changes_json: Record<string, unknown>;
  status_flow_json: string[];
  draft_status_before: string;
  draft_status_after: string;
  created_at: string;
}

export interface EventGraphPackageValidationResult {
  validation_id: string;
  validation_type: string;
  passed: boolean;
  severity: string;
  message: string;
  details_json: Record<string, unknown>;
}

export interface EventGraphProjectPackageReviewPayload {
  actor?: string;
  submit_for_review?: boolean;
}

export interface EventGraphProjectPackageReviewResponse {
  draft_id: string;
  package_id: string;
  project_id: string;
  package_status: string;
  lifecycle_stage: string;
  validation_summary: Record<string, unknown>;
  validation_results: EventGraphPackageValidationResult[];
  submitted_for_review: boolean;
  review_gate: Record<string, unknown>;
  rag_job_count: number;
}

export interface EventGraphTeacherIdeaSubmissionResponse {
  draft: EventGraphGeneratedProjectDraft;
  teacher_confirmation: EventGraphReviewRecord;
  positioning: EventGraphPositioningResponse;
}

export interface ProjectPackage {
  package_id: string;
  project_id: string;
  project_name: string;
  name: string;
  version: string;
  status: string;
  lifecycle_stage: string;
  package_path: string;
  manifest_json: Record<string, unknown>;
  age_band: string;
  age_range: string;
  course_series: string;
  course_track: string[];
  project_tags: string[];
  hardware_stack: string[];
  software_stack: string[];
  target_exams: string[];
  target_competitions: string[];
  recommended_exams: string[];
  recommended_competitions: string[];
  pre_exam_foundation_for: string[];
  exam_alignment_type: string;
  exam_alignment_note: string | null;
  competition_alignment_type: string;
  competition_alignment_note: string | null;
  display_exam_tags: string[];
  display_competition_tags: string[];
  alignment_quality_status: string;
  alignment_generated_by: string;
  checksum: string;
  uploaded_by: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ProjectPackageDetail extends ProjectPackage {
  project: Project | null;
  files: ProjectPluginFile[];
  validation_results: ProjectValidationResult[];
  versions: ProjectVersion[];
  rag_index_jobs: ProjectRAGIndexJob[];
  validation_summary: {
    total: number;
    passed: number;
    failed_errors: number;
    warnings: number;
    can_activate: boolean;
  };
}

export interface KnowledgePointSummary {
  id: string;
  name: string;
  system: string;
  level: string | null;
  age_band?: string;
  domain: string;
  difficulty: number;
  summary: string | null;
  display_tags: string[];
  importance_score: number;
  importance_level: string;
  importance_tags: string[];
}

export interface KnowledgePointParentView {
  id: string;
  name: string;
  summary: string | null;
  why_it_matters: string | null;
  parent_explanation: string | null;
  child_can_do: string[];
  used_in_projects: Array<Record<string, unknown>>;
  related_exams: string[];
  related_competitions: string[];
  next_learning_points: KnowledgePointSummary[];
  importance_score: number;
  importance_level: string;
  importance_tags: string[];
  importance_reason: string | null;
  professional_evidence: Record<string, unknown>;
}

export interface KnowledgePointTeacherView {
  knowledge_point: KnowledgePoint;
  related_projects: Array<Record<string, unknown>>;
  related_competitions: Array<Record<string, unknown>>;
  evidence_summary: Record<string, unknown>;
}

export interface KnowledgeEvidence {
  evidence_id: string;
  knowledge_point_id: string;
  knowledge_point_name: string;
  evidence_type: string;
  source_system: string;
  source_name: string;
  year: number | null;
  level_or_track: string | null;
  occurrence_context: string | null;
  question_type: string | null;
  question_summary: string | null;
  scoring_point: string | null;
  application_context: string | null;
  related_project_ids: string[];
  related_competition_codes: string[];
  importance_level: number;
  frequency_score: number;
  evidence_strength: string;
  source_ids: string[];
  verified_status: string;
  visible_to_parent: boolean;
  teacher_note: string | null;
  parent_explanation: string | null;
}

export interface KnowledgeQuestionPattern {
  pattern_id: string;
  knowledge_point_id: string;
  pattern_name: string;
  pattern_type: string;
  difficulty: number;
  example_prompt: string;
  common_mistakes: string[];
  teaching_strategy: string;
  source_ids: string[];
}

export interface KnowledgeApplicationCase {
  case_id: string;
  knowledge_point_id: string;
  case_type: string;
  project_id: string | null;
  competition_code: string | null;
  case_title: string;
  case_summary: string;
  deliverables: string[];
  maturity_level: string;
  evidence_strength: string;
  source_ids: string[];
}

export interface HighFrequencyKnowledgePoint {
  knowledge_point_id: string;
  name: string;
  system: string;
  level: string | null;
  domain: string;
  age_band: string;
  exam_frequency_score: number;
  competition_frequency_score: number;
  project_usage_score: number;
  overall_importance_score: number;
  recommended_teaching_action: string;
}

export interface ProjectSet {
  project_set_id: string;
  level_code: string;
  age_band: string;
  age_range: string;
  duration_hours: number;
  weeks: number;
  knowledge_point_count: number;
  course_series: string;
  core_kp_ids: string[];
  core_cmp_ids: string[];
  target_exams: string[];
  target_competitions: string[];
  competency_ids: string[];
  pre_exam_foundation_for: string[];
  future_exam_path: string[];
  exam_alignment_type: string;
  exam_alignment_note: string | null;
  scenario_difference: string;
  recommended_selection_strategy: string;
  deprecated: boolean;
  projects: Project[];
}

export interface ProjectUpgradeAdviceRequest {
  project_id: string;
  target_use?: string;
  available_materials?: string[];
  student_stage?: string | null;
}

export interface ProjectMaturityLevelAdvice {
  level: string;
  label: string;
  description: string;
  status: string;
  required_evidence: string[];
}

export interface MissingMaterialAdvice {
  material_type: string;
  name: string;
  priority: string;
  required_for: string[];
  reason: string;
}

export interface UpgradeSuggestion {
  step: number;
  title: string;
  action: string;
  expected_output: string;
  priority: string;
}

export interface GeneratableMaterialAdvice {
  material_type: string;
  title: string;
  description: string;
  allowed: boolean;
  blocked_reason: string | null;
}

export interface CompetitionMaterialPolicy {
  direct_packaging_allowed: boolean;
  message: string;
  required_before_competition: string[];
}

export interface ProjectUpgradeAdviceResponse {
  project_id: string;
  project_name: string;
  target_use: string;
  declared_maturity: string;
  assessed_maturity: string;
  maturity_score: number;
  maturity_levels: ProjectMaturityLevelAdvice[];
  missing_materials: MissingMaterialAdvice[];
  upgrade_suggestions: UpgradeSuggestion[];
  supplementary_knowledge_points: KnowledgePointSummary[];
  generatable_materials: GeneratableMaterialAdvice[];
  risk_tips: string[];
  competition_material_policy: CompetitionMaterialPolicy;
}

export interface CompetitionMaterialsGenerateRequest {
  project_id: string;
  competition_code: string;
  student_id?: string | null;
  available_materials?: string[];
  generated_by?: string;
}

export interface CompetitionSubmissionDecision {
  label: string;
  required_action: string;
  can_generate_preparation_pack: boolean;
  can_submit_to_competition: boolean;
  reason: string;
}

export interface CompetitionMaterialChecklistItem {
  material_type: string;
  name: string;
  status: string;
  priority: string;
  reason: string;
}

export interface CompetitionGeneratedMaterial {
  material_type: string;
  title: string;
  content: string;
  allowed_use: string;
  requires_teacher_review: boolean;
}

export interface CompetitionBlockedOutput {
  material_type: string;
  title: string;
  reason: string;
}

export interface CompetitionMaterialCitation {
  source_id: string;
  title: string;
  source_type: string;
  publisher: string | null;
  year: number | null;
  reliability_level: string;
  review_status: string;
}

export interface CompetitionMaterialsGenerateResponse {
  project_id: string;
  project_name: string;
  competition_code: string;
  competition_name: string;
  supported_competitions: Array<Record<string, string>>;
  maturity_level: string;
  maturity_score: number;
  submission_decision: CompetitionSubmissionDecision;
  material_checklist: CompetitionMaterialChecklistItem[];
  generated_materials: CompetitionGeneratedMaterial[];
  blocked_outputs: CompetitionBlockedOutput[];
  related_knowledge_points: KnowledgePointSummary[];
  next_actions: string[];
  risk_warnings: string[];
  citations: CompetitionMaterialCitation[];
}

export interface StudentAssessment {
  age: number;
  grade: string;
  scratch_level: string;
  python_level: string;
  cpp_level: string;
  robot_level: string;
  competition_experience: string;
  goal_direction: string;
  weekly_hours: number;
  parent_expectation: string;
}

export interface RecommendationResult {
  assessment_id?: number;
  stage: string;
  ability_profile: Record<string, unknown>;
  recommended_path: Array<Record<string, unknown>>;
  recommended_exams: string[];
  recommended_competitions: string[];
  recommended_project_sets: string[];
  recommended_projects: string[];
  project_variant_options: Array<Record<string, unknown>>;
  six_month_plan: Array<Record<string, unknown>>;
  parent_explanation: string;
  missing_foundations: string[];
  uncertainty: string;
}

export type RagAnswerMode = "parent" | "teacher" | "admin_debug";

export interface RagDebugPayload {
  enabled: boolean;
  retrieved_chunks: Array<Record<string, unknown>>;
  rerank_scores: Array<Record<string, unknown>>;
  source_ids: string[];
  stage: string;
  query_understanding: Record<string, unknown>;
  local_hybrid_rag: Record<string, unknown>;
}

export interface RagResponse {
  summary?: string;
  answer: string;
  answer_mode?: RagAnswerMode;
  related_knowledge_points: string[];
  related_competition_points: string[];
  related_competitions?: Array<Record<string, unknown>>;
  recommended_projects: string[];
  recommended_project_cards?: Array<Record<string, unknown>>;
  key_knowledge_points?: Array<Record<string, unknown>>;
  next_steps?: string[];
  risk_notes?: string[];
  citations: Array<Record<string, unknown>>;
  uncertainty: string;
  query_understanding?: Record<string, unknown>;
  related_knowledge_details?: KnowledgePoint[];
  related_competition_details?: CompetitionPoint[];
  recommended_project_details?: Project[];
  retrieval_trace?: Array<Record<string, unknown>>;
  follow_up_questions?: string[];
  ingestion_hint?: Record<string, unknown>;
  debug?: RagDebugPayload;
}

export interface CompetencyNode {
  competency_id: string;
  name: string;
  description: string | null;
  growth_tree_node: string | null;
  age_band: string | null;
  age_progression: Array<Record<string, unknown>>;
  related_kp_ids: string[];
  related_cmp_ids: string[];
  related_project_ids: string[];
  source_ids: string[];
}

export interface GraphEdge {
  edge_id: string;
  source_id: string;
  source_type: string;
  target_id: string;
  target_type: string;
  relation_type: string;
  weight: number;
  confidence: number;
  evidence: string | null;
  source_ids: string[];
  edge_metadata: Record<string, unknown>;
}

export interface GraphNode {
  node_id: string;
  node_type: string;
  name: string;
  summary: string | null;
  age_band: string | null;
  metadata: Record<string, unknown>;
}

export interface GraphNeighborsResponse {
  root: GraphNode;
  neighbors: GraphNode[];
  edges: GraphEdge[];
  depth: number;
  direction: string;
  relation_counts: Record<string, number>;
  expansion_summary: Record<string, unknown>;
}

export interface KnowledgeProjectCoverageResponse {
  total_knowledge_points: number;
  covered_knowledge_points: number;
  uncovered_knowledge_points: number;
  coverage_ratio: number;
  total_projects: number;
  total_competition_points: number;
  covered_competition_points: number;
  competition_coverage_ratio: number;
  graph_edges: number;
  competency_nodes: number;
  by_age_band: Array<Record<string, unknown>>;
  by_growth_tree_node: Array<Record<string, unknown>>;
  project_rows: Array<Record<string, unknown>>;
  competition_rows: Array<Record<string, unknown>>;
  gap_knowledge_points: Array<Record<string, unknown>>;
}

export interface CoverageSummary {
  stage: string;
  total_knowledge_points: number;
  covered_knowledge_points: number;
  missing_knowledge_points: number;
  coverage_ratio: number;
  completed_projects: number;
  evidence_materials: number;
  high_risk_entries: number;
}

export interface KnowledgeDomainGap {
  domain: string;
  total: number;
  covered: number;
  missing: number;
  coverage_ratio: number;
}

export interface AbilityGap {
  ability_id: string;
  name: string;
  covered: number;
  total: number;
  coverage_ratio: number;
  priority: string;
  missing_knowledge_point_ids: string[];
}

export interface MaterialGap {
  source_id: string;
  source_title: string;
  missing_materials: string[];
  risk_level: string;
}

export interface ZongpingRiskItem {
  entry_id: string;
  title: string;
  risk_level: string;
  audit_status: string;
  warnings: string[];
}

export interface StudentGapDiagnosisRequest {
  student_id: string;
  target_stage?: string | null;
  goal_direction?: string;
  include_next_stage?: boolean;
}

export interface StudentGapDiagnosisResponse {
  student: ZongpingStudentProfile;
  current_stage: Record<string, unknown>;
  target_stage: string;
  coverage_summary: CoverageSummary;
  domain_gaps: KnowledgeDomainGap[];
  missing_knowledge_points: KnowledgePointSummary[];
  ability_gaps: AbilityGap[];
  recommended_projects: Project[];
  material_gaps: MaterialGap[];
  zongping_risks: ZongpingRiskItem[];
  next_actions: string[];
  execution_cadence: Array<Record<string, unknown>>;
  evidence_basis: string[];
}

export interface CoverageScopeResponse {
  scope_type: string;
  scope_id: string;
  scope_name: string;
  total_students: number;
  average_coverage_ratio: number;
  completed_project_count: number;
  high_risk_entry_count: number;
  material_gap_count: number;
  stage_distribution: Array<Record<string, unknown>>;
  domain_coverage: KnowledgeDomainGap[];
  top_gap_knowledge_points: KnowledgePointSummary[];
  ability_gaps: AbilityGap[];
  student_rows: Array<Record<string, unknown>>;
  recommended_actions: string[];
}

export interface EvaluationRunRequest {
  dataset_name?: string;
  sample_size?: number;
  created_by?: string;
}

export interface EvaluationRunResponse {
  run_id: string;
  dataset_name: string;
  status: string;
  total_cases: number;
  passed_cases: number;
  failed_cases: number;
  metrics: Record<string, number>;
  case_results: Array<Record<string, unknown>>;
  warnings: string[];
  risk_level: string;
  created_by: string | null;
}

export interface RAGAuditDashboardResponse {
  summary: Record<string, unknown>;
  latest_evaluation: Record<string, unknown> | null;
  recent_evaluations: Array<Record<string, unknown>>;
  answer_risk_rows: Array<Record<string, unknown>>;
  source_health: Record<string, unknown>;
  risk_queue: Array<Record<string, unknown>>;
  recommended_actions: string[];
}

export interface TeacherOpsCampusAuditRow {
  campus_id?: string | null;
  campus_name?: string | null;
  class_count: number;
  batch_count: number;
  average_capture_quality: number;
  failed_item_recovery_rate: number;
  low_quality_evidence_ratio: number;
  lesson_close_timely_rate: number;
  task_closure_rate: number;
  project_group_quality_score: number;
  zongping_risk_count: number;
  explanation_risk_count: number;
  import_export_failure_rate: number;
  risk_level: string;
}

export interface TeacherOpsClassAuditRow {
  class_id: string;
  class_name: string;
  campus_id?: string | null;
  campus_name?: string | null;
  term_id?: string | null;
  course_track: string[];
  primary_teacher_user_id?: string | null;
  batch_count: number;
  average_capture_quality: number;
  failed_item_count: number;
  open_failed_item_count: number;
  failed_item_recovery_rate: number;
  low_quality_evidence_ratio: number;
  lesson_close_timely_rate: number;
  overdue_lesson_count: number;
  task_count: number;
  open_task_count: number;
  task_closure_rate: number;
  project_group_quality_score: number;
  zongping_risk_count: number;
  explanation_risk_count: number;
  risk_level: string;
  evidence_refs: Array<Record<string, unknown>>;
}

export interface TeacherOpsAuditResponse {
  filters: Record<string, unknown>;
  summary: Record<string, unknown>;
  campus_rows: TeacherOpsCampusAuditRow[];
  class_rows: TeacherOpsClassAuditRow[];
  risk_queue: Array<Record<string, unknown>>;
  explanation_quality: Record<string, unknown>;
  recommended_actions: string[];
}

export interface TeacherWorkspaceRequest {
  assessment: StudentAssessment;
  focus_project_id?: string | null;
  class_size: number;
  lesson_hours: number;
  communication_focus: string;
}

export interface LessonGenerateRequest {
  prompt: string;
  age_band?: string;
  duration_minutes?: number;
  target_project?: string;
  target_competition?: string;
}

export interface LessonGenerateResponse {
  lesson_title: string;
  student_level: string;
  teaching_goal: string[];
  related_knowledge_points: KnowledgePoint[];
  related_projects: Project[];
  lesson_flow: Array<{
    time: string;
    section: string;
    teacher_script: string;
    student_task: string;
  }>;
  materials_needed: string[];
  common_problems: string[];
  homework: string[];
  parent_feedback: string;
  next_lesson_suggestion: string;
  citations: string[];
}

export interface LessonBuilderRequest {
  prompt: string;
  age_band?: string;
  duration_minutes?: number;
  project_id?: string | null;
  knowledge_point_ids?: string[];
  class_size?: number;
  created_by?: string;
}

export interface LessonBuilderCitation {
  source_id: string;
  title: string;
  source_type: string;
  publisher: string | null;
  year: number | null;
  reliability_level: string;
  review_status: string;
}

export interface LessonBuilderBinding {
  knowledge_point_ids: string[];
  project_ids: string[];
  age_basis: string;
  citations: LessonBuilderCitation[];
}

export interface LessonBuilderBlock {
  title: string;
  content: string;
  binding: LessonBuilderBinding;
}

export interface TeacherHandout {
  title: string;
  objectives: LessonBuilderBlock[];
  key_concepts: LessonBuilderBlock[];
  teaching_flow: LessonBuilderBlock[];
  assessment: LessonBuilderBlock[];
}

export interface StudentTaskSheet {
  title: string;
  tasks: LessonBuilderBlock[];
  deliverables: LessonBuilderBlock[];
  reflection_questions: LessonBuilderBlock[];
}

export interface ParentFeedbackPack {
  title: string;
  summary_blocks: LessonBuilderBlock[];
  next_step_blocks: LessonBuilderBlock[];
  home_observation: LessonBuilderBlock[];
}

export interface LessonBuilderResponse {
  lesson_title: string;
  age_band: string;
  duration_minutes: number;
  focus_project: Project;
  knowledge_points: KnowledgePoint[];
  teacher_handout: TeacherHandout;
  student_task_sheet: StudentTaskSheet;
  parent_feedback: ParentFeedbackPack;
  citations: LessonBuilderCitation[];
  warnings: string[];
}

export interface MarkdownFlowValidateRequest {
  content: string;
  source_id?: string | null;
  strict_mode?: boolean;
  collect_lint?: boolean;
}

export interface MarkdownFlowIssue {
  severity: string;
  code: string;
  message: string;
  line: number;
  column: number;
  suggestion?: string | null;
}

export interface MarkdownFlowAstNodeSummary {
  node_type: string;
  title?: string | null;
  line_start: number;
  line_end: number;
  content_preview: string;
  metadata: Record<string, unknown>;
}

export interface MarkdownFlowAstSummary {
  source_id?: string | null;
  node_count: number;
  max_depth: number;
  source_length: number;
  parse_time_ms: number;
  node_counts: Record<string, number>;
  nodes: MarkdownFlowAstNodeSummary[];
}

export interface MarkdownFlowDependencies {
  variables: string[];
  assignments: string[];
  interactions: string[];
  knowledge_points: string[];
  styles: string[];
}

export interface MarkdownFlowPreviewBlock {
  block_type: string;
  title: string;
  content: string;
  line_start: number;
  line_end: number;
  metadata: Record<string, unknown>;
}

export interface MarkdownFlowValidateResponse {
  is_valid: boolean;
  errors: MarkdownFlowIssue[];
  warnings: MarkdownFlowIssue[];
  ast_summary: MarkdownFlowAstSummary;
  dependencies: MarkdownFlowDependencies;
  preview_blocks: MarkdownFlowPreviewBlock[];
}

export interface MarkdownFlowDraftSaveRequest {
  content: string;
  source_id?: string | null;
  draft_id?: string | null;
  title?: string | null;
  project_id?: string | null;
  strict_mode?: boolean;
  collect_lint?: boolean;
}

export interface MarkdownFlowDraftVersionRead {
  version_id: string;
  draft_id: string;
  version: number;
  content_hash: string;
  status: string;
  error_count: number;
  warning_count: number;
  dependencies: Record<string, unknown>;
  preview_blocks: Array<Record<string, unknown>>;
  validation_result: Record<string, unknown>;
  content?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface MarkdownFlowDraftRead {
  draft_id: string;
  source_id?: string | null;
  title: string;
  project_id?: string | null;
  current_version: number;
  content_hash: string;
  status: string;
  error_count: number;
  warning_count: number;
  dependencies: Record<string, unknown>;
  preview_blocks: Array<Record<string, unknown>>;
  validation_result: MarkdownFlowValidateResponse;
  latest_content: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarkdownFlowDraftImportRequest {
  lesson_id: string;
}

export interface MarkdownFlowRuntimeScenePlanItem {
  scene_id: string;
  label: string;
  title: string;
  block_types: string[];
  block_count: number;
  content_preview: string;
  interaction_ids: string[];
  knowledge_point_ids: string[];
}

export interface MarkdownFlowRuntimeFlowStep {
  id: string;
  order: number;
  type: string;
  title: string;
  body: string;
  scene_id: string;
  source_block_type: string;
  interaction_id?: string | null;
  knowledge_point_ids: string[];
  condition_context: Array<Record<string, unknown>>;
  condition_state: string;
}

export interface MarkdownFlowRuntimeKnowledgeQuestion {
  id: string;
  order: number;
  type: string;
  prompt: string;
  knowledge_point_id?: string | null;
  answer_variable?: string | null;
  options: string[];
  option_values: Record<string, unknown>;
  correct_options: string[];
  correct_option_values: unknown[];
  option_feedback: Record<string, string>;
  hint: string;
  rubric: string;
  source_refs: string[];
  scene_id: string;
  interaction_id?: string | null;
  pattern_id?: string | null;
  pattern_type?: string | null;
  difficulty?: number | null;
  quality_score: number;
  quality_grade: string;
  quality_reasons: string[];
  evidence_strength: string;
  frequency_score: number;
  review_trace: Record<string, unknown>;
}

export interface MarkdownFlowRuntimeInputRead {
  source: "markdownflow_draft" | string;
  lesson_id: string;
  draft_id: string;
  draft_version: number;
  content_hash: string;
  title: string;
  status: string;
  project_id?: string | null;
  initial_variables: Record<string, unknown>;
  runtime_warnings: string[];
  knowledge_point_ids: string[];
  dependencies: Record<string, unknown>;
  preview_blocks: Array<Record<string, unknown>>;
  scene_plan: MarkdownFlowRuntimeScenePlanItem[];
  flow_steps: MarkdownFlowRuntimeFlowStep[];
  knowledge_questions: MarkdownFlowRuntimeKnowledgeQuestion[];
  imported_at: string;
  imported_by?: string | null;
}

export interface MarkdownFlowDraftImportResponse {
  lesson: TeacherScheduleLesson;
  draft_ref: Record<string, unknown>;
  runtime_input: MarkdownFlowRuntimeInputRead;
  review_task_count: number;
  review_task_ids: string[];
}

export interface ParentFeedbackRequest {
  student_name?: string;
  age: number;
  today_topic: string;
  student_performance: string;
  project_progress: string;
  next_step: string;
  tone: string;
}

export interface ParentFeedbackResponse {
  parent_message: string;
  knowledge_points_learned: string[];
  progress_summary: string;
  next_step: string;
  teacher_note: string;
}

export interface ParentMessageRequest {
  student_name?: string | null;
  age: number;
  project_id?: string | null;
  communication_scenario: string;
  parent_goal: string;
  class_progress: string;
  observed_strengths: string[];
  concerns: string[];
  evidence_materials: string[];
  tone: string;
  created_by?: string;
}

export interface ParentMessageResponse {
  message_title: string;
  short_message: string;
  detailed_message: string;
  evidence_points: string[];
  next_actions: string[];
  boundary_reminders: string[];
  teacher_private_note: string;
  related_project: Project | null;
  related_knowledge_points: KnowledgePoint[];
  citations: LessonBuilderCitation[];
}

export interface RecommendedProgressionAction {
  type: string;
  label: string;
  target_id?: string | null;
  target_type?: string | null;
  priority: string;
}

export interface StudentKnowledgeProgress {
  progress_id: string;
  student_id: string;
  knowledge_point_id: string;
  knowledge_point_name: string;
  first_seen_at: string | null;
  last_seen_at: string | null;
  exposure_count: number;
  practice_count: number;
  mastery_level: string;
  mastery_score: number;
  mastery_dimensions: Record<string, number>;
  evidence_quality_score: number;
  transfer_score: number;
  mastery_reason?: string | null;
  evidence_record_ids: string[];
  evidence_event_ids: string[];
  related_project_ids: string[];
  last_project_id: string | null;
  next_recommended_kp_ids: string[];
  status: string;
}

export interface StudentLearningEvent {
  event_id: string;
  student_id: string;
  class_id?: string | null;
  group_id?: string | null;
  term_id?: string | null;
  project_id?: string | null;
  knowledge_point_id: string;
  source_record_id?: string | null;
  source_type: string;
  event_type: string;
  bloom_level: string;
  performance_level: string;
  score: number;
  weight: number;
  evidence_quality: number;
  evidence_material_ids: string[];
  evaluator_user_id?: string | null;
  event_note?: string | null;
  event_payload: Record<string, unknown>;
  observed_at: string;
}

export interface StudentLearningEventCreateRequest {
  knowledge_point_id: string;
  event_type: string;
  bloom_level?: string;
  performance_level?: string;
  score?: number;
  weight?: number;
  evidence_quality?: number;
  project_id?: string | null;
  source_record_id?: string | null;
  evidence_material_ids?: string[];
  observed_at?: string | null;
  note?: string | null;
  event_payload?: Record<string, unknown>;
}

export interface StudentMasteryEvidenceSummary {
  student_id: string;
  event_count: number;
  knowledge_point_count: number;
  average_mastery_score: number;
  average_evidence_quality: number;
  transferable_knowledge_count: number;
  applied_knowledge_count: number;
  low_evidence_quality_count: number;
  guided_only_count: number;
  event_type_counts: Record<string, number>;
  source_type_counts: Record<string, number>;
}

export interface ProgressionExplanationCitation {
  source_id: string;
  title: string;
  source_type: string;
  source_name?: string | null;
  publisher?: string | null;
  year?: number | null;
  reliability_level: string;
  review_status: string;
  match_reason: string;
}

export interface ProgressionGraphPathNode {
  node_id: string;
  node_type: string;
  name: string;
  summary?: string | null;
}

export interface ProgressionGraphPathStep {
  source: ProgressionGraphPathNode;
  target: ProgressionGraphPathNode;
  relation_type: string;
  evidence?: string | null;
  source_ids: string[];
  confidence: number;
}

export interface ProgressionAlertExplanation {
  explanation_id?: string | null;
  explanation_version: number;
  alert_id: string;
  student_id: string;
  alert_type: string;
  teacher_explanation: string;
  safe_explanation: string;
  why_now: string;
  why_not_advance: string;
  graph_paths: ProgressionGraphPathStep[];
  citations: ProgressionExplanationCitation[];
  explanation_quality_flags: string[];
  generated_at?: string | null;
  debug: Record<string, unknown>;
}

export interface StudentProgressionAlert {
  alert_id: string;
  student_id: string;
  class_id: string | null;
  group_id: string | null;
  term_id?: string | null;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  related_knowledge_point_ids: string[];
  related_project_ids: string[];
  recommended_actions: RecommendedProgressionAction[];
  status: string;
  status_reason?: string | null;
  status_note?: string | null;
  handled_by?: string | null;
  handled_at?: string | null;
  action_task_ids: string[];
  lesson_plan_refs: string[];
  reopened_at?: string | null;
  explanation?: ProgressionAlertExplanation | null;
  created_at: string;
  resolved_at: string | null;
}

export interface StudentProgressionAlertHistory {
  history_id: string;
  alert_id: string;
  student_id: string;
  class_id: string | null;
  group_id: string | null;
  action: string;
  actor_user_id?: string | null;
  actor_role?: string | null;
  reason?: string | null;
  note?: string | null;
  status_from?: string | null;
  status_to?: string | null;
  trigger_hash?: string | null;
  action_payload: Record<string, unknown>;
  created_at: string;
}

export interface ProgressionAlertActionPayload {
  reason?: string | null;
  note?: string | null;
  actor?: string | null;
}

export interface TeacherProjectRecordImportRow {
  record_id?: string | null;
  student_id: string;
  class_id?: string | null;
  group_id?: string | null;
  term_id?: string | null;
  project_id?: string | null;
  project_name: string;
  project_category?: string;
  course_level?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  role_in_project?: string | null;
  completed_status?: string;
  project_summary?: string | null;
  technologies_used?: string[];
  knowledge_point_ids?: string[];
  output_materials?: string[];
  teacher_comment?: string | null;
  evidence_material_ids?: string[];
}

export interface TeacherEvidenceMaterialImportRow {
  material_id?: string | null;
  student_id: string;
  material_type: string;
  title: string;
  file_url?: string | null;
  related_record_id?: string | null;
  verified_status?: string;
  uploaded_by?: string | null;
  uploaded_at?: string | null;
}

export interface TeacherProjectRecordImportRequest {
  dry_run?: boolean;
  actor?: string | null;
  rows: TeacherProjectRecordImportRow[];
}

export interface TeacherEvidenceMaterialImportRequest {
  dry_run?: boolean;
  actor?: string | null;
  rows: TeacherEvidenceMaterialImportRow[];
}

export interface TeacherImportRowResult {
  row_index: number;
  status: string;
  record_id?: string | null;
  material_id?: string | null;
  student_id?: string | null;
  message: string;
}

export interface TeacherImportResultResponse {
  import_id: string;
  import_type: string;
  class_id: string;
  dry_run: boolean;
  total_rows: number;
  created_count: number;
  updated_count: number;
  skipped_count: number;
  error_count: number;
  affected_student_ids: string[];
  results: TeacherImportRowResult[];
}

export interface TeacherDataExportResponse {
  export_id: string;
  export_type: string;
  scope_type: string;
  scope_id: string;
  format: string;
  filename: string;
  content_type: string;
  generated_at: string;
  row_count: number;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  content: string;
}

export interface TeacherTerm {
  term_id: string;
  term_label: string;
  campus_id?: string | null;
  campus_name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status: string;
  notes?: string | null;
}

export interface TeacherTermSwitchRequest {
  term_id: string;
  actor?: string | null;
  note?: string | null;
}

export interface TeacherScheduleLesson {
  lesson_id: string;
  class_id: string;
  term_id: string;
  term_label: string;
  lesson_no: number;
  lesson_title: string;
  start_at?: string | null;
  end_at?: string | null;
  duration_minutes: number;
  group_id?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  knowledge_point_ids: string[];
  lesson_objective?: string | null;
  deliverables: string[];
  materials: string[];
  source_alert_ids: string[];
  attendance: ClassroomAttendanceItem[];
  group_tasks: ClassroomTaskItem[];
  classroom_state: Record<string, unknown>;
  classroom_started_at?: string | null;
  classroom_ended_at?: string | null;
  after_class_summary?: string | null;
  status: string;
  created_by?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherScheduleResponse {
  class_id: string;
  term_id: string;
  term_label: string;
  lesson_count: number;
  lessons: TeacherScheduleLesson[];
}

export interface TeacherScheduleLessonCreateRequest {
  lesson_id?: string | null;
  lesson_no?: number | null;
  lesson_title: string;
  start_at?: string | null;
  end_at?: string | null;
  duration_minutes?: number;
  group_id?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  knowledge_point_ids?: string[];
  lesson_objective?: string | null;
  deliverables?: string[];
  materials?: string[];
  source_alert_ids?: string[];
  attendance?: ClassroomAttendanceItem[];
  group_tasks?: ClassroomTaskItem[];
  classroom_state?: Record<string, unknown>;
  status?: string;
  notes?: string | null;
  actor?: string | null;
}

export interface TeacherScheduleLessonUpdateRequest {
  lesson_no?: number | null;
  lesson_title?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  duration_minutes?: number | null;
  group_id?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  knowledge_point_ids?: string[] | null;
  lesson_objective?: string | null;
  deliverables?: string[] | null;
  materials?: string[] | null;
  source_alert_ids?: string[] | null;
  attendance?: ClassroomAttendanceItem[] | null;
  group_tasks?: ClassroomTaskItem[] | null;
  classroom_state?: Record<string, unknown> | null;
  classroom_started_at?: string | null;
  classroom_ended_at?: string | null;
  after_class_summary?: string | null;
  status?: string | null;
  notes?: string | null;
  actor?: string | null;
}

export interface ClassroomAttendanceItem {
  student_id: string;
  student_name?: string | null;
  status: string;
  note?: string | null;
  checked_at?: string | null;
}

export interface ClassroomTaskItem {
  task_id: string;
  title: string;
  student_ids: string[];
  deliverable?: string | null;
  status: string;
  linked_alert_ids: string[];
  knowledge_point_ids: string[];
  note?: string | null;
}

export interface ClassroomStartPayload {
  attendance?: ClassroomAttendanceItem[] | null;
  group_tasks?: ClassroomTaskItem[] | null;
  note?: string | null;
  actor?: string | null;
}

export interface ClassroomSessionUpdatePayload {
  attendance?: ClassroomAttendanceItem[] | null;
  group_tasks?: ClassroomTaskItem[] | null;
  classroom_state?: Record<string, unknown> | null;
  status?: string | null;
  note?: string | null;
  actor?: string | null;
}

export interface InteractiveRuntimeTraceSyncPayload {
  session_id: string;
  lesson_id: string;
  current_scene_id: string;
  step_index: number;
  started_at?: string | null;
  updated_at?: string | null;
  source?: string;
  variables?: Record<string, unknown>;
  trace?: Array<Record<string, unknown>>;
}

export interface InteractiveRuntimeAnswerAttempt {
  attempt_id: string;
  session_id: string;
  lesson_id: string;
  class_id?: string | null;
  student_id?: string | null;
  event_id: string;
  question_id: string;
  knowledge_point_id?: string | null;
  source: string;
  answer_variable?: string | null;
  answer_value: Record<string, unknown>;
  selected_options: string[];
  correct_options: string[];
  score?: number | null;
  max_score: number;
  is_correct?: boolean | null;
  scoring_status: string;
  score_scope: string;
  formal_score: boolean;
  formal_score_reason: string;
  confirmation_status: string;
  review_request_id?: string | null;
  confirmed_by?: string | null;
  confirmed_at?: string | null;
  confirmation_note?: string | null;
  formal_learning_event_id?: string | null;
  answer_length: number;
  answer_fingerprint?: string | null;
  audit_payload: Record<string, unknown>;
  created_by?: string | null;
  answered_at?: string | null;
  last_synced_at: string;
}

export interface AnswerAuditSummary {
  total_count: number;
  practice_only_count: number;
  formal_confirmed_count: number;
  formal_review_pending_count: number;
  formal_review_rejected_count: number;
  formal_revoked_count: number;
  scored_count: number;
  correct_count: number;
  average_score?: number | null;
}

export interface AnswerAuditListResponse {
  items: InteractiveRuntimeAnswerAttempt[];
  summary: AnswerAuditSummary;
  filters: Record<string, unknown>;
  page: number;
  page_size: number;
  total: number;
}

export interface AnswerAuditNoteTemplate {
  template_id: string;
  action: "confirm" | "revoke" | string;
  label: string;
  note: string;
  default_reason?: string | null;
  default_evidence_quality?: number | null;
  default_performance_level?: string | null;
  default_bloom_level?: string | null;
}

export interface AnswerAuditOptionsResponse {
  note_templates: AnswerAuditNoteTemplate[];
  confirmation_statuses: string[];
  scoring_statuses: string[];
  evidence_quality_options: number[];
  performance_level_options: string[];
  bloom_level_options: string[];
  default_evidence_quality: number;
  default_performance_level: string;
  default_bloom_level: string;
}

export interface AnswerAuditConfirmPayload {
  attempt_ids: string[];
  student_id: string;
  note_template_id?: string | null;
  note?: string | null;
  evidence_quality?: number;
  performance_level?: string;
  bloom_level?: string;
}

export interface AnswerAuditRevokePayload {
  attempt_ids: string[];
  reason: string;
  note_template_id?: string | null;
  note?: string | null;
}

export interface AnswerAuditMutationResponse {
  status: string;
  request_id?: string | null;
  updated_count: number;
  skipped_count: number;
  updated_attempt_ids: string[];
  skipped_attempt_ids: string[];
  learning_event_ids: string[];
  audit_id?: string | null;
}

export interface AnswerAuditSkippedItem {
  attempt_id: string;
  reason: string;
  question_id?: string | null;
  student_id?: string | null;
  lesson_id?: string | null;
}

export interface AnswerAuditBatchDryRunPayload extends AnswerAuditExportPayload {
  class_id: string;
}

export interface AnswerAuditBatchDryRunResponse {
  class_id: string;
  eligible_attempt_ids: string[];
  skipped_items: AnswerAuditSkippedItem[];
  summary: Record<string, unknown>;
  filters: Record<string, unknown>;
  generated_at: string;
}

export interface AnswerAuditReviewCreatePayload {
  attempt_ids: string[];
  class_id?: string | null;
  review_type?: string;
  note_template_id?: string | null;
  note?: string | null;
  evidence_quality?: number;
  performance_level?: string;
  bloom_level?: string;
  filters?: Record<string, unknown>;
}

export interface AnswerAuditReviewDecisionPayload {
  decision_note?: string | null;
  reject_reason?: string | null;
}

export interface AnswerAuditReviewItem {
  item_id: string;
  request_id: string;
  attempt_id: string;
  class_id?: string | null;
  student_id?: string | null;
  lesson_id?: string | null;
  session_id?: string | null;
  question_id?: string | null;
  knowledge_point_id?: string | null;
  status: string;
  skip_reason?: string | null;
  score?: number | null;
  is_correct?: boolean | null;
  formal_learning_event_id?: string | null;
  item_snapshot: Record<string, unknown>;
  created_at_text: string;
  reviewed_at?: string | null;
}

export interface AnswerAuditReviewRequest {
  request_id: string;
  class_id: string;
  status: string;
  review_type: string;
  submitted_by: string;
  submitted_by_role: string;
  submitted_at: string;
  reviewed_by?: string | null;
  reviewed_by_role?: string | null;
  reviewed_at?: string | null;
  note_template_id?: string | null;
  submit_note?: string | null;
  review_note?: string | null;
  reject_reason?: string | null;
  evidence_quality: number;
  performance_level: string;
  bloom_level: string;
  filters: Record<string, unknown>;
  summary: Record<string, unknown>;
  skipped_items: AnswerAuditSkippedItem[];
  audit_snapshot: Record<string, unknown>;
  approval_audit_id?: string | null;
  items: AnswerAuditReviewItem[];
}

export interface AnswerAuditReviewListResponse {
  items: AnswerAuditReviewRequest[];
  summary: Record<string, unknown>;
  filters: Record<string, unknown>;
  page: number;
  page_size: number;
  total: number;
  generated_at: string;
}

export interface AnswerAuditSlaReminderResponse {
  status: string;
  risk_type: string;
  generated_count: number;
  skipped_count: number;
  notification_ids: string[];
  skipped_request_ids: string[];
  sla_summary: Record<string, unknown>;
  audit_id: string;
  generated_at: string;
}

export interface AnswerAuditExportAuditTrailResponse {
  summary: Record<string, unknown>;
  jobs: AdminExportJob[];
  review_requests: AnswerAuditReviewRequest[];
  audit_logs: Record<string, unknown>[];
  generated_at: string;
}

export interface AnswerAuditExportPayload {
  format?: string;
  class_id?: string | null;
  lesson_id?: string | null;
  session_id?: string | null;
  student_id?: string | null;
  knowledge_point_id?: string | null;
  question_id?: string | null;
  is_correct?: boolean | null;
  scoring_status?: string | null;
  confirmation_status?: string | null;
  answered_from?: string | null;
  answered_to?: string | null;
  limit?: number;
}

export interface InteractiveRuntimeScoringSummary {
  attempt_count: number;
  scored_count: number;
  correct_count: number;
  average_score?: number | null;
  formal_score_count: number;
  score_scope: string;
  formal_score_boundary: string;
}

export interface InteractiveRuntimeSession {
  session_id: string;
  lesson_id: string;
  current_scene_id: string;
  step_index: number;
  source: string;
  sync_status: string;
  variables: Record<string, unknown>;
  trace: Array<Record<string, unknown>>;
  warnings: string[];
  created_by?: string | null;
  started_at?: string | null;
  client_updated_at?: string | null;
  last_synced_at: string;
  trace_event_count: number;
  warning_count: number;
  answer_attempts: InteractiveRuntimeAnswerAttempt[];
  scoring_summary: InteractiveRuntimeScoringSummary;
}

export interface ClassroomCompletePayload {
  attendance?: ClassroomAttendanceItem[] | null;
  group_tasks?: ClassroomTaskItem[] | null;
  after_class_summary?: string | null;
  note?: string | null;
  actor?: string | null;
}

export interface ClassroomObservationItem {
  client_item_id?: string | null;
  student_id: string;
  knowledge_point_id?: string | null;
  event_type?: string;
  bloom_level?: string;
  performance_level?: string;
  score?: number;
  weight?: number;
  evidence_quality?: number;
  project_id?: string | null;
  observed_at?: string | null;
  note?: string | null;
  evidence_material_id?: string | null;
  evidence_material_type?: string;
  evidence_title?: string | null;
  evidence_file_url?: string | null;
  event_payload?: Record<string, unknown>;
}

export interface ClassroomObservationPayload {
  observations: ClassroomObservationItem[];
  client_batch_id?: string | null;
  offline_created_at?: string | null;
  retry_count?: number;
  source?: string;
  actor?: string | null;
}

export interface ClassroomCaptureBatch {
  batch_id: string;
  lesson_id: string;
  class_id: string;
  group_id?: string | null;
  term_id: string;
  client_batch_id?: string | null;
  source: string;
  status: string;
  item_count: number;
  success_count: number;
  failed_count: number;
  retry_count: number;
  offline_created_at?: string | null;
  created_by?: string | null;
  quality_score: number;
  quality_flags: string[];
  failed_items: Record<string, unknown>[];
  payload: Record<string, unknown>;
  result: Record<string, unknown>;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassroomCaptureLessonAudit {
  lesson_id: string;
  lesson_title?: string | null;
  class_id: string;
  term_id: string;
  batch_count: number;
  item_count: number;
  success_count: number;
  failed_count: number;
  retry_batch_count: number;
  low_quality_batch_count: number;
  average_quality_score: number;
  latest_batch_at?: string | null;
}

export interface ClassroomCaptureAuditResponse {
  scope_class_ids: string[];
  campus_id?: string | null;
  term_id?: string | null;
  batch_count: number;
  item_count: number;
  success_count: number;
  failed_count: number;
  failure_rate: number;
  retry_batch_count: number;
  low_quality_batch_count: number;
  average_quality_score: number;
  quality_flags: Record<string, number>;
  failed_items: Record<string, unknown>[];
  lessons: ClassroomCaptureLessonAudit[];
  recent_batches: ClassroomCaptureBatch[];
}

export interface ClassroomFailedItem {
  failed_item_id: string;
  batch_id: string;
  lesson_id: string;
  class_id?: string | null;
  group_id?: string | null;
  term_id?: string | null;
  index: number;
  code: string;
  message: string;
  retryable: boolean;
  suggested_fix?: string | null;
  status: string;
  retry_count: number;
  student_id?: string | null;
  knowledge_point_id?: string | null;
  event_type?: string | null;
  evidence_material_id?: string | null;
  note?: string | null;
  observation: ClassroomObservationItem;
  last_retry_batch_id?: string | null;
  resolved_batch_id?: string | null;
  resolved_at?: string | null;
  last_error?: string | null;
}

export interface ClassroomFailureReasonSummary {
  code: string;
  label: string;
  count: number;
  open_count: number;
  retryable_count: number;
  lesson_count: number;
  latest_batch_at?: string | null;
  suggested_fix?: string | null;
}

export interface ClassroomServerOfflineSummary {
  offline_batch_count: number;
  retried_batch_count: number;
  delayed_batch_count: number;
  failed_offline_batch_count: number;
  average_offline_delay_hours: number;
  latest_offline_batch_at?: string | null;
}

export interface ClassroomReliabilityReminder {
  reminder_id: string;
  severity: string;
  title: string;
  description: string;
  action_label: string;
  action_url: string;
  lesson_id?: string | null;
  class_id?: string | null;
}

export interface ClassroomReliabilityDashboardResponse {
  audit: ClassroomCaptureAuditResponse;
  reliability_score: number;
  failure_reasons: ClassroomFailureReasonSummary[];
  retry_candidates: ClassroomFailedItem[];
  server_offline: ClassroomServerOfflineSummary;
  teacher_reminders: ClassroomReliabilityReminder[];
}

export interface ClassroomFailedItemsResponse {
  lesson_id: string;
  failed_items: ClassroomFailedItem[];
  open_count: number;
  resolved_count: number;
}

export interface ClassroomFailedItemRetryEntry {
  batch_id: string;
  index: number;
  observation: ClassroomObservationItem;
}

export interface ClassroomFailedItemsRetryPayload {
  items: ClassroomFailedItemRetryEntry[];
  client_batch_id?: string | null;
  actor?: string | null;
}

export interface ClassroomBulkFailedItemRetryEntry {
  lesson_id: string;
  batch_id: string;
  index: number;
  observation: ClassroomObservationItem;
}

export interface ClassroomBulkFailedItemsRetryPayload {
  items: ClassroomBulkFailedItemRetryEntry[];
  client_batch_id?: string | null;
  actor?: string | null;
}

export interface ClassroomFailedItemsRetryResponse {
  lesson: TeacherScheduleLesson;
  retry_batch?: ClassroomCaptureBatch | null;
  created_events: StudentLearningEvent[];
  created_material_ids: string[];
  affected_student_ids: string[];
  remaining_failed_items: ClassroomFailedItem[];
  class_status: Record<string, unknown>;
  group_capability?: Record<string, unknown> | null;
}

export interface ClassroomBulkFailedItemsRetryResponse {
  requested_count: number;
  lesson_count: number;
  retry_batches: ClassroomCaptureBatch[];
  created_event_count: number;
  remaining_failed_items: ClassroomFailedItem[];
  results: ClassroomFailedItemsRetryResponse[];
}

export interface TeacherClassroomMaterialUploadResponse {
  material: ZongpingEvidenceMaterial;
  related_record_id?: string | null;
}

export interface ClassroomAfterClassZongpingTask {
  task_id: string;
  student_id: string;
  student_name?: string | null;
  title: string;
  status: string;
  category_hint?: string | null;
  evidence_summary: string;
  event_ids: string[];
  material_ids: string[];
  knowledge_point_ids: string[];
  quality_status: string;
  action_url: string;
  source_refs: Record<string, unknown>;
}

export interface ClassroomAfterClassParentFeedbackDraft {
  draft_id: string;
  student_id: string;
  student_name?: string | null;
  title: string;
  parent_message: string;
  knowledge_points_learned: string[];
  progress_summary: string;
  next_step: string;
  teacher_note: string;
  action_url: string;
  status: string;
}

export interface ClassroomAfterClassNextLessonTask {
  task_id: string;
  title: string;
  student_ids: string[];
  deliverable?: string | null;
  status: string;
  linked_alert_ids: string[];
  knowledge_point_ids: string[];
  note?: string | null;
  source: string;
}

export interface ClassroomAfterClassCloseLoop {
  lesson_id: string;
  generated_at: string;
  source_event_count: number;
  source_material_count: number;
  next_lesson_id?: string | null;
  zongping_tasks: ClassroomAfterClassZongpingTask[];
  parent_feedback_drafts: ClassroomAfterClassParentFeedbackDraft[];
  next_lesson_tasks: ClassroomAfterClassNextLessonTask[];
}

export interface TeacherClassroomResponse {
  lesson: TeacherScheduleLesson;
  class_info: TeacherClassInfo;
  group: TeacherProjectGroup | null;
  students: TeacherStudentRosterItem[];
  alerts: StudentProgressionAlert[];
  recent_events: StudentLearningEvent[];
  capture_batches: ClassroomCaptureBatch[];
}

export interface TeacherClassroomObservationResponse {
  lesson: TeacherScheduleLesson;
  capture_batch?: ClassroomCaptureBatch | null;
  created_events: StudentLearningEvent[];
  created_material_ids: string[];
  affected_student_ids: string[];
  class_status: Record<string, unknown>;
  group_capability?: Record<string, unknown> | null;
}

export interface TeacherClassroomCompleteResponse {
  lesson: TeacherScheduleLesson;
  class_status: Record<string, unknown>;
  class_alerts: Record<string, unknown>;
  group_capability?: Record<string, unknown> | null;
  after_class_close_loop?: ClassroomAfterClassCloseLoop | null;
  teacher_tasks: TeacherTask[];
}

export interface TeacherTaskSourceRef {
  source_ref_id: string;
  task_id: string;
  ref_type: string;
  source_id: string;
  source_label?: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface TeacherTaskAssignee {
  assignee_id: string;
  task_id: string;
  assignee_user_id: string;
  assignee_role: string;
  status: string;
  assigned_at: string;
  completed_at?: string | null;
}

export interface TeacherTaskStatusHistory {
  history_id: string;
  task_id: string;
  action: string;
  actor_user_id?: string | null;
  actor_role?: string | null;
  status_from?: string | null;
  status_to?: string | null;
  reason?: string | null;
  note?: string | null;
  action_payload: Record<string, unknown>;
  created_at: string;
}

export interface TeacherTask {
  task_id: string;
  source_key: string;
  task_type: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  source: string;
  class_id?: string | null;
  term_id?: string | null;
  lesson_id?: string | null;
  next_lesson_id?: string | null;
  group_id?: string | null;
  project_id?: string | null;
  student_ids: string[];
  assignee_user_ids: string[];
  linked_event_ids: string[];
  linked_material_ids: string[];
  linked_alert_ids: string[];
  linked_knowledge_point_ids: string[];
  action_url?: string | null;
  due_at?: string | null;
  completed_at?: string | null;
  task_payload: Record<string, unknown>;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
  source_refs: TeacherTaskSourceRef[];
  assignees: TeacherTaskAssignee[];
}

export interface TeacherTaskCenterResponse {
  class_id?: string | null;
  term_id?: string | null;
  total_count: number;
  open_count: number;
  today_due_count: number;
  after_class_count: number;
  status_summary: Record<string, number>;
  type_summary: Record<string, number>;
  tasks: TeacherTask[];
}

export interface TeacherTaskStatusPayload {
  status: string;
  reason?: string | null;
  note?: string | null;
  actor?: string | null;
}

export interface TeacherTaskProjectRecordBinding {
  record_id?: string | null;
  project_name?: string | null;
  project_category?: string | null;
  role_in_project?: string | null;
  completed_status?: string;
  project_summary?: string | null;
  technologies_used?: string[];
  output_materials?: string[];
  teacher_comment?: string | null;
}

export interface TeacherTaskConfirmationPayload {
  action?: string;
  target_type?: string | null;
  project_record?: TeacherTaskProjectRecordBinding | null;
  zongping_entry_id?: string | null;
  category_id?: string | null;
  version_type?: number;
  parent_message?: string | null;
  progress_summary?: string | null;
  next_step?: string | null;
  teacher_note?: string | null;
  send_channel?: string | null;
  sent_to?: string | null;
  sent_at?: string | null;
  next_lesson_id?: string | null;
  next_lesson_task?: ClassroomTaskItem | null;
  note?: string | null;
  actor?: string | null;
}

export interface TeacherTaskConfirmationResponse {
  task: TeacherTask;
  action: string;
  target_type?: string | null;
  project_record_id?: string | null;
  zongping_entry_id?: string | null;
  next_lesson_id?: string | null;
  sent_version?: Record<string, unknown> | null;
  citations: TeacherTaskSourceRef[];
  result: Record<string, unknown>;
}

export interface TeacherProjectGroupCreateRequest {
  group_id?: string | null;
  group_name: string;
  project_id?: string | null;
  project_name?: string | null;
  course_track?: string[];
  target_direction?: string | null;
  term_id?: string | null;
  total_hours?: number;
  hardware_condition?: string[];
  maturity_route?: string[];
  current_maturity_level?: string;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
  notes?: string | null;
  actor?: string | null;
}

export interface TeacherProjectGroupUpdateRequest {
  group_name?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  course_track?: string[] | null;
  target_direction?: string | null;
  term_id?: string | null;
  total_hours?: number | null;
  hardware_condition?: string[] | null;
  maturity_route?: string[] | null;
  current_maturity_level?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
  notes?: string | null;
  actor?: string | null;
}

export interface TeacherGroupMemberUpsertRequest {
  membership_id?: string | null;
  student_id: string;
  member_role?: string;
  responsibility?: string | null;
  capability_focus?: string[];
  contribution_note?: string | null;
  joined_at?: string | null;
  status?: string;
  actor?: string | null;
}

export interface TeacherGroupMemberUpdateRequest {
  member_role?: string | null;
  responsibility?: string | null;
  capability_focus?: string[] | null;
  contribution_note?: string | null;
  joined_at?: string | null;
  status?: string | null;
  actor?: string | null;
}

export interface ProgressionPlanStatusPayload {
  status: "pending" | "completed" | "canceled" | string;
  reason?: string | null;
  note?: string | null;
  actor?: string | null;
}

export interface ProgressionSummary {
  total_alerts: number;
  repeated_knowledge_count: number;
  ready_to_advance_count: number;
  missing_prerequisite_count: number;
  narrow_project_scope_count: number;
  maturity_upgrade_needed_count: number;
  stale_progress_count: number;
  mastered_knowledge_count: number;
  applied_knowledge_count: number;
  transferable_knowledge_count: number;
  repeated_knowledge_point_count: number;
  next_knowledge_point_count: number;
  evidence_event_count: number;
  low_evidence_quality_count: number;
}

export interface StudentProgressionAnalysisResponse {
  student_id: string;
  current_stage: string;
  knowledge_progress: StudentKnowledgeProgress[];
  mastery_evidence_summary: StudentMasteryEvidenceSummary;
  alerts: StudentProgressionAlert[];
  summary: ProgressionSummary;
  source_notes: string[];
}

export interface StudentProgressionPlanResponse {
  student_id: string;
  plan_title: string;
  current_stage: string;
  next_steps: string[];
  recommended_projects: Array<Record<string, unknown>>;
  alert_actions: RecommendedProgressionAction[];
  source_notes: string[];
}

export interface StudentProgressionPlanSaveRequest {
  plan_title?: string | null;
  current_stage?: string | null;
  next_steps: string[];
  recommended_projects: Array<Record<string, unknown>>;
  alert_actions: RecommendedProgressionAction[];
  source_notes: string[];
  alert_ids?: string[];
  knowledge_point_ids?: string[];
  project_ids?: string[];
  deliverables?: string[];
  actor?: string | null;
}

export interface StudentProgressionPlan {
  plan_id: string;
  student_id: string;
  class_id: string | null;
  group_id: string | null;
  term_id?: string | null;
  plan_title: string;
  current_stage: string;
  status: string;
  linked_alert_ids: string[];
  linked_knowledge_point_ids: string[];
  linked_project_ids: string[];
  linked_deliverables: string[];
  next_steps: string[];
  recommended_projects: Array<Record<string, unknown>>;
  task_queue: Array<Record<string, unknown>>;
  source_notes: string[];
  plan_payload: Record<string, unknown>;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  canceled_at?: string | null;
}

export interface StudentProgressionPlanHistory {
  history_id: string;
  plan_id: string;
  student_id: string;
  class_id: string | null;
  action: string;
  actor_user_id?: string | null;
  actor_role?: string | null;
  reason?: string | null;
  note?: string | null;
  status_from?: string | null;
  status_to?: string | null;
  action_payload: Record<string, unknown>;
  created_at: string;
}

export interface ProgressionPlanStatusSummary {
  total_plans: number;
  pending_count: number;
  completed_count: number;
  canceled_count: number;
  latest_plan_at?: string | null;
}

export interface ClassProgressionStudentStatus {
  student_id: string;
  student_name?: string | null;
  class_id?: string | null;
  group_ids: string[];
  current_stage?: string | null;
  open_alert_count: number;
  high_alert_count: number;
  medium_alert_count: number;
  low_alert_count: number;
  mastered_knowledge_count: number;
  repeated_knowledge_point_count: number;
  next_knowledge_point_count: number;
  average_mastery_score: number;
  average_evidence_quality: number;
  transferable_knowledge_count: number;
  low_evidence_quality_count: number;
  pending_plan_count: number;
  completed_plan_count: number;
  canceled_plan_count: number;
  latest_plan_id?: string | null;
  latest_plan_status?: string | null;
  latest_plan_at?: string | null;
}

export interface ClassProgressionStatusResponse {
  class_id: string;
  student_count: number;
  analyzed_student_count: number;
  affected_student_count: number;
  open_alert_count: number;
  high_alert_count: number;
  medium_alert_count: number;
  low_alert_count: number;
  alert_type_distribution: Record<string, number>;
  severity_distribution: Record<string, number>;
  summary: ProgressionSummary;
  mastery_evidence_summary: StudentMasteryEvidenceSummary;
  plan_status_summary: ProgressionPlanStatusSummary;
  students: ClassProgressionStudentStatus[];
  source_notes: string[];
}

export interface ClassProgressionAlertResponse {
  class_id: string;
  alerts: StudentProgressionAlert[];
  summary: ProgressionSummary;
  filter_options: Array<Record<string, string>>;
  plan_status_summary: ProgressionPlanStatusSummary;
}

export interface GroupCapabilityMapResponse {
  group_id: string;
  class_id: string | null;
  heatmap: Array<Record<string, unknown>>;
  repeated_knowledge_points: Array<Record<string, unknown>>;
  missing_key_knowledge_points: Array<Record<string, unknown>>;
  member_roles: Array<Record<string, unknown>>;
  member_contributions: Array<Record<string, unknown>>;
  next_stage_suggestions: string[];
  alerts: StudentProgressionAlert[];
}

export interface TeacherStudentRosterItem {
  student_id: string;
  name: string;
  grade: string;
  school_stage: string;
  school_name: string | null;
  class_id: string | null;
  class_name: string | null;
  current_term_id: string | null;
  teacher_id: string | null;
  project_record_count: number;
  open_alert_count: number;
}

export interface TeacherGroupMember {
  membership_id: string;
  group_id: string;
  class_id: string;
  student_id: string;
  member_role: string;
  responsibility: string | null;
  capability_focus: string[];
  contribution_note: string | null;
  joined_at: string | null;
  status: string;
}

export interface TeacherProjectGroup {
  group_id: string;
  class_id: string;
  group_name: string;
  project_id: string | null;
  project_name: string | null;
  course_track: string[];
  target_direction: string | null;
  term_id: string;
  term_label: string;
  total_hours: number;
  hardware_condition: string[];
  maturity_route: string[];
  current_maturity_level: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  member_count: number;
  members: TeacherGroupMember[];
}

export interface TeacherClassInfo {
  class_id: string;
  class_name: string;
  campus_id: string | null;
  campus_name: string | null;
  school_stage: string | null;
  age_band: string | null;
  grade_label: string | null;
  course_track: string[];
  target_direction: string | null;
  term_id: string;
  term_label: string;
  total_hours: number;
  hardware_condition: string[];
  primary_teacher_user_id: string | null;
  status: string;
  student_count: number;
  group_count: number;
}

export interface TeacherClassDetailResponse {
  class_info: TeacherClassInfo;
  students: TeacherStudentRosterItem[];
  groups: TeacherProjectGroup[];
}

export interface TeacherContextResponse {
  user_id: string;
  role: string;
  default_class_id: string | null;
  default_group_id: string | null;
  default_student_id: string | null;
  classes: TeacherClassInfo[];
  groups: TeacherProjectGroup[];
  students: TeacherStudentRosterItem[];
}

export interface TeacherWorkspaceResponse {
  recommendation: RecommendationResult;
  project_options: Project[];
  focus_project: Project | null;
  key_knowledge_points: KnowledgePoint[];
  related_competition_points: CompetitionPoint[];
  parent_talk_script: Array<Record<string, unknown>>;
  teaching_suggestion: Record<string, unknown>;
  classroom_actions: Array<Record<string, unknown>>;
  source_notes: string[];
}

export interface ZongpingCategory {
  category_id: string;
  school_stage: string;
  dimension: string;
  sub_category: string;
  field_names: string[];
  word_limit_min: number;
  word_limit_max: number;
  required_evidence_types: string[];
  frequency_rule: string | null;
  notes: string | null;
}

export interface ZongpingStudentProfile {
  student_id: string;
  name: string;
  grade: string;
  school_stage: "primary" | "junior" | "senior" | string;
  school_name: string | null;
  class_name: string | null;
  enrollment_year: number | null;
  parent_contact: string | null;
  teacher_id: string | null;
}

export interface ZongpingProjectRecord {
  record_id: string;
  student_id: string;
  project_id: string | null;
  project_name: string;
  project_category: string;
  course_level: string | null;
  start_date: string | null;
  end_date: string | null;
  role_in_project: string | null;
  completed_status: string;
  project_summary: string | null;
  technologies_used: string[];
  knowledge_point_ids: string[];
  output_materials: string[];
  teacher_comment: string | null;
  evidence_material_ids: string[];
}

export interface ZongpingExamRecord {
  exam_record_id: string;
  student_id: string;
  exam_system: string;
  exam_level: string;
  certificate_name: string | null;
  passed_date: string | null;
  score_or_grade: string | null;
  certificate_material_id: string | null;
}

export interface ZongpingCompetitionRecord {
  competition_record_id: string;
  student_id: string;
  competition_name: string;
  competition_code: string | null;
  track: string | null;
  award_level: string | null;
  award_date: string | null;
  role_in_team: string | null;
  project_name: string | null;
  certificate_material_id: string | null;
  evidence_material_ids: string[];
}

export interface ZongpingEvidenceMaterial {
  material_id: string;
  student_id: string;
  material_type: string;
  title: string;
  file_url: string | null;
  related_record_id: string | null;
  verified_status: string;
  uploaded_by: string | null;
  uploaded_at: string | null;
  source_lesson_id?: string | null;
  source_task_id?: string | null;
  source_batch_ids?: string[];
}

export interface ZongpingMaterialAudit {
  audit_id: string;
  material_id: string;
  accessible: boolean;
  exists_on_disk: boolean;
  file_size_bytes: number;
  file_extension: string | null;
  issue_level: "ok" | "warning" | "blocked" | string;
  issues: string[];
  audited_at: string;
}

export interface ZongpingGeneratedEntry {
  entry_id: string;
  student_id: string;
  category_id: string;
  source_record_ids: string[];
  title: string;
  content: string;
  word_count: number;
  version_type: string;
  evidence_material_ids: string[];
  missing_materials: string[];
  compliance_status: string;
  audit_warnings: string[];
  confidence_score: number;
  evidence_score: number;
  compliance_score: number;
  risk_level: string;
  created_by: string | null;
  reviewed_by: string | null;
  audit_status: string;
}

export interface ZongpingStudentRecords {
  profile: ZongpingStudentProfile;
  project_records: ZongpingProjectRecord[];
  exam_records: ZongpingExamRecord[];
  competition_records: ZongpingCompetitionRecord[];
  evidence_materials: ZongpingEvidenceMaterial[];
  generated_entries: ZongpingGeneratedEntry[];
}

export interface ZongpingMappedEntryOption {
  source_record_id: string;
  source_type: string;
  source_title: string;
  recommended_category: ZongpingCategory;
  reason: string;
  available_word_versions: number[];
  required_materials: string[];
  missing_materials: string[];
  risk_level: string;
  confidence_score: number;
}

export interface ZongpingResumeResponse {
  student_summary: string;
  available_entries: ZongpingMappedEntryOption[];
}

export interface ZongpingGenerateEntryRequest {
  student_id: string;
  source_type: string;
  source_record_id: string;
  category_id: string;
  version_type: number;
  created_by?: string;
}

export interface ZongpingGenerateEntryResponse {
  entry_id: string;
  category: {
    dimension: string;
    sub_category: string;
  };
  title: string;
  content: string;
  word_count: number;
  word_limit: number;
  evidence_materials: Array<{
    type: string;
    status: string;
    material_id: string | null;
    title: string | null;
  }>;
  missing_materials: string[];
  compliance_check: {
    word_count_ok: boolean;
    evidence_ok: boolean;
    truthfulness_ok: boolean;
    category_match_ok: boolean;
    risk_level: string;
    warnings: string[];
    confidence_score?: number;
    evidence_score?: number;
    compliance_score?: number;
  };
  editable: boolean;
  source_record_ids: string[];
  audit_status: string;
  submission_policy: {
    can_submit: boolean;
    required_action: string;
    label: string;
    reason: string;
    enforced_audit_status: string;
  };
  history: Array<{
    history_id: string;
    entry_id: string;
    action: string;
    old_audit_status: string | null;
    new_audit_status: string | null;
    old_risk_level: string | null;
    new_risk_level: string | null;
    changed_by: string | null;
    change_note: string | null;
    created_at: string;
  }>;
  confirmations: Array<{
    confirmation_id: string;
    entry_id: string;
    student_id: string;
    confirmer_role: "student" | "parent" | string;
    confirmer_name: string;
    confirmed: boolean;
    statement: string;
    confirmed_at: string;
  }>;
  material_audits: ZongpingMaterialAudit[];
}

export interface ZongpingTemplate {
  template_id: string;
  name: string;
  school_stages: string[];
  category_ids: string[];
  input_fields: string[];
  output_structure: string[];
  word_limit: number;
  required_evidence: string[];
  example: string;
  forbidden: string[];
  version: number;
  updated_by: string | null;
}

export interface ZongpingTeacherDashboard {
  class_name: string;
  total_students: number;
  completed_students: number;
  students_need_materials: number;
  high_risk_entries: number;
  required_completion_rate: number;
  students: Array<{
    student_id: string;
    name: string;
    grade: string;
    class_name: string | null;
    entry_count: number;
    missing_count: number;
    high_risk_count: number;
  }>;
  missing_materials: Array<{
    student_id: string;
    entry_id: string;
    title: string;
    missing_materials: string[];
  }>;
}

export interface PortfolioGenerateRequest {
  student_id: string;
  generate_zongping_entries?: boolean;
  max_entries?: number;
  created_by?: string;
}

export interface PortfolioStage {
  level_code: string;
  name: string;
  evidence: string[];
  confidence_score: number;
}

export interface PortfolioMaterial {
  material_id: string;
  material_type: string;
  title: string;
  file_url: string | null;
  verified_status: string;
}

export interface PortfolioKnowledgeBrief {
  id: string;
  name: string;
  summary: string | null;
  domain: string;
  level: string | null;
  age_band: string;
  difficulty: number;
  importance_level: string;
  display_tags: string[];
}

export interface PortfolioCompletedProject {
  record_id: string;
  project_id: string | null;
  project_name: string;
  course_level: string | null;
  completed_status: string;
  period: string;
  project_summary: string | null;
  technologies_used: string[];
  outputs: string[];
  role_in_project: string | null;
  portfolio_value_score: number;
  parent_value: string | null;
  knowledge_points: PortfolioKnowledgeBrief[];
  evidence_materials: PortfolioMaterial[];
}

export interface PortfolioMasteredAbility {
  ability_id: string;
  name: string;
  level: string;
  summary: string;
  evidence_count: number;
  evidence_sources: string[];
  knowledge_point_ids: string[];
  tags: string[];
}

export interface PortfolioCoverageDomain {
  domain: string;
  covered: number;
  total: number;
  coverage_ratio: number;
}

export interface PortfolioKnowledgeCoverage {
  stage_total: number;
  covered: number;
  coverage_ratio: number;
  by_domain: PortfolioCoverageDomain[];
  knowledge_points: PortfolioKnowledgeBrief[];
}

export interface PortfolioCredentialRecord {
  record_type: "exam" | "competition" | string;
  title: string;
  date: string | null;
  result: string | null;
  track: string | null;
  material_id: string | null;
  verified: boolean;
}

export interface PortfolioRepresentativeWork {
  work_id: string;
  title: string;
  project_id: string | null;
  summary: string | null;
  highlights: string[];
  materials: PortfolioMaterial[];
  portfolio_value_score: number;
}

export interface PortfolioZongpingContent {
  generated_entries: ZongpingGeneratedEntry[];
  candidates: ZongpingMappedEntryOption[];
  ready_count: number;
  needs_material_count: number;
  high_risk_count: number;
}

export interface PortfolioNextStageSuggestion {
  suggestion_type: string;
  title: string;
  reason: string;
  action_label: string;
  target_url: string;
  related_ids: string[];
}

export interface StudentPortfolioResponse {
  student: ZongpingStudentProfile;
  current_stage: PortfolioStage;
  completed_projects: PortfolioCompletedProject[];
  mastered_abilities: PortfolioMasteredAbility[];
  knowledge_coverage: PortfolioKnowledgeCoverage;
  exam_records: ZongpingExamRecord[];
  competition_records: ZongpingCompetitionRecord[];
  credential_records: PortfolioCredentialRecord[];
  representative_works: PortfolioRepresentativeWork[];
  zongping_fillable_content: PortfolioZongpingContent;
  next_stage_suggestions: PortfolioNextStageSuggestion[];
  parent_summary: string;
  generated_entry_ids: string[];
}

export interface ZongpingExportResponse {
  export_id: string;
  export_type: string;
  file_url: string;
  item_count: number;
  warnings: string[];
}
