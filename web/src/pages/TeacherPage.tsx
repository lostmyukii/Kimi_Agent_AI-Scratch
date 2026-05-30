import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  Brain,
  CalendarDays,
  ClipboardList,
  DatabaseZap,
  Download,
  Eye,
  FileCheck2,
  FileText,
  FileStack,
  GraduationCap,
  Layers3,
  LibraryBig,
  Lightbulb,
  MessageSquareText,
  Network,
  PackageOpen,
  Presentation,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  UploadCloud,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/api/client";
import { EmptyState, LoadingState } from "@/components/common/StateViews";
import { ProgressionAlertActions } from "@/components/teacher/ProgressionAlertActions";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn, compactList } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import type {
  AuthPermissionResponse,
  AdminExportJob,
  CompetitionPoint,
  ClassProgressionAlertResponse,
  ClassProgressionStatusResponse,
  GroupCapabilityMapResponse,
  HighFrequencyKnowledgePoint,
  KnowledgeApplicationCase,
  KnowledgeEvidence,
  KnowledgePoint,
  KnowledgePointTeacherView,
  KnowledgeQuestionPattern,
  LessonGenerateResponse,
  ParentFeedbackResponse,
  Project,
  StudentAssessment,
  StudentProgressionAlert,
  TeacherDataExportResponse,
  TeacherEvidenceMaterialImportRow,
  TeacherImportResultResponse,
  TeacherProjectGroup,
  TeacherProjectRecordImportRow,
  TeacherScheduleResponse,
  TeacherTask,
  TeacherTaskCenterResponse,
  TeacherTaskConfirmationPayload,
  TeacherTerm,
  TeacherContextResponse,
  TeacherWorkspaceResponse,
  MarkdownFlowReviewOptionsResponse,
} from "@/types/api";

const defaultAssessment: StudentAssessment = {
  age: 10,
  grade: "四年级",
  scratch_level: "基础",
  python_level: "入门",
  cpp_level: "未学",
  robot_level: "基础",
  competition_experience: "无",
  goal_direction: "AI项目",
  weekly_hours: 3,
  parent_expectation: "希望完成一个可展示的AI项目。",
};

type ViewMode = "teacher_view" | "admin_view" | "consultant_view" | "parent_view" | "demo_view" | "public_view";
type TeacherTab =
  | "classes"
  | "student"
  | "groups"
  | "projects"
  | "lesson"
  | "plan"
  | "deliverables"
  | "feedback"
  | "knowledge"
  | "progression"
  | "tasks"
  | "imports"
  | "competition"
  | "coverage"
  | "qa"
  | "overview"
  | "growth"
  | "outcomes"
  | "portfolioSample"
  | "evidenceChain"
  | "parentSample";

const teacherNavItems: Array<{ id: TeacherTab; label: string; icon: LucideIcon; hint: string }> = [
  { id: "classes", label: "班级", icon: Users, hint: "班级交付" },
  { id: "student", label: "学生", icon: UserRound, hint: "学生画像" },
  { id: "groups", label: "项目组", icon: Layers3, hint: "组内能力" },
  { id: "projects", label: "项目进度", icon: LibraryBig, hint: "项目应用" },
  { id: "lesson", label: "一句话备课", icon: Sparkles, hint: "teacher_only" },
  { id: "plan", label: "计划生成", icon: ClipboardList, hint: "推进计划" },
  { id: "deliverables", label: "交付物", icon: FileStack, hint: "证据链" },
  { id: "feedback", label: "家长反馈", icon: MessageSquareText, hint: "parent-feedback" },
  { id: "knowledge", label: "知识点审计", icon: BookOpenCheck, hint: "重复预警" },
  { id: "progression", label: "推进提醒", icon: AlertTriangle, hint: "成长监测" },
  { id: "tasks", label: "任务中心", icon: ClipboardList, hint: "课后闭环" },
  { id: "imports", label: "导入导出", icon: DatabaseZap, hint: "内部工具" },
  { id: "competition", label: "竞赛备赛", icon: GraduationCap, hint: "备赛建议" },
  { id: "coverage", label: "覆盖率", icon: BarChart3, hint: "高频知识点" },
  { id: "qa", label: "课堂问答", icon: Brain, hint: "RAG追问" },
];

const consultantNavItems: Array<{ id: TeacherTab; label: string; icon: LucideIcon; hint: string }> = [
  { id: "overview", label: "系统概览", icon: Eye, hint: "路径与证据" },
  { id: "growth", label: "成长路径", icon: Target, hint: "阶段示意" },
  { id: "outcomes", label: "项目成果", icon: FileCheck2, hint: "成果类型" },
  { id: "portfolioSample", label: "成长档案示例", icon: FileText, hint: "样例展示" },
  { id: "evidenceChain", label: "交付证据链", icon: Network, hint: "可追溯" },
  { id: "parentSample", label: "反馈样例", icon: MessageSquareText, hint: "家长可见" },
];

const ageBands = ["", "L1", "L2", "L3", "L4", "L5"];
const systems = ["", "CIE机器人", "CIE编程Scratch", "CIE编程Python", "CIE编程C++", "GESP"];
const goals = ["兴趣启蒙", "考级", "竞赛", "升学素养", "AI项目"];
const levels = ["未学", "入门", "基础", "进阶"];
const competitionExperience = ["无", "校内活动", "区级比赛", "市级及以上"];
const maturityLevels = ["", "P1", "P2", "P3", "P4"];
const courseSeriesOptions = ["", "LEGO_INVENTOR", "ARCHITECTURE", "MECHANICAL_DESIGN", "SMART_TREE_PROGRAMMING", "AI_KIT", "HYBRID"];
const feedbackTones = ["普通版", "续费沟通版", "竞赛规划版"];
const teacherToolLinks = [
  { label: "互动导入", note: "课前开场", to: "/teacher/interactive-lessons", icon: Presentation },
  { label: "答题审计", note: "正式成绩", to: "/teacher/answer-audit", icon: FileCheck2 },
  { label: "可靠性", note: "课堂采集", to: "/teacher/classroom-audit", icon: ShieldAlert },
  { label: "材料", note: "成果材料", to: "/competition-materials", icon: FileStack },
  { label: "草案提审", note: "事理图谱", to: "/teacher/project-package-review", icon: Send },
  { label: "管理", note: "覆盖缺口", to: "/admin/coverage", icon: BarChart3, adminOnly: true },
  { label: "插件", note: "项目包", to: "/admin/project-plugins", icon: PackageOpen, adminOnly: true },
];

export function TeacherPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedViewMode = normalizeViewMode(searchParams.get("viewMode") ?? searchParams.get("role"));
  const [authUser, setAuthUser] = useState<AuthPermissionResponse | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const allowedViewModes = useMemo(
    () => (authUser?.allowed_view_modes ?? ["public_view"]).map((mode) => normalizeViewMode(mode)),
    [authUser],
  );
  const fallbackViewMode = normalizeViewMode(authUser?.default_view_mode ?? "public_view");
  const viewMode = allowedViewModes.includes(requestedViewMode) ? requestedViewMode : fallbackViewMode;
  const isInternalView = (viewMode === "teacher_view" || viewMode === "admin_view") && Boolean(authUser?.internal_tools_allowed);
  const navItems = isInternalView ? teacherNavItems : consultantNavItems;
  const savedAssessment = useAppStore((state) => state.lastAssessment);
  const [activeTab, setActiveTab] = useState<TeacherTab>(() => (isInternalView ? "progression" : "overview"));
  const requestedTab = normalizeTeacherTab(searchParams.get("tab"));
  const [assessment, setAssessment] = useState<StudentAssessment>(() => savedAssessment ?? defaultAssessment);
  const [classSize, setClassSize] = useState(8);
  const [lessonHours, setLessonHours] = useState(12);
  const [communicationFocus, setCommunicationFocus] = useState("首次沟通");
  const [focusProjectId, setFocusProjectId] = useState("");

  const [lessonPrompt, setLessonPrompt] = useState("给10岁孩子上一节ESP32温湿度传感器课，目标是后面做AIoT项目。");
  const [lessonResult, setLessonResult] = useState<LessonGenerateResponse | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  const [kpQuery, setKpQuery] = useState("Python AI");
  const [kpAgeBand, setKpAgeBand] = useState("L3");
  const [kpSystem, setKpSystem] = useState("");
  const [kpDifficulty, setKpDifficulty] = useState("");
  const [knowledge, setKnowledge] = useState<KnowledgePoint[]>([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [selectedKpId, setSelectedKpId] = useState("KP-ROB-01-001");
  const [teacherView, setTeacherView] = useState<KnowledgePointTeacherView | null>(null);
  const [evidence, setEvidence] = useState<KnowledgeEvidence[]>([]);
  const [patterns, setPatterns] = useState<KnowledgeQuestionPattern[]>([]);
  const [applicationCases, setApplicationCases] = useState<KnowledgeApplicationCase[]>([]);

  const [projectQuery, setProjectQuery] = useState("AIoT");
  const [projectAgeBand, setProjectAgeBand] = useState("L3");
  const [projectMaturity, setProjectMaturity] = useState("");
  const [projectCourseSeries, setProjectCourseSeries] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [workspace, setWorkspace] = useState<TeacherWorkspaceResponse | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({
    student_name: "同学",
    age: 10,
    today_topic: "ESP32温湿度传感器",
    student_performance: "能完成接线和数据读取，但解释传感器数据变化时还需要提示。",
    project_progress: "已经完成基础采集，下一步准备把数据展示到网页看板。",
    next_step: "巩固传感器读取和数据可视化，为AIoT项目做准备。",
    tone: "普通版",
  });
  const [feedbackResult, setFeedbackResult] = useState<ParentFeedbackResponse | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [competitions, setCompetitions] = useState<CompetitionPoint[]>([]);
  const [selectedCompetitionCode, setSelectedCompetitionCode] = useState("NIS");
  const [highFrequency, setHighFrequency] = useState<HighFrequencyKnowledgePoint[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [progression, setProgression] = useState<ClassProgressionAlertResponse | null>(null);
  const [classStatus, setClassStatus] = useState<ClassProgressionStatusResponse | null>(null);
  const [progressionLoading, setProgressionLoading] = useState(false);
  const [alertFilter, setAlertFilter] = useState("");
  const [groupMap, setGroupMap] = useState<GroupCapabilityMapResponse | null>(null);
  const [groupMapLoading, setGroupMapLoading] = useState(false);
  const [teacherContext, setTeacherContext] = useState<TeacherContextResponse | null>(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [classSchedule, setClassSchedule] = useState<TeacherScheduleResponse | null>(null);
  const [classTerms, setClassTerms] = useState<TeacherTerm[]>([]);
  const [operationsLoading, setOperationsLoading] = useState(false);
  const [taskCenter, setTaskCenter] = useState<TeacherTaskCenterResponse | null>(null);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskStatusFilter, setTaskStatusFilter] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("");
  const [markdownflowTaskFilters, setMarkdownflowTaskFilters] = useState({ pattern_type: "", knowledge_point_id: "", error_type: "" });
  const [selectedMarkdownFlowTaskIds, setSelectedMarkdownFlowTaskIds] = useState<string[]>([]);
  const [markdownflowReviewOptions, setMarkdownflowReviewOptions] = useState<MarkdownFlowReviewOptionsResponse | null>(null);
  const [markdownflowNoteTemplateId, setMarkdownflowNoteTemplateId] = useState("completed_pattern_validated");
  const [markdownflowReviewNote, setMarkdownflowReviewNote] = useState("");
  const [markdownflowAssigneeId, setMarkdownflowAssigneeId] = useState("");
  const [markdownflowExportFormat, setMarkdownflowExportFormat] = useState("csv");
  const [markdownflowExportJob, setMarkdownflowExportJob] = useState<AdminExportJob | null>(null);
  const canSwitchToInternal = allowedViewModes.includes("teacher_view") || allowedViewModes.includes("admin_view");
  const currentClassId = teacherContext?.default_class_id ?? null;
  const currentGroupId = teacherContext?.default_group_id ?? null;

  const filteredProjects = useMemo(() => {
    return projectMaturity ? projects.filter((project) => project.maturity_level === projectMaturity) : projects;
  }, [projects, projectMaturity]);

  const selectedCompetition = useMemo(() => {
    return competitions.find((item) => item.competition_code === selectedCompetitionCode) ?? competitions[0] ?? null;
  }, [competitions, selectedCompetitionCode]);

  async function searchKnowledge(nextSelected = true) {
    setKnowledgeLoading(true);
    try {
      const rows = await api.knowledgePoints({
        query: kpQuery,
        age_band: kpAgeBand,
        system: kpSystem,
        difficulty: kpDifficulty ? Number(kpDifficulty) : undefined,
        limit: 80,
      });
      setKnowledge(rows);
      if (nextSelected && rows[0]) setSelectedKpId(rows[0].id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "知识点检索失败");
    } finally {
      setKnowledgeLoading(false);
    }
  }

  async function loadKnowledgeDetail(kpId: string) {
    try {
      const [view, evd, qpt, cases] = await Promise.all([
        api.knowledgePointTeacherView(kpId),
        api.knowledgePointEvidence(kpId),
        api.knowledgePointQuestionPatterns(kpId),
        api.knowledgePointApplicationCases(kpId),
      ]);
      setTeacherView(view);
      setEvidence(evd);
      setPatterns(qpt);
      setApplicationCases(cases);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "知识点详情加载失败");
    }
  }

  async function searchProjects(nextSelected = true) {
    setProjectsLoading(true);
    try {
      const payload = await api.projects({ query: projectQuery, age_band: projectAgeBand, course_series: projectCourseSeries, limit: 120 });
      const rows = payload.items;
      setProjects(rows);
      if (nextSelected && rows[0]) setSelectedProject(rows[0]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "项目检索失败");
    } finally {
      setProjectsLoading(false);
    }
  }

  async function generateLesson() {
    setLessonLoading(true);
    try {
      const result = await api.teacherLessonGenerate({
        prompt: lessonPrompt,
        age_band: kpAgeBand || undefined,
        duration_minutes: 60,
        target_project: focusProjectId || selectedProject?.project_name,
        target_competition: selectedCompetition?.competition_name,
      });
      setLessonResult(result);
      setActiveTab("lesson");
      toast.success("一句话备课已生成");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "一句话备课失败");
    } finally {
      setLessonLoading(false);
    }
  }

  async function generateWorkspace(nextFocusProjectId = focusProjectId) {
    setWorkspaceLoading(true);
    try {
      const result = await api.teacherWorkspace({
        assessment,
        focus_project_id: nextFocusProjectId || null,
        class_size: classSize,
        lesson_hours: lessonHours,
        communication_focus: communicationFocus,
      });
      setWorkspace(result);
      setFocusProjectId(result.focus_project?.project_id ?? nextFocusProjectId);
      if (result.focus_project) setSelectedProject(result.focus_project);
      toast.success("学生路径与教师动作已生成");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "学生路径生成失败");
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function generateFeedback() {
    setFeedbackLoading(true);
    try {
      const result = await api.teacherParentFeedback(feedbackForm);
      setFeedbackResult(result);
      setActiveTab("feedback");
      toast.success("家长反馈已生成");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "家长反馈生成失败");
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function loadSupportData() {
    setSupportLoading(true);
    try {
      const [cmpRows, highRows] = await Promise.all([
        api.competitions({ limit: 500 }),
        api.highFrequencyKnowledgePoints({ limit: 30 }),
      ]);
      setCompetitions(cmpRows);
      setHighFrequency(highRows);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "教研支持数据加载失败");
    } finally {
      setSupportLoading(false);
    }
  }

  async function loadTeacherContext() {
    setContextLoading(true);
    try {
      const result = await api.teacherContext();
      setTeacherContext(result);
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "教师班级上下文加载失败");
      return null;
    } finally {
      setContextLoading(false);
    }
  }

  async function loadProgressionAlerts(classId = currentClassId) {
    if (!classId) return;
    setProgressionLoading(true);
    try {
      const [alerts, status] = await Promise.all([
        api.teacherClassProgressionAlerts(classId),
        api.teacherClassProgressionStatus(classId),
      ]);
      setProgression(alerts);
      setClassStatus(status);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "推进提醒加载失败");
    } finally {
      setProgressionLoading(false);
    }
  }

  async function runBatchProgressionAnalyze() {
    setProgressionLoading(true);
    try {
      const result = await api.teacherBatchAnalyzeProgression();
      setProgression(result);
      setClassStatus(await api.teacherClassProgressionStatus(result.class_id));
      setActiveTab("progression");
      toast.success("已完成班级成长推进分析");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "批量推进分析失败");
    } finally {
      setProgressionLoading(false);
    }
  }

  async function loadGroupCapabilityMap(groupId = currentGroupId) {
    if (!groupId) return;
    setGroupMapLoading(true);
    try {
      const result = await api.teacherGroupCapabilityMap(groupId);
      setGroupMap(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "组内能力分布加载失败");
    } finally {
      setGroupMapLoading(false);
    }
  }

  async function loadClassOperations(classId = currentClassId) {
    if (!classId) return;
    setOperationsLoading(true);
    try {
      const [terms, schedule] = await Promise.all([
        api.teacherClassTerms(classId),
        api.teacherClassSchedule(classId),
      ]);
      setClassTerms(terms);
      setClassSchedule(schedule);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "班级运营数据加载失败");
    } finally {
      setOperationsLoading(false);
    }
  }

  async function loadTeacherTasks(
    classId = currentClassId,
    status = taskStatusFilter,
    taskType = taskTypeFilter,
    mfFilters = markdownflowTaskFilters,
  ) {
    if (!classId) return;
    setTasksLoading(true);
    try {
      const params: Record<string, string | number> = { class_id: classId, limit: 80 };
      if (status) params.status = status;
      if (taskType) params.task_type = taskType;
      if (mfFilters.pattern_type) params.pattern_type = mfFilters.pattern_type;
      if (mfFilters.knowledge_point_id) params.knowledge_point_id = mfFilters.knowledge_point_id;
      if (mfFilters.error_type) params.error_type = mfFilters.error_type;
      const result = await api.teacherTasks(params);
      setTaskCenter(result);
      setSelectedMarkdownFlowTaskIds([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "任务中心加载失败");
    } finally {
      setTasksLoading(false);
    }
  }

  async function loadMarkdownFlowReviewOptions() {
    try {
      const result = await api.teacherMarkdownFlowReviewOptions();
      setMarkdownflowReviewOptions(result);
      setMarkdownflowAssigneeId((current) => current || result.assignees[0]?.user_id || "");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "题型复核选项加载失败");
    }
  }

  async function updateTeacherTaskStatus(task: TeacherTask, status: string) {
    setTasksLoading(true);
    try {
      await api.teacherUpdateTaskStatus(task.task_id, { status, reason: "teacher_console_action" });
      await loadTeacherTasks(task.class_id ?? currentClassId);
      toast.success(status === "completed" ? "任务已完成" : "任务状态已更新");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "任务状态更新失败");
    } finally {
      setTasksLoading(false);
    }
  }

  async function confirmTeacherTask(task: TeacherTask, payload: TeacherTaskConfirmationPayload) {
    setTasksLoading(true);
    try {
      const result = await api.teacherConfirmTask(task.task_id, payload);
      await loadTeacherTasks(task.class_id ?? currentClassId);
      if (result.next_lesson_id || task.next_lesson_id) await loadClassOperations(task.class_id ?? currentClassId);
      toast.success(task.task_type === "parent_feedback_draft" && payload.action === "mark_sent" ? "家长反馈已标记发送" : "任务已确认");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "任务确认失败");
    } finally {
      setTasksLoading(false);
    }
  }

  async function updateMarkdownFlowReviewTasks(status: "completed" | "dismissed") {
    if (selectedMarkdownFlowTaskIds.length === 0) {
      toast.error("请先选择题型复核任务");
      return;
    }
    setTasksLoading(true);
    try {
      const result = await api.teacherMarkdownFlowReviewBulkStatus({
        task_ids: selectedMarkdownFlowTaskIds,
        status,
        note_template_id: templateIdForAction(markdownflowReviewOptions, markdownflowNoteTemplateId, status),
        note: markdownflowReviewNote || null,
      });
      await loadTeacherTasks();
      toast.success(`已更新 ${result.updated_count} 个任务，跳过 ${result.skipped_count} 个`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "题型复核批量处理失败");
    } finally {
      setTasksLoading(false);
    }
  }

  async function assignMarkdownFlowReviewTasks() {
    if (selectedMarkdownFlowTaskIds.length === 0) {
      toast.error("请先选择题型复核任务");
      return;
    }
    if (!markdownflowAssigneeId) {
      toast.error("请先选择负责人");
      return;
    }
    setTasksLoading(true);
    try {
      const result = await api.teacherMarkdownFlowReviewBulkAssign({
        task_ids: selectedMarkdownFlowTaskIds,
        assignee_user_ids: [markdownflowAssigneeId],
        note_template_id: templateIdForAction(markdownflowReviewOptions, markdownflowNoteTemplateId, "assign") ?? "assign_curriculum_lead",
        note: markdownflowReviewNote || null,
      });
      await loadTeacherTasks();
      toast.success(`已分派 ${result.assigned_count} 个任务，跳过 ${result.skipped_count} 个`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "题型复核分派失败");
    } finally {
      setTasksLoading(false);
    }
  }

  async function exportMarkdownFlowReviewTasks() {
    setTasksLoading(true);
    try {
      const job = await api.teacherMarkdownFlowReviewExport({
        format: markdownflowExportFormat,
        task_ids: selectedMarkdownFlowTaskIds,
        class_id: currentClassId,
        task_status: taskStatusFilter || null,
        pattern_type: markdownflowTaskFilters.pattern_type || null,
        knowledge_point_id: markdownflowTaskFilters.knowledge_point_id || null,
        error_type: markdownflowTaskFilters.error_type || null,
        limit: 500,
      });
      setMarkdownflowExportJob(job);
      toast.success(`导出任务 ${job.status}：${job.download_url ? "可下载" : job.job_id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "题型复核导出失败");
    } finally {
      setTasksLoading(false);
    }
  }

  async function downloadMarkdownFlowReviewExport() {
    if (!markdownflowExportJob?.download_url) return;
    setTasksLoading(true);
    try {
      const { blob, filename } = await api.teacherTaskExportJobDownload(markdownflowExportJob.job_id);
      saveBlob(blob, filename);
      toast.success(`已下载 ${filename}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "题型复核导出下载失败");
    } finally {
      setTasksLoading(false);
    }
  }

  async function reloadTeacherOperations(classId = currentClassId, groupId = currentGroupId) {
    const context = await loadTeacherContext();
    const nextClassId = classId ?? context?.default_class_id ?? null;
    const nextGroupId = groupId ?? context?.default_group_id ?? null;
    if (nextClassId) {
      await Promise.all([
        loadProgressionAlerts(nextClassId),
        loadClassOperations(nextClassId),
        loadTeacherTasks(nextClassId),
        loadMarkdownFlowReviewOptions(),
      ]);
    }
    if (nextGroupId) void loadGroupCapabilityMap(nextGroupId);
  }

  function updateAssessment<K extends keyof StudentAssessment>(key: K, value: StudentAssessment[K]) {
    setAssessment((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    api.authMe()
      .then((result) => {
        setAuthUser(result);
        setAuthError(null);
      })
      .catch((err) => {
        setAuthError(err instanceof Error ? err.message : "账号鉴权失败");
        setAuthUser(null);
      });
  }, []);

  useEffect(() => {
    if (!authUser) return;
    if (requestedViewMode !== viewMode) {
      const next = new URLSearchParams(searchParams);
      next.set("viewMode", viewMode);
      setSearchParams(next, { replace: true });
    }
  }, [authUser, requestedViewMode, searchParams, setSearchParams, viewMode]);

  useEffect(() => {
    if (!requestedTab || !navItems.some((item) => item.id === requestedTab)) return;
    setActiveTab(requestedTab);
  }, [requestedTab, viewMode]);

  useEffect(() => {
    if (!authUser) return;
    if (isInternalView) void searchKnowledge();
    void searchProjects();
    void loadSupportData();
    if (isInternalView) {
      void loadTeacherContext().then((context) => {
        if (context?.default_class_id) void loadProgressionAlerts(context.default_class_id);
        if (context?.default_class_id) void loadClassOperations(context.default_class_id);
        if (context?.default_class_id) void loadTeacherTasks(context.default_class_id);
        if (context?.default_class_id) void loadMarkdownFlowReviewOptions();
        if (context?.default_group_id) void loadGroupCapabilityMap(context.default_group_id);
      });
      void generateWorkspace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    if (requestedTab && navItems.some((item) => item.id === requestedTab)) {
      setActiveTab(requestedTab);
    } else if (!navItems.some((item) => item.id === activeTab)) {
      setActiveTab(navItems[0]?.id ?? (isInternalView ? "progression" : "overview"));
    }
    if (isInternalView && !progression) void loadProgressionAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, authUser, requestedTab]);

  useEffect(() => {
    if (selectedKpId && isInternalView) void loadKnowledgeDetail(selectedKpId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKpId, isInternalView]);

  const suggestion = workspace?.teaching_suggestion ?? {};
  const materials = objectValue(suggestion.materials);

  return (
    <div className="min-h-dvh bg-[#F7F8FA]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-lg border border-line bg-ink text-white shadow-subtle">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
                {isInternalView ? <AlertTriangle className="size-4 text-l5-gold" /> : <Eye className="size-4 text-l5-gold" />}
                {isInternalView ? "教师工作台" : "顾问展示模式"}
                <span className="text-white/35">|</span>
                <span>{authUser ? `${authUser.display_name} · ${roleLabel(authUser.role)}` : "权限校验中"}</span>
              </div>
              {authError ? <p className="mt-3 text-sm text-l5-gold">{authError}</p> : null}
              <h1 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">
                {isInternalView ? "班级交付看板" : "学习路径与证据"}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68">
                {isInternalView
                  ? "看提醒、项目组和下一步。"
                  : "只展示路径、项目和成长证据。"}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {isInternalView ? (
                  <>
                    <Button onClick={runBatchProgressionAnalyze} disabled={progressionLoading} type="button" className="bg-white text-ink hover:bg-white/90">
                      {progressionLoading ? <RefreshCw className="size-4 animate-spin" /> : <AlertTriangle className="size-4" />}
                      批量推进分析
                    </Button>
                    <Button variant="secondary" onClick={() => setActiveTab("progression")} type="button" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      提醒
                    </Button>
                    <ButtonLink to="/teacher/lesson-builder?viewMode=teacher_view" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      备课
                    </ButtonLink>
                    <ButtonLink to="/teacher/lesson-plans" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      教案中心
                    </ButtonLink>
                    <ButtonLink to="/teacher/interactive-lessons" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      互动导入
                    </ButtonLink>
                    <ButtonLink to="/teacher/parent-message" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      家长话术
                    </ButtonLink>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => setActiveTab("growth")} type="button" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      成长路径
                    </Button>
                    <Button variant="secondary" onClick={() => setActiveTab("evidenceChain")} type="button" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      证据链概览
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="grid gap-3 rounded-lg border border-white/15 bg-white/10 p-4">
              <WhiteStat label={isInternalView ? "开放提醒" : "路径阶段"} value={isInternalView ? `${classStatus?.open_alert_count ?? progression?.summary.total_alerts ?? 0}` : "L1-L5"} />
              <WhiteStat label={isInternalView ? "影响学生" : "项目成果"} value={isInternalView ? `${classStatus?.affected_student_count ?? 0}` : "作品/报告"} />
              <WhiteStat label={isInternalView ? "待处理" : "覆盖情况"} value={isInternalView ? `${taskCenter?.open_count ?? classStatus?.plan_status_summary.pending_count ?? progression?.plan_status_summary.pending_count ?? 0}` : "可见"} />
              <WhiteStat label={isInternalView ? "已完成" : "隐私边界"} value={isInternalView ? `${classStatus?.plan_status_summary.completed_count ?? progression?.plan_status_summary.completed_count ?? 0}` : "隔离"} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[240px_1fr_300px]">
          <aside className="grid content-start gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-ink">入口</h2>
                  {isInternalView || canSwitchToInternal ? (
                    <button
                      type="button"
                      className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-muted transition hover:border-ink hover:text-ink"
                      onClick={() => {
                        const next = new URLSearchParams(searchParams);
                        const targetMode = isInternalView
                          ? "consultant_view"
                          : allowedViewModes.includes("teacher_view")
                            ? "teacher_view"
                            : allowedViewModes.includes("admin_view")
                              ? "admin_view"
                              : viewMode;
                        next.set("viewMode", targetMode);
                        setSearchParams(next);
                      }}
                    >
                      {isInternalView ? "顾问展示" : "教师视图"}
                    </button>
                  ) : (
                    <Badge>后端授权</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-2 p-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-left transition",
                      activeTab === item.id ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className={cn("mt-0.5 block text-xs", activeTab === item.id ? "text-white/60" : "text-muted")}>{item.hint}</span>
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {isInternalView ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="size-5 text-l3-teal" />
                    <h2 className="font-semibold text-ink">学生画像</h2>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField label="年龄" value={assessment.age} min={3} max={18} onChange={(value) => updateAssessment("age", value)} />
                    <TextField label="年级" value={assessment.grade} onChange={(value) => updateAssessment("grade", value)} />
                  </div>
                  <SelectField label="目标方向" value={assessment.goal_direction} options={goals} onChange={(value) => updateAssessment("goal_direction", value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField label="Scratch" value={assessment.scratch_level} options={levels} onChange={(value) => updateAssessment("scratch_level", value)} />
                    <SelectField label="Python" value={assessment.python_level} options={levels} onChange={(value) => updateAssessment("python_level", value)} />
                    <SelectField label="C++" value={assessment.cpp_level} options={levels} onChange={(value) => updateAssessment("cpp_level", value)} />
                    <SelectField label="机器人" value={assessment.robot_level} options={levels} onChange={(value) => updateAssessment("robot_level", value)} />
                  </div>
                  <SelectField label="比赛经历" value={assessment.competition_experience} options={competitionExperience} onChange={(value) => updateAssessment("competition_experience", value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField label="周学习" value={assessment.weekly_hours} min={0} max={30} step={0.5} onChange={(value) => updateAssessment("weekly_hours", value)} />
                    <NumberField label="班级人数" value={classSize} min={1} max={40} onChange={setClassSize} />
                  </div>
                  <NumberField label="本轮学时" value={lessonHours} min={1} max={80} onChange={setLessonHours} />
                  <TextAreaField label="家长期望" value={assessment.parent_expectation} onChange={(value) => updateAssessment("parent_expectation", value)} />
                  <TextField label="沟通场景" value={communicationFocus} onChange={setCommunicationFocus} />
                  <Button onClick={() => generateWorkspace()} disabled={workspaceLoading} type="button">
                    {workspaceLoading ? "生成中" : "生成路径"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ConsultantSafeOverviewCard />
            )}
          </aside>

          <main className="grid content-start gap-5">
            <QuickActions
              internal={isInternalView}
              onLesson={() => setActiveTab("lesson")}
              onKnowledge={() => setActiveTab("knowledge")}
              onProjects={() => setActiveTab(isInternalView ? "projects" : "outcomes")}
              onFeedback={() => setActiveTab(isInternalView ? "feedback" : "parentSample")}
              onCompetition={() => setActiveTab("competition")}
              onCoverage={() => setActiveTab(isInternalView ? "coverage" : "evidenceChain")}
              onProgression={() => setActiveTab("progression")}
              onStudent={() => setActiveTab(isInternalView ? "student" : "growth")}
              onBatchAnalyze={runBatchProgressionAnalyze}
            />

            {!isInternalView ? (
              <ConsultantPanel tab={activeTab} workspace={workspace} projects={filteredProjects} highFrequency={highFrequency} />
            ) : null}

            {isInternalView && activeTab === "classes" ? (
              <ClassDeliveryPanel
                progression={progression}
                classStatus={classStatus}
                schedule={classSchedule}
                terms={classTerms}
                loading={progressionLoading || contextLoading || operationsLoading}
                reload={() => reloadTeacherOperations()}
                classId={currentClassId}
                context={teacherContext}
              />
            ) : null}

            {isInternalView && activeTab === "groups" ? (
              <GroupCapabilityPanel groupMap={groupMap} loading={groupMapLoading || contextLoading || operationsLoading} reload={() => reloadTeacherOperations()} groupId={currentGroupId} context={teacherContext} classId={currentClassId} />
            ) : null}

            {isInternalView && activeTab === "progression" ? (
              <ProgressionPanel
                progression={progression}
                classStatus={classStatus}
                loading={progressionLoading}
                alertFilter={alertFilter}
                setAlertFilter={setAlertFilter}
                reload={() => loadProgressionAlerts()}
                batchAnalyze={runBatchProgressionAnalyze}
              />
            ) : null}

            {isInternalView && activeTab === "tasks" ? (
              <TeacherTaskCenterPanel
                taskCenter={taskCenter}
                loading={tasksLoading}
                statusFilter={taskStatusFilter}
                setStatusFilter={setTaskStatusFilter}
                taskTypeFilter={taskTypeFilter}
                setTaskTypeFilter={setTaskTypeFilter}
                markdownflowFilters={markdownflowTaskFilters}
                setMarkdownflowFilters={setMarkdownflowTaskFilters}
                markdownflowReviewOptions={markdownflowReviewOptions}
                noteTemplateId={markdownflowNoteTemplateId}
                setNoteTemplateId={setMarkdownflowNoteTemplateId}
                reviewNote={markdownflowReviewNote}
                setReviewNote={setMarkdownflowReviewNote}
                assigneeId={markdownflowAssigneeId}
                setAssigneeId={setMarkdownflowAssigneeId}
                exportFormat={markdownflowExportFormat}
                setExportFormat={setMarkdownflowExportFormat}
                exportJob={markdownflowExportJob}
                selectedMarkdownFlowTaskIds={selectedMarkdownFlowTaskIds}
                setSelectedMarkdownFlowTaskIds={setSelectedMarkdownFlowTaskIds}
                reload={(status, taskType, mfFilters) => loadTeacherTasks(currentClassId, status ?? taskStatusFilter, taskType ?? taskTypeFilter, mfFilters ?? markdownflowTaskFilters)}
                updateStatus={updateTeacherTaskStatus}
                confirmTask={confirmTeacherTask}
                bulkUpdateMarkdownflow={updateMarkdownFlowReviewTasks}
                assignMarkdownflow={assignMarkdownFlowReviewTasks}
                exportMarkdownflow={exportMarkdownFlowReviewTasks}
                downloadMarkdownflowExport={downloadMarkdownFlowReviewExport}
              />
            ) : null}

            {isInternalView && activeTab === "lesson" ? (
              <LessonPanel result={lessonResult} loading={lessonLoading} prompt={lessonPrompt} setPrompt={setLessonPrompt} generateLesson={generateLesson} />
            ) : null}

            {isInternalView && activeTab === "knowledge" ? (
              <KnowledgePanel
                query={kpQuery}
                setQuery={setKpQuery}
                ageBand={kpAgeBand}
                setAgeBand={setKpAgeBand}
                system={kpSystem}
                setSystem={setKpSystem}
                difficulty={kpDifficulty}
                setDifficulty={setKpDifficulty}
                knowledge={knowledge}
                selectedKpId={selectedKpId}
                setSelectedKpId={setSelectedKpId}
                searchKnowledge={searchKnowledge}
                loading={knowledgeLoading}
                teacherView={teacherView}
                evidence={evidence}
                patterns={patterns}
                applicationCases={applicationCases}
              />
            ) : null}

            {isInternalView && activeTab === "projects" ? (
              <ProjectsPanel
                query={projectQuery}
                setQuery={setProjectQuery}
                ageBand={projectAgeBand}
                setAgeBand={setProjectAgeBand}
                maturity={projectMaturity}
                setMaturity={setProjectMaturity}
                courseSeries={projectCourseSeries}
                setCourseSeries={setProjectCourseSeries}
                projects={filteredProjects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                searchProjects={searchProjects}
                loading={projectsLoading}
                setAsFocus={(project) => {
                  setSelectedProject(project);
                  setFocusProjectId(project.project_id);
                  void generateWorkspace(project.project_id);
                }}
              />
            ) : null}

            {isInternalView && activeTab === "student" ? (
              <StudentPortraitPanel progression={progression} classStatus={classStatus} workspace={workspace} loading={progressionLoading || workspaceLoading || contextLoading} context={teacherContext} />
            ) : null}

            {isInternalView && activeTab === "plan" ? (
              <StudentPathPanel workspace={workspace} loading={workspaceLoading} generateWorkspace={() => generateWorkspace()} suggestion={suggestion} materials={materials} />
            ) : null}

            {isInternalView && activeTab === "deliverables" ? (
              <DeliverablesPanel workspace={workspace} projects={filteredProjects} />
            ) : null}

            {isInternalView && activeTab === "imports" ? (
              <ImportExportPanel
                classId={currentClassId}
                defaultStudentId={teacherContext?.default_student_id ?? null}
                onImported={() => {
                  void loadProgressionAlerts();
                  void loadTeacherContext();
                  void loadClassOperations();
                }}
              />
            ) : null}

            {isInternalView && activeTab === "feedback" ? (
              <FeedbackPanel
                form={feedbackForm}
                setForm={setFeedbackForm}
                result={feedbackResult}
                loading={feedbackLoading}
                generateFeedback={generateFeedback}
              />
            ) : null}

            {isInternalView && activeTab === "competition" ? (
              <CompetitionPanel
                competitions={competitions}
                selectedCode={selectedCompetitionCode}
                setSelectedCode={setSelectedCompetitionCode}
                selectedCompetition={selectedCompetition}
                projects={filteredProjects}
                ageBand={projectAgeBand}
              />
            ) : null}

            {isInternalView && activeTab === "coverage" ? (
              <CoveragePanel highFrequency={highFrequency} loading={supportLoading} competitions={competitions} />
            ) : null}

            {isInternalView && activeTab === "qa" ? <ClassroomQaPanel selectedKp={teacherView?.knowledge_point ?? null} selectedProject={selectedProject} /> : null}
          </main>

          <aside className="grid content-start gap-4">
            {isInternalView ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-ink">课后任务</h2>
                      <p className="mt-1 text-sm text-muted">{taskCenter?.open_count ?? 0} 个待处理</p>
                    </div>
                    <Button variant="secondary" onClick={() => setActiveTab("tasks")} type="button" className="h-9">查看</Button>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    {tasksLoading && !taskCenter ? <LoadingState label="任务加载中" /> : null}
                    {taskCenter?.tasks.filter((task) => task.status !== "completed").slice(0, 3).map((task) => (
                      <button
                        key={task.task_id}
                        type="button"
                        className="rounded-md border border-line bg-canvas p-3 text-left transition hover:border-ink"
                        onClick={() => setActiveTab("tasks")}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>{teacherTaskTypeLabel(task.task_type)}</Badge>
                          <span className="tag bg-white">{teacherTaskStatusLabel(task.status)}</span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm font-medium text-ink">{task.title}</p>
                      </button>
                    ))}
                    {taskCenter && taskCenter.tasks.filter((task) => task.status !== "completed").length === 0 ? <EmptyState title="暂无待处理任务" /> : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="font-semibold text-ink">当前动作</h2>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <ActionLine label="当前知识点" value={teacherView?.knowledge_point.name ?? "未选择"} />
                    <ActionLine label="当前项目" value={selectedProject?.project_name ?? workspace?.focus_project?.project_name ?? "未选择"} />
                    <ActionLine label="当前竞赛" value={selectedCompetition?.competition_name ?? "未选择"} />
                    <Button variant="secondary" onClick={() => setActiveTab("knowledge")} type="button">看知识点</Button>
                    <Button variant="secondary" onClick={() => setActiveTab("progression")} type="button">看推进提醒</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="font-semibold text-ink">工具</h2>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    {teacherToolLinks.filter((item) => !item.adminOnly || authUser?.admin_tools_allowed).map((item) => (
                      <ButtonLink key={item.to} to={item.to} variant="secondary" className="h-auto justify-start px-3 py-3">
                        <item.icon className="size-4 shrink-0" />
                        <span className="text-left">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className="block text-xs text-muted">{item.note}</span>
                        </span>
                      </ButtonLink>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="font-semibold text-ink">高频知识点</h2>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {highFrequency.slice(0, 5).map((item) => (
                      <button
                        key={item.knowledge_point_id}
                        type="button"
                        className="rounded-lg border border-line bg-canvas p-3 text-left transition hover:border-ink"
                        onClick={() => {
                          setSelectedKpId(item.knowledge_point_id);
                          setActiveTab("knowledge");
                        }}
                      >
                        <p className="font-semibold text-ink">{item.name}</p>
                        <p className="mt-1 font-mono text-xs text-muted">{item.knowledge_point_id}</p>
                        <p className="mt-2 text-xs text-muted">综合重要度 {item.overall_importance_score}</p>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="grid gap-3">
                    <p className="font-semibold text-ink">高级问答</p>
                    <p className="text-sm leading-6 text-muted">进入 RAG，追问知识点、项目和引用。</p>
                    <ButtonLink to="/rag-demo" variant="secondary">
                      打开 RAG Demo
                    </ButtonLink>
                  </CardContent>
                </Card>
              </>
            ) : (
              <ConsultantBoundaryCard />
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

function QuickActions({
  internal,
  onLesson,
  onKnowledge,
  onProjects,
  onFeedback,
  onCompetition,
  onCoverage,
  onProgression,
  onStudent,
  onBatchAnalyze,
}: {
  internal: boolean;
  onLesson: () => void;
  onKnowledge: () => void;
  onProjects: () => void;
  onFeedback: () => void;
  onCompetition: () => void;
  onCoverage: () => void;
  onProgression: () => void;
  onStudent: () => void;
  onBatchAnalyze: () => void;
}) {
  const internalActions = [
    { label: "提醒", icon: AlertTriangle, onClick: onProgression },
    { label: "学生", icon: UserRound, onClick: onStudent },
    { label: "知识预警", icon: BookOpenCheck, onClick: onProgression },
    { label: "推进计划", icon: ClipboardList, onClick: onBatchAnalyze },
    { label: "导入", icon: Presentation, to: "/teacher/interactive-lessons" },
    { label: "项目", icon: LibraryBig, onClick: onProjects },
    { label: "备课", icon: Sparkles, onClick: onLesson },
    { label: "反馈", icon: MessageSquareText, onClick: onFeedback },
    { label: "竞赛", icon: GraduationCap, onClick: onCompetition },
    { label: "覆盖", icon: BarChart3, onClick: onCoverage },
    { label: "反推", icon: Network, onClick: onProjects },
    { label: "知识点", icon: BookOpenCheck, onClick: onKnowledge },
  ];
  const publicActions = [
    { label: "成长", icon: Target, onClick: onStudent },
    { label: "成果", icon: FileCheck2, onClick: onProjects },
    { label: "证据链", icon: Network, onClick: onCoverage },
    { label: "反馈", icon: MessageSquareText, onClick: onFeedback },
  ];
  const actions = internal ? internalActions : publicActions;
  return (
    <section className="grid gap-3 md:grid-cols-4 xl:grid-cols-6">
      {actions.map((item) => (
        "to" in item && item.to ? (
          <Link key={item.label} to={item.to} className="flex min-h-[104px] flex-col justify-between rounded-lg border border-line bg-white p-4 text-left shadow-subtle transition hover:-translate-y-0.5 hover:border-ink">
            <item.icon className="size-5 text-ink" />
            <p className="text-sm font-semibold leading-5 text-ink">{item.label}</p>
          </Link>
        ) : (
          <button key={item.label} type="button" onClick={item.onClick} className="flex min-h-[104px] flex-col justify-between rounded-lg border border-line bg-white p-4 text-left shadow-subtle transition hover:-translate-y-0.5 hover:border-ink">
            <item.icon className="size-5 text-ink" />
            <p className="text-sm font-semibold leading-5 text-ink">{item.label}</p>
          </button>
        )
      ))}
    </section>
  );
}

function ProgressionPanel({
  progression,
  classStatus,
  loading,
  alertFilter,
  setAlertFilter,
  reload,
  batchAnalyze,
}: {
  progression: ClassProgressionAlertResponse | null;
  classStatus: ClassProgressionStatusResponse | null;
  loading: boolean;
  alertFilter: string;
  setAlertFilter: (value: string) => void;
  reload: () => void;
  batchAnalyze: () => void;
}) {
  const summary = progression?.summary;
  const alerts = (progression?.alerts ?? []).filter((alert) => !alertFilter || alert.alert_type === alertFilter);
  const studentStatuses = (classStatus?.students ?? []).slice().sort((left, right) => right.open_alert_count - left.open_alert_count || left.student_id.localeCompare(right.student_id));
  return (
    <section className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-5">
        <Metric label="重复" value={`${summary?.repeated_knowledge_count ?? 0}`} icon={BookOpenCheck} />
        <Metric label="可升级" value={`${summary?.ready_to_advance_count ?? 0}`} icon={Target} />
        <Metric label="缺前置" value={`${summary?.missing_prerequisite_count ?? 0}`} icon={ShieldAlert} />
        <Metric label="单一" value={`${summary?.narrow_project_scope_count ?? 0}`} icon={Layers3} />
        <Metric label="未更新" value={`${summary?.stale_progress_count ?? 0}`} icon={AlertTriangle} />
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="班级学生" value={`${classStatus?.student_count ?? 0}`} icon={Users} />
        <Metric label="影响学生" value={`${classStatus?.affected_student_count ?? 0}`} icon={ShieldAlert} />
        <Metric label="待执行" value={`${classStatus?.plan_status_summary.pending_count ?? progression?.plan_status_summary.pending_count ?? 0}`} icon={ClipboardList} />
        <Metric label="已完成计划" value={`${classStatus?.plan_status_summary.completed_count ?? progression?.plan_status_summary.completed_count ?? 0}`} icon={FileCheck2} />
      </section>
      {classStatus ? (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">班级状态</h2>
            <p className="mt-1 text-sm text-muted">按学生汇总开放提醒、知识点推进和计划执行。</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {studentStatuses.slice(0, 6).map((student) => (
              <Link key={student.student_id} to={`/teacher/students/${student.student_id}`} className="grid gap-3 rounded-lg border border-line bg-canvas p-4 transition hover:border-ink md:grid-cols-[1fr_auto_auto_auto] md:items-center">
                <div>
                  <p className="font-semibold text-ink">{student.student_name ?? student.student_id}</p>
                  <p className="mt-1 font-mono text-xs text-muted">{student.student_id} · {student.current_stage ?? "未分级"}</p>
                </div>
                <span className="tag bg-white">提醒 {student.open_alert_count}</span>
                <span className="tag bg-white">重复 {student.repeated_knowledge_point_count}</span>
                <span className="tag bg-white">计划 {student.pending_plan_count}/{student.completed_plan_count}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-ink">推进提醒</h2>
            <p className="mt-1 text-sm text-muted">基于知识图谱识别重复覆盖、缺失前置、成熟度升级和长期未更新。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={reload} disabled={loading} type="button">
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              刷新
            </Button>
            <Button onClick={batchAnalyze} disabled={loading} type="button">
              {loading ? "分析中" : "批量分析"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setAlertFilter("")} className={cn("tag", alertFilter === "" ? "bg-ink text-white" : "bg-canvas")}>全部</button>
            {(progression?.filter_options ?? []).map((item) => (
              <button
                key={String(item.value)}
                type="button"
                onClick={() => setAlertFilter(String(item.value))}
                className={cn("tag", alertFilter === item.value ? "bg-ink text-white" : "bg-canvas")}
              >
                {String(item.label)}
              </button>
            ))}
          </div>
          {loading ? <LoadingState label="推进提醒加载中" /> : null}
          {!loading && alerts.length === 0 ? <EmptyState title="暂无开放提醒" description="可点击批量分析刷新学生项目记录。" /> : null}
          <div className="grid gap-3">
            {alerts.map((alert) => (
              <ProgressionAlertCard key={alert.alert_id} alert={alert} onChanged={reload} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ProgressionAlertCard({ alert, onChanged }: { alert: StudentProgressionAlert; onChanged: () => void }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-subtle">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{alert.severity}</Badge>
        <span className="tag bg-canvas">{alertTypeLabel(alert.alert_type)}</span>
        <span className="font-mono text-xs text-muted">{alert.student_id}</span>
      </div>
      <h3 className="mt-3 font-semibold text-ink">{alert.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{alert.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {alert.recommended_actions.slice(0, 4).map((action) => (
          <span key={`${alert.alert_id}-${action.type}-${action.label}`} className="tag bg-canvas">
            {action.label}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ButtonLink to={`/teacher/students/${alert.student_id}`} variant="secondary">学生成长推进</ButtonLink>
        {alert.class_id ? <ButtonLink to={`/teacher/classes/${encodeURIComponent(alert.class_id)}`} variant="secondary">班级提醒</ButtonLink> : null}
      </div>
      <div className="mt-4">
        <ProgressionAlertActions alert={alert} onChanged={onChanged} />
      </div>
    </div>
  );
}

function ClassDeliveryPanel({
  progression,
  classStatus,
  schedule,
  terms,
  loading,
  reload,
  classId,
  context,
}: {
  progression: ClassProgressionAlertResponse | null;
  classStatus: ClassProgressionStatusResponse | null;
  schedule: TeacherScheduleResponse | null;
  terms: TeacherTerm[];
  loading: boolean;
  reload: () => void;
  classId: string | null;
  context: TeacherContextResponse | null;
}) {
  const summary = progression?.summary;
  const currentClass = context?.classes.find((item) => item.class_id === classId) ?? context?.classes[0] ?? null;
  const classGroups = (context?.groups ?? []).filter((item) => item.class_id === currentClass?.class_id && item.term_id === currentClass?.term_id);
  const [selectedTermId, setSelectedTermId] = useState(currentClass?.term_id ?? "");
  const [lessonForm, setLessonForm] = useState({
    lesson_title: "项目推进课",
    start_at: "2026-05-20 18:30",
    end_at: "2026-05-20 20:00",
    group_id: "",
    project_id: "",
    project_name: "",
    knowledge_point_ids: "KP-AICOMP-L3-001",
    lesson_objective: "完成项目组分工、课堂记录和下一步交付物确认。",
    deliverables: "课堂记录,项目报告片段",
    materials: "项目材料,课堂设备",
  });
  const [busyAction, setBusyAction] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTermId(currentClass?.term_id ?? "");
  }, [currentClass?.term_id]);

  async function switchTerm() {
    if (!currentClass || !selectedTermId || selectedTermId === currentClass.term_id) return;
    setBusyAction("term");
    try {
      await api.teacherSwitchClassTerm(currentClass.class_id, { term_id: selectedTermId, note: "教师台学期切换" });
      toast.success("学期已切换");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "学期切换失败");
    } finally {
      setBusyAction(null);
    }
  }

  async function createLesson() {
    if (!currentClass) return;
    setBusyAction("lesson");
    try {
      await api.teacherCreateScheduleLesson(currentClass.class_id, {
        lesson_title: lessonForm.lesson_title,
        start_at: lessonForm.start_at || null,
        end_at: lessonForm.end_at || null,
        group_id: lessonForm.group_id || null,
        project_id: lessonForm.project_id || null,
        project_name: lessonForm.project_name || null,
        knowledge_point_ids: splitListInput(lessonForm.knowledge_point_ids),
        lesson_objective: lessonForm.lesson_objective,
        deliverables: splitListInput(lessonForm.deliverables),
        materials: splitListInput(lessonForm.materials),
      });
      toast.success("课次已写入正式课表");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "课次保存失败");
    } finally {
      setBusyAction(null);
    }
  }

  async function markLessonDone(lessonId: string) {
    setBusyAction(lessonId);
    try {
      await api.teacherUpdateScheduleLesson(lessonId, { status: "completed", notes: "教师台标记完成" });
      toast.success("课次状态已更新");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "课次状态更新失败");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="开放提醒" value={`${classStatus?.open_alert_count ?? summary?.total_alerts ?? 0}`} icon={AlertTriangle} />
        <Metric label="影响学生" value={`${classStatus?.affected_student_count ?? 0}`} icon={Users} />
        <Metric label="待执行" value={`${classStatus?.plan_status_summary.pending_count ?? progression?.plan_status_summary.pending_count ?? 0}`} icon={ClipboardList} />
        <Metric label="待升级" value={`${summary?.maturity_upgrade_needed_count ?? 0}`} icon={Layers3} />
      </section>
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-ink">班级交付</h2>
            <p className="mt-1 text-sm text-muted">{currentClass ? `${currentClass.class_name} · ${currentClass.student_count}名学生 · ${currentClass.group_count}组` : "班级、项目组、证据。"}</p>
          </div>
          <Button onClick={reload} disabled={loading} type="button">
            {loading ? "刷新中" : "刷新提醒"}
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <MappedCard title="真实班级" items={(context?.classes ?? []).map((item) => `${item.class_name}｜${item.class_id}`)} fallback="暂无可访问班级" />
          <MappedCard title="计划状态" items={[
            `待执行 ${classStatus?.plan_status_summary.pending_count ?? 0}`,
            `已完成 ${classStatus?.plan_status_summary.completed_count ?? 0}`,
            `已取消 ${classStatus?.plan_status_summary.canceled_count ?? 0}`,
          ]} />
          <MappedCard title="学生状态" items={(classStatus?.students ?? []).slice(0, 5).map((item) => `${item.student_name ?? item.student_id}｜提醒${item.open_alert_count}｜待办${item.pending_plan_count}`)} fallback="暂无学生状态" />
          {classId ? <ButtonLink to={`/teacher/classes/${encodeURIComponent(classId)}`} variant="secondary">打开班级推进页</ButtonLink> : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink">学期与正式课表</h2>
              <p className="mt-1 text-sm text-muted">{currentClass ? `${currentClass.term_label} · ${schedule?.lesson_count ?? 0} 个课次` : "暂无班级"}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{schedule?.term_id ?? currentClass?.term_id ?? "--"}</Badge>
              {classId ? (
                <ButtonLink to={`/teacher/classroom-audit?class_id=${encodeURIComponent(classId)}&term_id=${encodeURIComponent(schedule?.term_id ?? currentClass?.term_id ?? "")}`} variant="secondary" className="h-9">
                  <BarChart3 className="size-4" />
                  采集可靠性
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <SelectBare
              value={selectedTermId}
              onChange={setSelectedTermId}
              options={terms.map((term) => term.term_id)}
              emptyLabel="选择学期"
              labels={Object.fromEntries(terms.map((term) => [term.term_id, term.term_label]))}
            />
            <Button onClick={switchTerm} disabled={loading || Boolean(busyAction) || selectedTermId === currentClass?.term_id} type="button">
              {busyAction === "term" ? <RefreshCw className="size-4 animate-spin" /> : <CalendarDays className="size-4" />}
              切换学期
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(schedule?.lessons ?? []).map((lesson) => (
              <div key={lesson.lesson_id} className="rounded-lg border border-line bg-canvas p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>第{lesson.lesson_no}课</Badge>
                  <span className="tag bg-white">{lesson.status}</span>
                  <span className="font-mono text-xs text-muted">{lesson.lesson_id}</span>
                </div>
                <h3 className="mt-3 font-semibold text-ink">{lesson.lesson_title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{lesson.start_at ?? "未定时间"} · {lesson.duration_minutes}分钟</p>
                <p className="mt-2 text-sm leading-6 text-muted">{lesson.lesson_objective ?? lesson.project_name ?? "项目推进课"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lesson.knowledge_point_ids.slice(0, 4).map((kpId) => <span key={`${lesson.lesson_id}-${kpId}`} className="tag bg-white">{kpId}</span>)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ButtonLink to={`/teacher/classroom/${encodeURIComponent(lesson.lesson_id)}`} variant="secondary">
                    <Eye className="size-4" />
                    进入课堂
                  </ButtonLink>
                  {lesson.status !== "completed" ? (
                    <Button variant="secondary" onClick={() => markLessonDone(lesson.lesson_id)} disabled={Boolean(busyAction)} type="button">
                      {busyAction === lesson.lesson_id ? <RefreshCw className="size-4 animate-spin" /> : <FileCheck2 className="size-4" />}
                      完成
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          {!loading && (schedule?.lessons ?? []).length === 0 ? <EmptyState title="当前学期暂无课次" description="保存第一节正式课后，推进提醒和项目组会进入同一运营流。" /> : null}
          <div className="rounded-lg border border-line bg-canvas p-4">
            <h3 className="font-semibold text-ink">新增课次</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <TextField label="课次标题" value={lessonForm.lesson_title} onChange={(value) => setLessonForm((current) => ({ ...current, lesson_title: value }))} />
              <SelectBare
                value={lessonForm.group_id}
                onChange={(value) => {
                  const group = classGroups.find((item) => item.group_id === value);
                  setLessonForm((current) => ({
                    ...current,
                    group_id: value,
                    project_id: group?.project_id ?? current.project_id,
                    project_name: group?.project_name ?? current.project_name,
                  }));
                }}
                options={["", ...classGroups.map((item) => item.group_id)]}
                emptyLabel="关联项目组"
                labels={Object.fromEntries(classGroups.map((item) => [item.group_id, item.group_name]))}
              />
              <TextField label="开始时间" value={lessonForm.start_at} onChange={(value) => setLessonForm((current) => ({ ...current, start_at: value }))} />
              <TextField label="结束时间" value={lessonForm.end_at} onChange={(value) => setLessonForm((current) => ({ ...current, end_at: value }))} />
              <TextField label="项目ID" value={lessonForm.project_id} onChange={(value) => setLessonForm((current) => ({ ...current, project_id: value }))} />
              <TextField label="项目名称" value={lessonForm.project_name} onChange={(value) => setLessonForm((current) => ({ ...current, project_name: value }))} />
              <TextField label="知识点ID" value={lessonForm.knowledge_point_ids} onChange={(value) => setLessonForm((current) => ({ ...current, knowledge_point_ids: value }))} />
              <TextField label="交付物" value={lessonForm.deliverables} onChange={(value) => setLessonForm((current) => ({ ...current, deliverables: value }))} />
            </div>
            <div className="mt-3">
              <TextAreaField label="课堂目标" value={lessonForm.lesson_objective} onChange={(value) => setLessonForm((current) => ({ ...current, lesson_objective: value }))} />
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={createLesson} disabled={Boolean(busyAction) || !lessonForm.lesson_title.trim()} type="button">
                {busyAction === "lesson" ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                保存课次
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function GroupCapabilityPanel({
  groupMap,
  loading,
  reload,
  groupId,
  context,
  classId,
}: {
  groupMap: GroupCapabilityMapResponse | null;
  loading: boolean;
  reload: () => void;
  groupId: string | null;
  context: TeacherContextResponse | null;
  classId: string | null;
}) {
  const currentGroup = context?.groups.find((item) => item.group_id === groupId) ?? context?.groups[0] ?? null;
  const currentClass = context?.classes.find((item) => item.class_id === classId) ?? context?.classes[0] ?? null;
  const classStudents = (context?.students ?? []).filter((item) => item.class_id === currentClass?.class_id);
  const [groupForm, setGroupForm] = useState({
    group_name: "新项目组",
    project_id: "KP-SET-L3-003-B",
    project_name: "AIoT智能环境监测站",
    current_maturity_level: "P2",
    total_hours: 8,
    course_track: "AIoT,项目报告",
  });
  const [memberForm, setMemberForm] = useState({
    student_id: classStudents[0]?.student_id ?? "",
    member_role: "项目成员",
    responsibility: "负责课堂记录和项目交付物整理",
    capability_focus: "数据与证据能力,项目表达",
  });
  const [busyAction, setBusyAction] = useState<string | null>(null);

  useEffect(() => {
    if (!memberForm.student_id && classStudents[0]?.student_id) {
      setMemberForm((current) => ({ ...current, student_id: classStudents[0].student_id }));
    }
  }, [classStudents, memberForm.student_id]);

  async function createGroup() {
    if (!currentClass) return;
    setBusyAction("group");
    try {
      await api.teacherCreateProjectGroup(currentClass.class_id, {
        group_name: groupForm.group_name,
        project_id: groupForm.project_id || null,
        project_name: groupForm.project_name || null,
        current_maturity_level: groupForm.current_maturity_level,
        total_hours: groupForm.total_hours,
        course_track: splitListInput(groupForm.course_track),
      });
      toast.success("项目组已创建");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "项目组创建失败");
    } finally {
      setBusyAction(null);
    }
  }

  async function updateGroup(group: TeacherProjectGroup) {
    setBusyAction(`group_${group.group_id}`);
    try {
      await api.teacherUpdateProjectGroup(group.group_id, {
        current_maturity_level: nextMaturityLevel(group.current_maturity_level),
        notes: "教师台项目组成熟度更新",
      });
      toast.success("项目组已更新");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "项目组更新失败");
    } finally {
      setBusyAction(null);
    }
  }

  async function addMember() {
    if (!currentGroup || !memberForm.student_id) return;
    setBusyAction("member");
    try {
      await api.teacherUpsertGroupMember(currentGroup.group_id, {
        student_id: memberForm.student_id,
        member_role: memberForm.member_role,
        responsibility: memberForm.responsibility,
        capability_focus: splitListInput(memberForm.capability_focus),
      });
      toast.success("项目组成员已保存");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "成员保存失败");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-ink">组内能力分布</h2>
            <p className="mt-1 text-sm text-muted">{currentGroup ? `${currentGroup.group_name} · ${currentGroup.member_count}名成员 · ${currentGroup.current_maturity_level}` : "查看知识点覆盖热力、重复覆盖和下一阶段分工建议。"}</p>
          </div>
          <Button onClick={reload} disabled={loading} type="button">
            {loading ? "加载中" : "刷新"}
          </Button>
        </CardHeader>
        <CardContent className="grid gap-5">
          {loading ? <LoadingState label="组内能力加载中" /> : null}
          {!loading && !groupMap ? <EmptyState title="暂无组内能力数据" /> : null}
          {groupMap ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <MappedCard title="能力热力" items={groupMap.heatmap.map((item) => `${stringValue(item.capability)} x${stringValue(item.count)}`)} />
                <MappedCard title="下一阶段建议" items={groupMap.next_stage_suggestions} />
                <MappedCard title="重复覆盖知识点" items={groupMap.repeated_knowledge_points.map((item) => `${stringValue(item.name)} x${stringValue(item.count)}`)} fallback="暂无重复覆盖" />
                <MappedCard title="未覆盖关键知识点" items={groupMap.missing_key_knowledge_points.map((item) => stringValue(item.name))} fallback="暂无明显缺口" />
              </div>
              {groupId ? <ButtonLink to={`/teacher/groups/${encodeURIComponent(groupId)}`} variant="secondary">打开项目组页</ButtonLink> : null}
            </>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">项目组编辑</h2>
          <p className="mt-1 text-sm text-muted">{currentClass ? `${currentClass.class_name} · ${currentClass.term_label}` : "暂无可编辑班级"}</p>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-2">
            {(context?.groups ?? []).filter((group) => group.class_id === currentClass?.class_id).map((group) => (
              <div key={group.group_id} className="rounded-lg border border-line bg-canvas p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{group.current_maturity_level}</Badge>
                  <span className="tag bg-white">{group.term_label}</span>
                  <span className="font-mono text-xs text-muted">{group.group_id}</span>
                </div>
                <h3 className="mt-3 font-semibold text-ink">{group.group_name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{group.project_name ?? "未绑定项目"} · {group.member_count}名成员</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.members.slice(0, 4).map((member) => <span key={member.membership_id} className="tag bg-white">{member.student_id} · {member.member_role}</span>)}
                </div>
                <div className="mt-3">
                  <Button variant="secondary" onClick={() => updateGroup(group)} disabled={Boolean(busyAction)} type="button">
                    {busyAction === `group_${group.group_id}` ? <RefreshCw className="size-4 animate-spin" /> : <Layers3 className="size-4" />}
                    推进成熟度
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-line bg-canvas p-4">
              <h3 className="font-semibold text-ink">新增项目组</h3>
              <div className="mt-3 grid gap-3">
                <TextField label="项目组名称" value={groupForm.group_name} onChange={(value) => setGroupForm((current) => ({ ...current, group_name: value }))} />
                <TextField label="项目ID" value={groupForm.project_id} onChange={(value) => setGroupForm((current) => ({ ...current, project_id: value }))} />
                <TextField label="项目名称" value={groupForm.project_name} onChange={(value) => setGroupForm((current) => ({ ...current, project_name: value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="成熟度" value={groupForm.current_maturity_level} options={["P1", "P2", "P3", "P4"]} onChange={(value) => setGroupForm((current) => ({ ...current, current_maturity_level: value }))} />
                  <NumberField label="总学时" value={groupForm.total_hours} min={0} max={300} onChange={(value) => setGroupForm((current) => ({ ...current, total_hours: value }))} />
                </div>
                <TextField label="课程线" value={groupForm.course_track} onChange={(value) => setGroupForm((current) => ({ ...current, course_track: value }))} />
                <Button onClick={createGroup} disabled={Boolean(busyAction) || !groupForm.group_name.trim()} type="button">
                  {busyAction === "group" ? <RefreshCw className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  创建项目组
                </Button>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-4">
              <h3 className="font-semibold text-ink">维护当前组成员</h3>
              <div className="mt-3 grid gap-3">
                <SelectBare
                  value={memberForm.student_id}
                  onChange={(value) => setMemberForm((current) => ({ ...current, student_id: value }))}
                  options={["", ...classStudents.map((student) => student.student_id)]}
                  emptyLabel="选择学生"
                  labels={Object.fromEntries(classStudents.map((student) => [student.student_id, student.name]))}
                />
                <TextField label="成员角色" value={memberForm.member_role} onChange={(value) => setMemberForm((current) => ({ ...current, member_role: value }))} />
                <TextField label="责任分工" value={memberForm.responsibility} onChange={(value) => setMemberForm((current) => ({ ...current, responsibility: value }))} />
                <TextField label="能力焦点" value={memberForm.capability_focus} onChange={(value) => setMemberForm((current) => ({ ...current, capability_focus: value }))} />
                <Button onClick={addMember} disabled={Boolean(busyAction) || !currentGroup || !memberForm.student_id} type="button">
                  {busyAction === "member" ? <RefreshCw className="size-4 animate-spin" /> : <Users className="size-4" />}
                  保存成员
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function StudentPortraitPanel({
  progression,
  classStatus,
  workspace,
  loading,
  context,
}: {
  progression: ClassProgressionAlertResponse | null;
  classStatus: ClassProgressionStatusResponse | null;
  workspace: TeacherWorkspaceResponse | null;
  loading: boolean;
  context: TeacherContextResponse | null;
}) {
  const studentIds = uniqueValues((progression?.alerts ?? []).map((alert) => alert.student_id));
  const contextStudents = context?.students ?? [];
  const statusByStudent = new Map((classStatus?.students ?? []).map((item) => [item.student_id, item]));
  const displayStudents = studentIds.length
    ? studentIds.map((studentId) => contextStudents.find((item) => item.student_id === studentId) ?? { student_id: studentId, name: "成长推进", grade: "", open_alert_count: 0 })
    : contextStudents;
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">学生画像与成长推进</h2>
          <p className="mt-1 text-sm text-muted">从“完成了哪些项目”转为“下一步该往哪里走”。</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {loading ? <LoadingState label="学生推进数据加载中" /> : null}
          <div className="grid gap-3 md:grid-cols-3">
            {displayStudents.map((student) => (
              <Link key={student.student_id} to={`/teacher/students/${student.student_id}`} className="rounded-lg border border-line bg-canvas p-4 transition hover:border-ink">
                <span className="font-mono text-xs text-muted">{student.student_id}</span>
                <h3 className="mt-3 font-semibold text-ink">{student.name}</h3>
                <p className="mt-1 text-xs text-muted">{student.grade || "项目班"} · 开放提醒 {statusByStudent.get(student.student_id)?.open_alert_count ?? student.open_alert_count}</p>
                <p className="mt-2 text-xs text-muted">
                  待执行计划 {statusByStudent.get(student.student_id)?.pending_plan_count ?? 0} · 已完成 {statusByStudent.get(student.student_id)?.completed_plan_count ?? 0}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">查看已掌握、重复覆盖、缺失前置、可推进知识点和推荐下一项目。</p>
              </Link>
            ))}
          </div>
          {workspace ? <MappedCard title="当前推荐路径" items={workspace.recommendation.recommended_path.map((item) => stringValue(item.focus))} /> : null}
        </CardContent>
      </Card>
    </section>
  );
}

function DeliverablesPanel({ workspace, projects }: { workspace: TeacherWorkspaceResponse | null; projects: Project[] }) {
  const focus = workspace?.focus_project ?? projects[0] ?? null;
  return (
    <section className="grid gap-5 md:grid-cols-2">
      <MappedCard title="项目交付物" items={focus ? focus.project_outputs : ["作品", "报告", "演示视频", "成长档案"]} />
      <MappedCard title="证据链状态" items={["课堂过程记录", "代码/截图", "项目报告", "综评映射"]} />
      <MappedCard title="竞赛材料" items={focus ? focus.competition_packaging_angles : ["规则复核", "作品说明", "答辩稿"]} />
      <MappedCard title="家长可见材料" items={["项目成果摘要", "成长记录", "下一步建议"]} />
    </section>
  );
}

const sampleProjectImport = JSON.stringify([
  {
    record_id: "IMP-PRJ-STU-003-DEMO",
    student_id: "STU-003",
    group_id: "GRP-L3-AIOT-ENV",
    project_id: "KP-SET-L3-003-B",
    project_name: "AIoT智能环境监测站补录",
    project_category: "AIoT",
    course_level: "L3",
    start_date: "2026-05-01",
    end_date: "2026-05-04",
    completed_status: "completed",
    knowledge_point_ids: ["KP-AICOMP-L3-001"],
    output_materials: ["项目报告", "演示视频"],
    teacher_comment: "补录课堂项目记录，用于推进分析。",
  },
], null, 2);

const sampleEvidenceImport = JSON.stringify([
  {
    material_id: "IMP-MAT-STU-003-DEMO",
    student_id: "STU-003",
    material_type: "project_report",
    title: "AIoT智能环境监测站项目报告",
    file_url: "internal://class/CLS-L3-AIOT-001/aiot-report.pdf",
    related_record_id: "IMP-PRJ-STU-003-DEMO",
    verified_status: "verified",
  },
], null, 2);

function ImportExportPanel({
  classId,
  defaultStudentId,
  onImported,
}: {
  classId: string | null;
  defaultStudentId: string | null;
  onImported: () => void;
}) {
  const [projectText, setProjectText] = useState(sampleProjectImport);
  const [evidenceText, setEvidenceText] = useState(sampleEvidenceImport);
  const [importResult, setImportResult] = useState<TeacherImportResultResponse | null>(null);
  const [exportResult, setExportResult] = useState<TeacherDataExportResponse | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function runProjectImport(dryRun: boolean) {
    if (!classId) {
      toast.error("当前没有可操作班级");
      return;
    }
    setBusyAction(dryRun ? "project_dry" : "project_import");
    try {
      const rows = parseRows(projectText) as unknown as TeacherProjectRecordImportRow[];
      const result = await api.teacherImportProjectRecords(classId, { dry_run: dryRun, rows });
      setImportResult(result);
      toast.success(dryRun ? "项目记录预检完成" : "项目记录已导入");
      if (!dryRun) onImported();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "项目记录导入失败");
    } finally {
      setBusyAction(null);
    }
  }

  async function runEvidenceImport(dryRun: boolean) {
    if (!classId) {
      toast.error("当前没有可操作班级");
      return;
    }
    setBusyAction(dryRun ? "evidence_dry" : "evidence_import");
    try {
      const rows = parseRows(evidenceText) as unknown as TeacherEvidenceMaterialImportRow[];
      const result = await api.teacherImportEvidenceMaterials(classId, { dry_run: dryRun, rows });
      setImportResult(result);
      toast.success(dryRun ? "证据材料预检完成" : "证据材料已导入");
      if (!dryRun) onImported();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "证据材料导入失败");
    } finally {
      setBusyAction(null);
    }
  }

  async function runExport(type: "alerts" | "audit" | "plans", format = "csv") {
    if ((type === "alerts" || type === "audit") && !classId) {
      toast.error("当前没有可导出班级");
      return;
    }
    if (type === "plans" && !defaultStudentId) {
      toast.error("当前没有默认学生");
      return;
    }
    setBusyAction(`export_${type}`);
    try {
      const result = type === "alerts"
        ? await api.teacherExportClassProgressionAlerts(classId as string, format)
        : type === "audit"
          ? await api.teacherExportRepeatedKnowledgeAudit(classId as string, format)
          : await api.teacherExportStudentProgressionPlans(defaultStudentId as string, format);
      setExportResult(result);
      toast.success(`已生成 ${result.filename}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "导出失败");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-ink">导入导出</h2>
        <p className="mt-1 text-sm text-muted">当前班级：{classId ?? "未选择"}。所有操作经过教师角色和班级 scope 校验，不导出家长联系方式。</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <ImportBox
            title="学生项目记录"
            description="支持 JSON 数组或带表头 CSV，写入后自动刷新成长推进分析。"
            value={projectText}
            onChange={setProjectText}
            busy={Boolean(busyAction)}
            onDryRun={() => runProjectImport(true)}
            onImport={() => runProjectImport(false)}
          />
          <ImportBox
            title="证据材料清单"
            description="可绑定 related_record_id；写入后同步挂到学生项目记录的 evidence_material_ids。"
            value={evidenceText}
            onChange={setEvidenceText}
            busy={Boolean(busyAction)}
            onDryRun={() => runEvidenceImport(true)}
            onImport={() => runEvidenceImport(false)}
          />
        </div>
        {importResult ? <ImportResultSummary result={importResult} /> : null}
        <div className="rounded-lg border border-line bg-canvas p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-ink">导出</h3>
              <p className="mt-1 text-sm text-muted">生成可复制的 CSV/JSON 包，用于教研复盘和班级运营。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => runExport("alerts")} disabled={Boolean(busyAction)} type="button">
                {busyAction === "export_alerts" ? <RefreshCw className="size-4 animate-spin" /> : <Download className="size-4" />}
                班级提醒
              </Button>
              <Button variant="secondary" onClick={() => runExport("audit")} disabled={Boolean(busyAction)} type="button">
                {busyAction === "export_audit" ? <RefreshCw className="size-4 animate-spin" /> : <Download className="size-4" />}
                重复审计
              </Button>
              <Button variant="secondary" onClick={() => runExport("plans")} disabled={Boolean(busyAction)} type="button">
                {busyAction === "export_plans" ? <RefreshCw className="size-4 animate-spin" /> : <Download className="size-4" />}
                学生计划
              </Button>
            </div>
          </div>
          {exportResult ? <ExportResultPreview result={exportResult} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ImportBox({
  title,
  description,
  value,
  onChange,
  busy,
  onDryRun,
  onImport,
}: {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  busy: boolean;
  onDryRun: () => void;
  onImport: () => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-64 w-full rounded-md border border-line bg-white p-3 font-mono text-xs leading-5 text-ink outline-none focus:border-ink"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onDryRun} disabled={busy} type="button">
          <Search className="size-4" />
          预检
        </Button>
        <Button onClick={onImport} disabled={busy} type="button">
          <UploadCloud className="size-4" />
          写入
        </Button>
      </div>
    </div>
  );
}

function ImportResultSummary({ result }: { result: TeacherImportResultResponse }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <div className="flex flex-wrap gap-2">
        <span className="tag bg-white">{result.import_type}</span>
        <span className="tag bg-white">{result.dry_run ? "预检" : "已写入"}</span>
        <span className="tag bg-white">总数 {result.total_rows}</span>
        <span className="tag bg-white">新增 {result.created_count}</span>
        <span className="tag bg-white">更新 {result.updated_count}</span>
        <span className="tag bg-white">错误 {result.error_count}</span>
      </div>
      <div className="mt-3 grid gap-2">
        {result.results.slice(0, 8).map((row) => (
          <div key={`${result.import_id}-${row.row_index}`} className="text-sm leading-6 text-muted">
            第 {row.row_index} 行 · {row.status} · {row.record_id ?? row.material_id ?? row.student_id ?? "-"} · {row.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportResultPreview({ result }: { result: TeacherDataExportResponse }) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <span className="tag bg-white">{result.filename}</span>
        <span className="tag bg-white">行数 {result.row_count}</span>
        <span className="tag bg-white">{result.content_type}</span>
      </div>
      <textarea
        readOnly
        value={result.content}
        className="mt-3 min-h-64 w-full rounded-md border border-line bg-white p-3 font-mono text-xs leading-5 text-ink outline-none"
      />
    </div>
  );
}

function ConsultantPanel({
  tab,
  workspace,
  projects,
  highFrequency,
}: {
  tab: TeacherTab;
  workspace: TeacherWorkspaceResponse | null;
  projects: Project[];
  highFrequency: HighFrequencyKnowledgePoint[];
}) {
  const focus = workspace?.focus_project ?? projects[0] ?? null;
  const content = consultantContent(tab, focus, workspace, highFrequency);
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">{content.title}</h2>
          <p className="mt-1 text-sm text-muted">{content.subtitle}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {content.blocks.map((block) => (
            <MappedCard key={block.title} title={block.title} items={block.items} fallback="可按学生阶段生成样例" />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function ConsultantSafeOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="size-5 text-l3-teal" />
          <h2 className="font-semibold text-ink">展示边界</h2>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <ActionLine label="可展示" value="成长路径、项目成果、证据链概览、反馈样例" />
        <ActionLine label="不可展示" value="学生隐私、教师话术、内部计划、批量操作" />
        <ActionLine label="当前模式" value="顾问/家长可见" />
      </CardContent>
    </Card>
  );
}

function ConsultantBoundaryCard() {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-ink">家长可见范围</h2>
      </CardHeader>
      <CardContent className="grid gap-3">
        <MappedCard title="展示内容" items={["成长路径示意", "成果类型", "知识点覆盖概览", "交付物示例"]} />
        <MappedCard title="隐私保护" items={["不展示学生完整隐私", "不展示可编辑操作", "不展示批量导出"]} />
      </CardContent>
    </Card>
  );
}

function TeacherTaskCenterPanel({
  taskCenter,
  loading,
  statusFilter,
  setStatusFilter,
  taskTypeFilter,
  setTaskTypeFilter,
  markdownflowFilters,
  setMarkdownflowFilters,
  markdownflowReviewOptions,
  noteTemplateId,
  setNoteTemplateId,
  reviewNote,
  setReviewNote,
  assigneeId,
  setAssigneeId,
  exportFormat,
  setExportFormat,
  exportJob,
  selectedMarkdownFlowTaskIds,
  setSelectedMarkdownFlowTaskIds,
  reload,
  updateStatus,
  confirmTask,
  bulkUpdateMarkdownflow,
  assignMarkdownflow,
  exportMarkdownflow,
  downloadMarkdownflowExport,
}: {
  taskCenter: TeacherTaskCenterResponse | null;
  loading: boolean;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  taskTypeFilter: string;
  setTaskTypeFilter: (value: string) => void;
  markdownflowFilters: { pattern_type: string; knowledge_point_id: string; error_type: string };
  setMarkdownflowFilters: (value: { pattern_type: string; knowledge_point_id: string; error_type: string }) => void;
  markdownflowReviewOptions: MarkdownFlowReviewOptionsResponse | null;
  noteTemplateId: string;
  setNoteTemplateId: (value: string) => void;
  reviewNote: string;
  setReviewNote: (value: string) => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;
  exportFormat: string;
  setExportFormat: (value: string) => void;
  exportJob: AdminExportJob | null;
  selectedMarkdownFlowTaskIds: string[];
  setSelectedMarkdownFlowTaskIds: (value: string[] | ((current: string[]) => string[])) => void;
  reload: (status?: string, taskType?: string, mfFilters?: { pattern_type: string; knowledge_point_id: string; error_type: string }) => void;
  updateStatus: (task: TeacherTask, status: string) => void;
  confirmTask: (task: TeacherTask, payload: TeacherTaskConfirmationPayload) => void;
  bulkUpdateMarkdownflow: (status: "completed" | "dismissed") => void;
  assignMarkdownflow: () => void;
  exportMarkdownflow: () => void;
  downloadMarkdownflowExport: () => void;
}) {
  const tasks = taskCenter?.tasks ?? [];
  const filters = [
    { label: "全部", value: "" },
    { label: "待处理", value: "pending" },
    { label: "进行中", value: "in_progress" },
    { label: "已完成", value: "completed" },
  ];
  const selectableReviewTaskIds = tasks
    .filter((task) => task.task_type === "markdownflow_question_review" && !["completed", "dismissed", "canceled"].includes(task.status))
    .map((task) => task.task_id);
  const allReviewTasksSelected = selectableReviewTaskIds.length > 0 && selectableReviewTaskIds.every((id) => selectedMarkdownFlowTaskIds.includes(id));
  const patternOptions = taskFilterOptions(tasks, "pattern_type");
  const knowledgeOptions = taskFilterOptions(tasks, "knowledge_point_id");
  const errorOptions = taskErrorFilterOptions(tasks);
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">任务中心</h2>
            <p className="mt-1 text-sm text-muted">课后闭环任务已持久化，可分派、完成和回链课堂证据。</p>
          </div>
          <Button variant="secondary" onClick={() => reload()} disabled={loading} type="button">
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            刷新
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <TaskMetric label="待处理" value={taskCenter?.open_count ?? 0} />
            <TaskMetric label="今日待办" value={taskCenter?.today_due_count ?? 0} />
            <TaskMetric label="课后任务" value={taskCenter?.after_class_count ?? 0} />
            <TaskMetric label="总任务" value={taskCenter?.total_count ?? 0} />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value || "all"}
                type="button"
                onClick={() => {
                  setStatusFilter(item.value);
                  reload(item.value);
                }}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm font-semibold transition",
                  statusFilter === item.value ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:border-ink hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setTaskTypeFilter("");
                reload(statusFilter, "", markdownflowFilters);
              }}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-semibold transition",
                !taskTypeFilter ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:border-ink hover:text-ink",
              )}
            >
              全部类型
            </button>
            <button
              type="button"
              onClick={() => {
                setTaskTypeFilter("markdownflow_question_review");
                reload(statusFilter, "markdownflow_question_review", markdownflowFilters);
              }}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-semibold transition",
                taskTypeFilter === "markdownflow_question_review" ? "border-warning bg-warning text-white" : "border-warning/30 bg-warning/10 text-warning hover:border-warning",
              )}
            >
              题型复核
            </button>
          </div>
          <div className="grid gap-3 rounded-md border border-line bg-surface-soft p-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
            <TaskFilterSelect
              label="题型来源"
              value={markdownflowFilters.pattern_type}
              options={patternOptions}
              onChange={(value) => setMarkdownflowFilters({ ...markdownflowFilters, pattern_type: value })}
            />
            <TaskFilterSelect
              label="知识点"
              value={markdownflowFilters.knowledge_point_id}
              options={knowledgeOptions}
              onChange={(value) => setMarkdownflowFilters({ ...markdownflowFilters, knowledge_point_id: value })}
            />
            <TaskFilterSelect
              label="错误类型"
              value={markdownflowFilters.error_type}
              options={errorOptions}
              onChange={(value) => setMarkdownflowFilters({ ...markdownflowFilters, error_type: value })}
            />
            <div className="flex items-end gap-2">
              <Button variant="secondary" onClick={() => reload(statusFilter, taskTypeFilter, markdownflowFilters)} disabled={loading} type="button">应用</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const next = { pattern_type: "", knowledge_point_id: "", error_type: "" };
                  setMarkdownflowFilters(next);
                  reload(statusFilter, taskTypeFilter, next);
                }}
                disabled={loading}
                type="button"
              >
                清空
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-white p-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={allReviewTasksSelected}
                disabled={selectableReviewTaskIds.length === 0}
                onChange={(event) => setSelectedMarkdownFlowTaskIds(event.target.checked ? selectableReviewTaskIds : [])}
              />
              选择当前题型复核任务
              <span className="text-muted">已选 {selectedMarkdownFlowTaskIds.length}</span>
            </label>
            <div className="grid w-full gap-3 lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(220px,1.5fr)_auto]">
              <TaskFilterSelect
                label="备注模板"
                value={noteTemplateId}
                options={(markdownflowReviewOptions?.note_templates ?? []).map((item) => item.template_id)}
                labels={templateLabels(markdownflowReviewOptions)}
                onChange={setNoteTemplateId}
              />
              <TaskFilterSelect
                label="负责人"
                value={assigneeId}
                options={(markdownflowReviewOptions?.assignees ?? []).map((item) => item.user_id)}
                labels={assigneeLabels(markdownflowReviewOptions)}
                onChange={setAssigneeId}
              />
              <label className="grid gap-1 text-xs font-semibold text-muted">
                处理备注
                <input
                  className="h-10 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink"
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  placeholder={selectedTemplateNote(markdownflowReviewOptions, noteTemplateId)}
                />
              </label>
              <TaskFilterSelect label="导出格式" value={exportFormat} options={markdownflowReviewOptions?.export_formats ?? ["csv", "json"]} onChange={setExportFormat} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={assignMarkdownflow} disabled={selectedMarkdownFlowTaskIds.length === 0 || !assigneeId || loading} type="button">
                <UserPlus className="size-4" />
                批量分派
              </Button>
              <Button variant="secondary" onClick={exportMarkdownflow} disabled={loading} type="button">
                <Download className="size-4" />
                批量导出
              </Button>
              <Button onClick={() => bulkUpdateMarkdownflow("completed")} disabled={selectedMarkdownFlowTaskIds.length === 0 || loading} type="button">
                <FileCheck2 className="size-4" />
                批量完成
              </Button>
              <Button variant="secondary" onClick={() => bulkUpdateMarkdownflow("dismissed")} disabled={selectedMarkdownFlowTaskIds.length === 0 || loading} type="button">
                <ShieldAlert className="size-4" />
                批量关闭
              </Button>
            </div>
            {exportJob ? (
              <div className="flex w-full flex-wrap items-center gap-2 text-xs text-muted">
                <span>最近导出：{exportJob.job_id} · {exportJob.status}{exportJob.is_expired ? " · 已过期" : ""}</span>
                {exportJob.download_url ? (
                  <Button variant="secondary" onClick={downloadMarkdownflowExport} disabled={loading} type="button">
                    <Download className="size-4" />
                    下载
                  </Button>
                ) : <span>{exportJob.error_message ?? "无可下载文件"}</span>}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {loading && !taskCenter ? <LoadingState label="任务中心加载中" /> : null}
      {!loading && tasks.length === 0 ? <EmptyState title="暂无任务" description="结课后会自动生成综评、反馈和下节课任务。" /> : null}

      <div className="grid gap-3">
        {tasks.map((task) => (
          <Card key={task.task_id}>
            <CardContent className="grid gap-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {task.task_type === "markdownflow_question_review" ? (
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selectedMarkdownFlowTaskIds.includes(task.task_id)}
                    disabled={["completed", "dismissed", "canceled"].includes(task.status)}
                    onChange={(event) => {
                      setSelectedMarkdownFlowTaskIds((current) => (
                        event.target.checked ? Array.from(new Set([...current, task.task_id])) : current.filter((id) => id !== task.task_id)
                      ));
                    }}
                    aria-label={`选择 ${task.title}`}
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{teacherTaskTypeLabel(task.task_type)}</Badge>
                    <Badge className={teacherTaskStatusClass(task.status)}>{teacherTaskStatusLabel(task.status)}</Badge>
                    <span className="tag">{teacherTaskPriorityLabel(task.priority)}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-ink">{task.title}</h3>
                  {task.description ? <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{task.description}</p> : null}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {task.action_url ? (
                    <ButtonLink to={task.action_url} variant="secondary" className="h-9">处理</ButtonLink>
                  ) : null}
                  {task.status !== "completed" ? (
                    <Button onClick={() => updateStatus(task, "completed")} disabled={loading} type="button" className="h-9">
                      <FileCheck2 className="size-4" />
                      完成
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={() => updateStatus(task, "pending")} disabled={loading} type="button" className="h-9">重开</Button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                {task.lesson_id ? <Link to={`/teacher/classroom/${encodeURIComponent(task.lesson_id)}`} className="tag bg-white hover:border-ink">课次 {task.lesson_id}</Link> : null}
                {task.next_lesson_id ? <Link to={`/teacher/classroom/${encodeURIComponent(task.next_lesson_id)}`} className="tag bg-white hover:border-ink">下节 {task.next_lesson_id}</Link> : null}
                {task.student_ids.length ? <span className="tag bg-white">{task.student_ids.length} 学生</span> : null}
                {task.linked_material_ids.length ? <span className="tag bg-white">{task.linked_material_ids.length} 材料</span> : null}
                {task.linked_alert_ids.length ? <span className="tag bg-white">{task.linked_alert_ids.length} 提醒</span> : null}
                {task.source_refs.length ? <span className="tag bg-white">{task.source_refs.length} 回链</span> : null}
                {task.assignee_user_ids.length ? <span className="tag bg-white">负责人 {task.assignee_user_ids.join("、")}</span> : null}
              </div>
              {task.task_type === "markdownflow_question_review" ? <MarkdownFlowReviewTaskMeta task={task} /> : null}
              <TaskConfirmationWorkbench task={task} loading={loading} confirmTask={confirmTask} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function MarkdownFlowReviewTaskMeta({ task }: { task: TeacherTask }) {
  const trace = (task.task_payload.review_trace ?? {}) as Record<string, unknown>;
  const handling = (task.task_payload.last_review_handling ?? {}) as Record<string, unknown>;
  return (
    <div className="grid gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm">
      <div className="flex flex-wrap gap-2">
        <Badge className="border-warning/30 bg-white text-warning">复核 {payloadTextFromObject(trace, "status", "unknown")}</Badge>
        <Badge className={qualityBadgeClass(payloadText(task, "quality_grade", "fallback"))}>
          质量 {teacherQualityGradeLabel(payloadText(task, "quality_grade", "fallback"))} · {Math.round(payloadNumber(task, "quality_score") * 100)}%
        </Badge>
        <span className="tag bg-white">{teacherPatternTypeLabel(payloadText(task, "pattern_type", "runtime_fallback"))}</span>
        <span className="tag bg-white">证据 {payloadText(task, "evidence_strength", "unknown")}</span>
      </div>
      <p className="text-xs leading-5 text-muted">
        错误类型：{payloadTextFromObject(trace, "error_type", "none")} · 知识点：{payloadText(task, "knowledge_point_id", "-")} · 题型：{payloadText(task, "pattern_id", "-")}
      </p>
      {handling.note || handling.actor_user_id ? (
        <p className="text-xs leading-5 text-muted">
          最近处理：{payloadTextFromObject(handling, "note", "无备注")} · {payloadTextFromObject(handling, "actor_user_id", "-")} · {payloadTextFromObject(handling, "handled_at", "-")}
        </p>
      ) : null}
    </div>
  );
}

function TaskFilterSelect({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-muted">
      {label}
      <select
        className="h-10 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">全部</option>
        {options.map((option) => <option key={option} value={option}>{labels?.[option] ?? option}</option>)}
      </select>
    </label>
  );
}

function templateForAction(options: MarkdownFlowReviewOptionsResponse | null, templateId: string, action: string) {
  return (options?.note_templates ?? []).find((item) => item.template_id === templateId && item.action === action);
}

function templateIdForAction(options: MarkdownFlowReviewOptionsResponse | null, templateId: string, action: string) {
  return templateForAction(options, templateId, action)?.template_id ?? (options?.note_templates ?? []).find((item) => item.action === action)?.template_id;
}

function templateLabels(options: MarkdownFlowReviewOptionsResponse | null) {
  return Object.fromEntries((options?.note_templates ?? []).map((item) => [item.template_id, `${item.label} · ${item.action}`]));
}

function assigneeLabels(options: MarkdownFlowReviewOptionsResponse | null) {
  return Object.fromEntries((options?.assignees ?? []).map((item) => [item.user_id, `${item.display_name} · ${roleLabel(item.role)}`]));
}

function selectedTemplateNote(options: MarkdownFlowReviewOptionsResponse | null, templateId: string) {
  return (options?.note_templates ?? []).find((item) => item.template_id === templateId)?.note ?? "可补充处理备注";
}

function taskFilterOptions(tasks: TeacherTask[], key: string) {
  return Array.from(new Set(tasks.map((task) => payloadText(task, key)).filter(Boolean))).sort();
}

function taskErrorFilterOptions(tasks: TeacherTask[]) {
  return Array.from(new Set(tasks.map((task) => {
    const trace = (task.task_payload.review_trace ?? {}) as Record<string, unknown>;
    const value = trace.error_type;
    return typeof value === "string" && value ? value : "";
  }).filter(Boolean))).sort();
}

function TaskConfirmationWorkbench({
  task,
  loading,
  confirmTask,
}: {
  task: TeacherTask;
  loading: boolean;
  confirmTask: (task: TeacherTask, payload: TeacherTaskConfirmationPayload) => void;
}) {
  if (!["zongping_material_candidate", "parent_feedback_draft", "next_lesson_package"].includes(task.task_type)) return null;
  const confirmedAt = payloadText(task, "confirmed_at");
  const sentVersions = Array.isArray(task.task_payload.sent_versions) ? task.task_payload.sent_versions.length : 0;
  if (task.status === "completed" && (confirmedAt || sentVersions > 0)) {
    return (
      <div className="rounded-md border border-success/25 bg-success/5 px-3 py-2 text-sm text-success">
        {task.task_type === "parent_feedback_draft" && sentVersions > 0 ? `已发送 ${sentVersions} 个版本` : "已确认"}{confirmedAt ? ` · ${confirmedAt}` : ""}
      </div>
    );
  }
  if (task.task_type === "zongping_material_candidate") {
    const quality = payloadText(task, "quality_status", "ready");
    const needsEvidence = quality !== "ready" || task.linked_material_ids.length === 0;
    return (
      <div className="grid gap-3 rounded-md border border-line bg-canvas p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted">
            <span className="font-semibold text-ink">综评确认</span>
            <span className="ml-2">{needsEvidence ? "需先补证据，不能直接入高可信输出" : "可绑定项目记录或生成综评条目"}</span>
          </div>
          <span className="tag bg-white">材料 {task.linked_material_ids.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={loading || needsEvidence}
            onClick={() => confirmTask(task, { target_type: "project_record", note: "教师确认进入综评候选池" })}
            type="button"
            className="h-9"
          >
            <FileCheck2 className="size-4" />
            绑定项目记录
          </Button>
          <Button
            disabled={loading || needsEvidence}
            onClick={() => confirmTask(task, { target_type: "zongping_entry", version_type: 200, note: "教师确认生成综评条目" })}
            type="button"
            className="h-9"
          >
            <FileText className="size-4" />
            生成综评条目
          </Button>
          {task.student_ids[0] ? <ButtonLink to={`/zongping/materials?studentId=${encodeURIComponent(task.student_ids[0])}`} variant="ghost" className="h-9">看材料</ButtonLink> : null}
        </div>
      </div>
    );
  }
  if (task.task_type === "parent_feedback_draft") {
    return <ParentFeedbackTaskWorkbench task={task} loading={loading} confirmTask={confirmTask} />;
  }
  return <NextLessonTaskWorkbench task={task} loading={loading} confirmTask={confirmTask} />;
}

function ParentFeedbackTaskWorkbench({
  task,
  loading,
  confirmTask,
}: {
  task: TeacherTask;
  loading: boolean;
  confirmTask: (task: TeacherTask, payload: TeacherTaskConfirmationPayload) => void;
}) {
  const [message, setMessage] = useState(payloadText(task, "parent_message"));
  const [nextStep, setNextStep] = useState(payloadText(task, "next_step"));
  return (
    <div className="grid gap-3 rounded-md border border-line bg-canvas p-3">
      <TextAreaField label="家长反馈内容" value={message} onChange={setMessage} />
      <TextField label="下一步" value={nextStep} onChange={setNextStep} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={loading || !message.trim()}
          onClick={() => confirmTask(task, { action: "confirm", parent_message: message, next_step: nextStep, note: "教师已复核家长可展示内容" })}
          type="button"
          className="h-9"
        >
          <Save className="size-4" />
          确认草稿
        </Button>
        <Button
          disabled={loading || !message.trim()}
          onClick={() => confirmTask(task, { action: "mark_sent", parent_message: message, next_step: nextStep, send_channel: "manual", note: "已发送给家长" })}
          type="button"
          className="h-9"
        >
          <FileCheck2 className="size-4" />
          标记已发送
        </Button>
      </div>
    </div>
  );
}

function NextLessonTaskWorkbench({
  task,
  loading,
  confirmTask,
}: {
  task: TeacherTask;
  loading: boolean;
  confirmTask: (task: TeacherTask, payload: TeacherTaskConfirmationPayload) => void;
}) {
  const [title, setTitle] = useState(payloadText(task, "title", task.title));
  const [studentIds, setStudentIds] = useState(payloadTextArray(task, "student_ids", task.student_ids).join(", "));
  const [deliverable, setDeliverable] = useState(payloadText(task, "deliverable"));
  const [knowledgeIds, setKnowledgeIds] = useState(payloadTextArray(task, "knowledge_point_ids", task.linked_knowledge_point_ids).join(", "));
  const [alertIds, setAlertIds] = useState(payloadTextArray(task, "linked_alert_ids", task.linked_alert_ids).join(", "));
  const [note, setNote] = useState(payloadText(task, "note"));
  return (
    <div className="grid gap-3 rounded-md border border-line bg-canvas p-3">
      <div className="grid gap-3 md:grid-cols-2">
        <TextField label="任务标题" value={title} onChange={setTitle} />
        <TextField label="交付物" value={deliverable} onChange={setDeliverable} />
        <TextField label="学生ID" value={studentIds} onChange={setStudentIds} />
        <TextField label="知识点ID" value={knowledgeIds} onChange={setKnowledgeIds} />
        <TextField label="提醒ID" value={alertIds} onChange={setAlertIds} />
        <TextField label="任务备注" value={note} onChange={setNote} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={loading || !title.trim()}
          onClick={() => confirmTask(task, {
            next_lesson_task: {
              task_id: payloadText(task, "task_id", task.task_id),
              title,
              student_ids: splitIdList(studentIds),
              deliverable: deliverable || null,
              status: "pending",
              linked_alert_ids: splitIdList(alertIds),
              knowledge_point_ids: splitIdList(knowledgeIds),
              note: note || null,
            },
            note: "教师已调整下节课任务包",
          })}
          type="button"
          className="h-9"
        >
          <FileCheck2 className="size-4" />
          生成下节课任务
        </Button>
      </div>
    </div>
  );
}

function payloadText(task: TeacherTask, key: string, fallback = "") {
  const value = task.task_payload[key];
  return typeof value === "string" ? value : fallback;
}

function payloadTextFromObject(payload: Record<string, unknown>, key: string, fallback = "") {
  const value = payload[key];
  return typeof value === "string" ? value : fallback;
}

function payloadNumber(task: TeacherTask, key: string) {
  const value = Number(task.task_payload[key]);
  return Number.isFinite(value) ? value : 0;
}

function teacherPatternTypeLabel(value: string) {
  const labels: Record<string, string> = {
    runtime_fallback: "备用题型",
    single_choice: "单选题",
    multiple_choice: "多选题",
    short_answer: "简答题",
  };
  return labels[value] ?? value.replace(/_/g, " ");
}

function teacherQualityGradeLabel(value: string) {
  return value === "fallback" ? "备用评分" : value;
}

function qualityBadgeClass(grade: string) {
  const normalized = grade.trim().toLowerCase();
  if (["excellent", "high", "ready", "pass", "passed", "good", "a"].includes(normalized)) {
    return "border-success/30 bg-success/10 text-success";
  }
  if (["medium", "review", "warning", "fallback", "b"].includes(normalized)) {
    return "border-warning/30 bg-warning/10 text-warning";
  }
  if (["low", "failed", "fail", "error", "c"].includes(normalized)) {
    return "border-danger/30 bg-danger/10 text-danger";
  }
  return "border-line bg-white text-muted";
}

function payloadTextArray(task: TeacherTask, key: string, fallback: string[] = []) {
  const value = task.task_payload[key];
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : fallback;
}

function splitIdList(raw: string) {
  return raw.split(/[,，\s]+/).map((item) => item.trim()).filter(Boolean);
}

function TaskMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-canvas p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function LessonPanel({
  result,
  loading,
  prompt,
  setPrompt,
  generateLesson,
}: {
  result: LessonGenerateResponse | null;
  loading: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  generateLesson: () => void;
}) {
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink">一句话备课</h2>
              <p className="mt-1 text-sm text-muted">输入需求，生成结构化教案。</p>
            </div>
            <Badge>lesson-generate</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <textarea
            className="min-h-24 rounded-md border border-line bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-ink"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <Button onClick={generateLesson} disabled={loading} type="button" className="lg:self-start">
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            生成教案
          </Button>
        </CardContent>
      </Card>

      {loading ? <LoadingState label="教案生成中" /> : null}
      {!loading && !result ? <EmptyState title="还没有教案" description="输入需求后生成。" /> : null}
      {result ? (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">{result.lesson_title}</h2>
            <p className="mt-1 text-sm text-muted">{result.student_level}</p>
          </CardHeader>
          <CardContent className="grid gap-5">
            <ListBlock title="教学目标" icon={Target} items={result.teaching_goal} />
            <div className="grid gap-3 md:grid-cols-2">
              <MappedCard title="相关知识点" items={result.related_knowledge_points.map((item) => `${item.name}｜${item.id}`)} />
              <MappedCard title="相关项目" items={result.related_projects.map((item) => `${item.project_name}｜${item.project_id}`)} />
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-ink">课堂流程</h3>
              <div className="grid gap-3">
                {result.lesson_flow.map((item) => (
                  <div key={item.time} className="grid gap-3 rounded-lg border border-line bg-canvas p-4 md:grid-cols-[120px_1fr_1fr]">
                    <p className="font-mono text-sm font-semibold text-ink">{item.time}</p>
                    <div>
                      <p className="font-semibold text-ink">{item.section}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.teacher_script}</p>
                    </div>
                    <p className="text-sm leading-6 text-muted">{item.student_task}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <MappedCard title="材料" items={result.materials_needed} />
              <MappedCard title="常见问题" items={result.common_problems} />
              <MappedCard title="作业" items={result.homework} />
            </div>
            <div className="rounded-lg border border-line bg-canvas p-4">
              <p className="font-semibold text-ink">家长反馈草稿</p>
              <p className="mt-2 text-sm leading-6 text-muted">{result.parent_feedback}</p>
              <p className="mt-3 text-xs text-muted">引用：{result.citations.join(" / ")}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

function KnowledgePanel({
  query,
  setQuery,
  ageBand,
  setAgeBand,
  system,
  setSystem,
  difficulty,
  setDifficulty,
  knowledge,
  selectedKpId,
  setSelectedKpId,
  searchKnowledge,
  loading,
  teacherView,
  evidence,
  patterns,
  applicationCases,
}: {
  query: string;
  setQuery: (value: string) => void;
  ageBand: string;
  setAgeBand: (value: string) => void;
  system: string;
  setSystem: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  knowledge: KnowledgePoint[];
  selectedKpId: string;
  setSelectedKpId: (value: string) => void;
  searchKnowledge: () => void;
  loading: boolean;
  teacherView: KnowledgePointTeacherView | null;
  evidence: KnowledgeEvidence[];
  patterns: KnowledgeQuestionPattern[];
  applicationCases: KnowledgeApplicationCase[];
}) {
  const kp = teacherView?.knowledge_point;
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink">知识点检索</h2>
              <p className="mt-1 text-sm text-muted">按体系、阶段、难度和关键词筛选。</p>
            </div>
            <Badge>{knowledge.length} 条</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <SearchInput value={query} onChange={setQuery} placeholder="搜索知识点、考级、项目或竞赛能力" />
            <SelectBare value={system} onChange={setSystem} options={systems} emptyLabel="全部体系" />
            <SelectBare value={ageBand} onChange={setAgeBand} options={ageBands} emptyLabel="全部年龄" />
            <SelectBare value={difficulty} onChange={setDifficulty} options={["", "1", "2", "3", "4", "5", "6", "7", "8", "9"]} emptyLabel="难度不限" />
          </div>
          <Button onClick={searchKnowledge} disabled={loading} variant="secondary" type="button">
            {loading ? "检索中" : "检索知识点"}
          </Button>
        </CardContent>
      </Card>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">知识点列表</h2>
          </CardHeader>
          <CardContent className="grid max-h-[760px] gap-3 overflow-auto">
            {loading ? <LoadingState label="知识点检索中" /> : null}
            {!loading && knowledge.length === 0 ? <EmptyState title="暂无知识点" /> : null}
            {knowledge.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedKpId(item.id)}
                className={cn(
                  "rounded-lg border p-4 text-left transition",
                  selectedKpId === item.id ? "border-ink bg-white shadow-subtle" : "border-line bg-canvas hover:border-ink",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge level={item.age_band}>{item.age_band}</Badge>
                  <span className="font-mono text-xs text-muted">{item.id}</span>
                  <span className="tag bg-white">难度{item.difficulty}</span>
                </div>
                <p className="mt-3 font-semibold text-ink">{item.name}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{item.summary ?? item.description}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
                  <span>前置 {item.prerequisites.length}</span>
                  <span>后继 {item.successors.length}</span>
                  <span>项目 {item.used_in_projects.length || item.project_tags.length}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-ink">知识点详情</h2>
                <p className="mt-1 text-sm text-muted">看基础、前后置、证据、项目和建议。</p>
              </div>
              {kp ? <Badge level={kp.age_band}>{kp.id}</Badge> : null}
            </div>
          </CardHeader>
          <CardContent>
            {!kp ? <EmptyState title="请选择知识点" /> : (
              <div className="grid gap-5">
                <div>
                  <h3 className="text-xl font-semibold text-ink">{kp.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{kp.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[kp.system, kp.domain, kp.bloom_level, `难度${kp.difficulty}`].map((item) => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <MappedCard title="前置知识" items={kp.prerequisites.length ? kp.prerequisites : ["无明确前置"]} />
                  <MappedCard title="后继知识" items={kp.successors.length ? kp.successors : kp.next_learning_points} />
                </div>
                <EvidenceTable title="出题记录" evidence={evidence.filter((item) => item.evidence_type === "exam_question" || item.evidence_type.includes("question"))} />
                <EvidenceTable title="竞赛映射" evidence={evidence.filter((item) => item.related_competition_codes.length > 0 || item.evidence_type.includes("competition"))} />
                <CasesTable title="项目应用" cases={applicationCases} />
                <PatternsTable patterns={patterns} />
                <div className="grid gap-3 md:grid-cols-2">
                  <MappedCard title="教学建议" items={kp.teaching_suggestions} />
                  <MappedCard title="家长解释" items={[kp.parent_explanation ?? kp.why_it_matters ?? "暂无"]} />
                </div>
                <div className="rounded-lg border border-line bg-canvas p-4">
                  <p className="font-semibold text-ink">关联</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    项目 {teacherView.related_projects.length} 个，竞赛点 {teacherView.related_competitions.length} 个，证据 {stringValue(teacherView.evidence_summary.total, String(evidence.length))} 条。
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}

function ProjectsPanel({
  query,
  setQuery,
  ageBand,
  setAgeBand,
  maturity,
  setMaturity,
  courseSeries,
  setCourseSeries,
  projects,
  selectedProject,
  setSelectedProject,
  searchProjects,
  loading,
  setAsFocus,
}: {
  query: string;
  setQuery: (value: string) => void;
  ageBand: string;
  setAgeBand: (value: string) => void;
  maturity: string;
  setMaturity: (value: string) => void;
  courseSeries: string;
  setCourseSeries: (value: string) => void;
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (value: Project) => void;
  searchProjects: () => void;
  loading: boolean;
  setAsFocus: (value: Project) => void;
}) {
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">项目库检索</h2>
          <p className="mt-1 text-sm text-muted">按年龄、难度、方向、设备和成熟度筛选。</p>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
          <SearchInput value={query} onChange={setQuery} placeholder="搜索项目、硬件、软件或竞赛方向" />
          <SelectBare value={ageBand} onChange={setAgeBand} options={ageBands} emptyLabel="全部年龄" />
          <SelectBare value={maturity} onChange={setMaturity} options={maturityLevels} emptyLabel="成熟度不限" />
          <SelectBare value={courseSeries} onChange={setCourseSeries} options={courseSeriesOptions} emptyLabel="工具线不限" />
          <Button onClick={searchProjects} disabled={loading} variant="secondary" type="button">
            检索项目
          </Button>
        </CardContent>
      </Card>
      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-3">
          {loading ? <LoadingState label="项目检索中" /> : null}
          {!loading && projects.length === 0 ? <EmptyState title="暂无项目" /> : null}
          {projects.map((project) => (
            <button
              key={project.project_id}
              type="button"
              onClick={() => setSelectedProject(project)}
              className={cn(
                "rounded-lg border bg-white p-4 text-left shadow-subtle transition hover:border-ink",
                selectedProject?.project_id === project.project_id ? "border-ink" : "border-line",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge level={project.age_band}>{project.age_band}</Badge>
                <span className="font-mono text-xs text-muted">{project.project_id}</span>
                <span className="tag">{project.maturity_level}</span>
                <span className="tag">{project.duration_hours}h</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{project.project_name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{project.project_summary ?? project.scenario_summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="tag bg-canvas">KP {project.core_kp_ids.length}</span>
                <span className="tag bg-canvas">CMP {project.core_cmp_ids.length}</span>
                <span className="tag bg-canvas">作品分 {project.portfolio_value_score}</span>
              </div>
            </button>
          ))}
        </div>
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">项目详情</h2>
          </CardHeader>
          <CardContent>
            {!selectedProject ? <EmptyState title="请选择项目" /> : (
              <div className="grid gap-4">
                <div>
                  <Badge level={selectedProject.age_band}>{selectedProject.age_band}</Badge>
                  <h3 className="mt-3 text-xl font-semibold text-ink">{selectedProject.project_name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{selectedProject.scenario_summary}</p>
                </div>
                <InfoGrid
                  rows={[
                    ["成熟度", selectedProject.maturity_level],
                    ["难度", selectedProject.difficulty_range],
                    ["学时", `${selectedProject.duration_hours}h`],
                    ["工具线", selectedProject.course_series],
                  ]}
                />
                {projectAlignmentWarning(selectedProject) ? <WarningNote value={projectAlignmentWarning(selectedProject)} /> : null}
                <MappedCard
                  title={selectedProject.age_band === "L1" ? "前置能力方向" : "考级方向"}
                  items={examDisplayTags(selectedProject)}
                  fallback="缺少考级映射"
                />
                {selectedProject.age_band === "L1" ? (
                  <TextBlock title="正式竞赛映射" value="无正式竞赛；只记录课堂证据。" />
                ) : (
                  <MappedCard title="竞赛方向" items={competitionDisplayTags(selectedProject)} fallback="缺少竞赛映射" />
                )}
                <TextBlock title="考级说明" value={selectedProject.exam_alignment_note ?? "未配置"} />
                <TextBlock title="竞赛说明" value={selectedProject.competition_alignment_note ?? "未配置"} />
                <TextBlock title="映射数据来源" value={`${selectedProject.alignment_generated_by} · ${selectedProject.alignment_quality_status}`} />
                <MappedCard title="硬件" items={selectedProject.hardware_stack} />
                <MappedCard title="软件" items={selectedProject.software_stack} />
                {selectedProject.age_band === "L1" ? (
                  <>
                    <MappedCard title="套件准备清单" items={selectedProject.kit_preparation_checklist} />
                    <MappedCard title="图标式编程目标" items={selectedProject.icon_programming_goals} />
                    <MappedCard title="AI套件使用边界" items={selectedProject.ai_kit_boundaries} />
                    <MappedCard title="认知负荷检查" items={selectedProject.cognitive_load_check} />
                    <MappedCard title="儿童安全注意事项" items={selectedProject.safety_check} />
                    <MappedCard title="教师提问脚本" items={selectedProject.teacher_guidance_script} />
                    <TextBlock title="防AI替代设计" value={selectedProject.anti_ai_overreliance_design} />
                    <TextBlock title="家长反馈话术" value={selectedProject.parent_feedback_talk} />
                  </>
                ) : null}
                <MappedCard title="升级路径" items={selectedProject.upgrade_path} />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setAsFocus(selectedProject)} type="button">设为本轮项目</Button>
                  <ButtonLink to={`/projects/${selectedProject.project_id}`} variant="secondary">项目详情</ButtonLink>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}

function StudentPathPanel({
  workspace,
  loading,
  generateWorkspace,
  suggestion,
  materials,
}: {
  workspace: TeacherWorkspaceResponse | null;
  loading: boolean;
  generateWorkspace: () => void;
  suggestion: Record<string, unknown>;
  materials: Record<string, unknown>;
}) {
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-ink">学生路径</h2>
            <p className="mt-1 text-sm text-muted">生成阶段、缺口、项目和6个月计划。</p>
          </div>
          <Button onClick={generateWorkspace} disabled={loading} type="button">
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            生成路径
          </Button>
        </CardHeader>
      </Card>
      {loading ? <LoadingState label="路径生成中" /> : null}
      {!loading && !workspace ? <EmptyState title="还没有路径方案" /> : null}
      {workspace ? (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <Metric label="阶段" value={workspace.recommendation.stage} icon={Layers3} />
            <Metric label="项目" value={`${workspace.recommendation.recommended_projects.length}个`} icon={Target} />
            <Metric label="考级" value={`${workspace.recommendation.recommended_exams.length}项`} icon={GraduationCap} />
            <Metric label="知识点" value={`${workspace.key_knowledge_points.length}个`} icon={BookOpenCheck} />
          </section>
          <Card className="overflow-hidden">
            <CardContent className="grid gap-5 bg-ink p-6 text-white lg:grid-cols-[1fr_300px]">
              <div>
                <Badge level={workspace.recommendation.stage} className="border-white/20 bg-white/10 text-white">{workspace.recommendation.stage}</Badge>
                <h2 className="mt-5 text-2xl font-semibold leading-tight">{workspace.focus_project?.project_name ?? "推荐方案"}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{workspace.recommendation.parent_explanation}</p>
              </div>
              <div className="grid gap-2 rounded-lg border border-white/15 bg-white/10 p-4">
                <WhiteStat label="重点项目" value={workspace.focus_project?.project_id ?? "--"} />
                <WhiteStat label="项目成熟度" value={workspace.focus_project?.maturity_level ?? "--"} />
                <WhiteStat label="输出" value={compactList(workspace.focus_project?.project_outputs, 2)} />
              </div>
            </CardContent>
          </Card>
          <section className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader><h2 className="font-semibold text-ink">推荐路径</h2></CardHeader>
              <CardContent className="grid gap-3">
                {workspace.recommendation.recommended_path.map((item, index) => (
                  <div key={`${stringValue(item.phase)}-${index}`} className="rounded-lg border border-line bg-canvas p-4">
                    <span className="tag bg-white">{stringValue(item.phase, `阶段${index + 1}`)}</span>
                    <p className="mt-3 text-sm leading-6 text-muted">{stringValue(item.focus)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h2 className="font-semibold text-ink">教师行动计划</h2></CardHeader>
              <CardContent className="grid gap-4">
                <ListBlock title="教学目标" icon={Target} items={arrayValue(suggestion.teaching_objectives)} />
                <ListBlock title="课堂流程" icon={Layers3} items={arrayValue(suggestion.lesson_flow)} />
                <TagRow title="硬件" items={arrayValue(materials.hardware)} />
                <TagRow title="软件" items={arrayValue(materials.software)} />
              </CardContent>
            </Card>
          </section>
          <Card>
            <CardHeader><h2 className="font-semibold text-ink">课堂执行清单</h2></CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {workspace.classroom_actions.map((item) => (
                  <div key={String(item.week)} className="rounded-lg border border-line bg-canvas p-4">
                    <span className="inline-flex size-9 items-center justify-center rounded-md bg-white font-mono text-sm font-semibold text-ink">{stringValue(item.week)}</span>
                    <p className="mt-4 font-semibold text-ink">{stringValue(item.focus)}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{stringValue(item.teacher_action)}</p>
                    <p className="mt-2 text-xs leading-5 text-muted">输出：{stringValue(item.student_output)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </section>
  );
}

function FeedbackPanel({
  form,
  setForm,
  result,
  loading,
  generateFeedback,
}: {
  form: {
    student_name: string;
    age: number;
    today_topic: string;
    student_performance: string;
    project_progress: string;
    next_step: string;
    tone: string;
  };
  setForm: (value: {
    student_name: string;
    age: number;
    today_topic: string;
    student_performance: string;
    project_progress: string;
    next_step: string;
    tone: string;
  }) => void;
  result: ParentFeedbackResponse | null;
  loading: boolean;
  generateFeedback: () => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink">家长反馈</h2>
              <p className="mt-1 text-sm text-muted">可复制到微信，不夸大、不承诺。</p>
            </div>
            <Badge>parent-feedback</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="学生姓名" value={form.student_name} onChange={(value) => setForm({ ...form, student_name: value })} />
            <NumberField label="年龄" value={form.age} min={3} max={18} onChange={(value) => setForm({ ...form, age: value })} />
          </div>
          <SelectField label="语气版本" value={form.tone} options={feedbackTones} onChange={(value) => setForm({ ...form, tone: value })} />
          <TextField label="今日主题" value={form.today_topic} onChange={(value) => setForm({ ...form, today_topic: value })} />
          <TextAreaField label="课堂表现" value={form.student_performance} onChange={(value) => setForm({ ...form, student_performance: value })} />
          <TextAreaField label="项目进度" value={form.project_progress} onChange={(value) => setForm({ ...form, project_progress: value })} />
          <TextAreaField label="下一步" value={form.next_step} onChange={(value) => setForm({ ...form, next_step: value })} />
          <Button onClick={generateFeedback} disabled={loading} type="button">
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <MessageSquareText className="size-4" />}
            生成反馈
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><h2 className="font-semibold text-ink">生成结果</h2></CardHeader>
        <CardContent>
          {loading ? <LoadingState label="反馈生成中" /> : null}
          {!loading && !result ? <EmptyState title="还没有反馈" /> : null}
          {result ? (
            <div className="grid gap-4">
              <div className="rounded-lg border border-line bg-canvas p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-ink">{result.parent_message}</p>
              </div>
              <InfoGrid rows={[["进度摘要", result.progress_summary], ["下一步", result.next_step], ["教师备注", result.teacher_note]]} />
              <MappedCard title="已学知识点" items={result.knowledge_points_learned} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

function CompetitionPanel({
  competitions,
  selectedCode,
  setSelectedCode,
  selectedCompetition,
  projects,
  ageBand,
}: {
  competitions: CompetitionPoint[];
  selectedCode: string;
  setSelectedCode: (value: string) => void;
  selectedCompetition: CompetitionPoint | null;
  projects: Project[];
  ageBand: string;
}) {
  const codes = Array.from(new Map(competitions.map((item) => [item.competition_code, item.competition_name])).entries());
  const suitableProjects = projects.filter((project) => selectedCompetition && project.target_competitions.some((item) => item.includes(selectedCompetition.competition_name) || item.includes(selectedCompetition.competition_code))).slice(0, 5);
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">竞赛备赛</h2>
          <p className="mt-1 text-sm text-muted">按竞赛点、成熟度和交付物给建议。</p>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <SelectBare value={selectedCode} onChange={setSelectedCode} options={["", ...codes.map(([code]) => code)]} emptyLabel="选择竞赛方向" />
          <Badge>{ageBand || "全部年龄"}</Badge>
        </CardContent>
      </Card>
      {!selectedCompetition ? <EmptyState title="请选择竞赛方向" /> : (
        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader><h2 className="font-semibold text-ink">{selectedCompetition.competition_name}</h2></CardHeader>
            <CardContent className="grid gap-4">
              <InfoGrid rows={[
                ["赛项代码", selectedCompetition.competition_code],
                ["赛道", selectedCompetition.track ?? "--"],
                ["领域", selectedCompetition.domain],
                ["能力类型", selectedCompetition.ability_type],
              ]} />
              <MappedCard title="评分关注" items={[selectedCompetition.scoring_dimension ?? "项目完整度、创新性、技术实现、表达展示"]} />
              <MappedCard title="交付物" items={selectedCompetition.deliverables} />
              <MappedCard title="风险提示" items={["复核当年官方规则", "确认组别、设备、材料和截止日期", "不承诺获奖"]} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><h2 className="font-semibold text-ink">适配项目与周计划</h2></CardHeader>
            <CardContent className="grid gap-3">
              {(suitableProjects.length ? suitableProjects : projects.slice(0, 4)).map((project) => (
                <Link key={project.project_id} to={`/projects/${project.project_id}`} className="rounded-lg border border-line bg-canvas p-4 transition hover:border-ink">
                  <div className="flex flex-wrap gap-2">
                    <Badge level={project.age_band}>{project.age_band}</Badge>
                    <span className="tag bg-white">{project.maturity_level}</span>
                  </div>
                  <h3 className="mt-3 font-semibold text-ink">{project.project_name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">交付物：{compactList(project.project_outputs, 3)}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>
      )}
    </section>
  );
}

function CoveragePanel({ highFrequency, loading, competitions }: { highFrequency: HighFrequencyKnowledgePoint[]; loading: boolean; competitions: CompetitionPoint[] }) {
  const codes = new Set(competitions.map((item) => item.competition_code));
  return (
    <section className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="高频知识点" value={`${highFrequency.length}个`} icon={BookOpenCheck} />
        <Metric label="竞赛方向" value={`${codes.size}个`} icon={GraduationCap} />
        <Metric label="证据状态" value="已接入" icon={Network} />
        <Metric label="后续覆盖率" value="P1" icon={BarChart3} />
      </section>
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">高频知识点榜单</h2>
          <p className="mt-1 text-sm text-muted">按证据、题型、项目和频率排序。</p>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingState label="高频知识点加载中" /> : null}
          {!loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {highFrequency.map((item) => (
                <div key={item.knowledge_point_id} className="rounded-lg border border-line bg-canvas p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge level={item.age_band}>{item.age_band}</Badge>
                    <span className="font-mono text-xs text-muted">{item.knowledge_point_id}</span>
                    <span className="tag bg-white">重要度 {item.overall_importance_score}</span>
                  </div>
                  <h3 className="mt-3 font-semibold text-ink">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.recommended_teaching_action}</p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

function ClassroomQaPanel({ selectedKp, selectedProject }: { selectedKp: KnowledgePoint | null; selectedProject: Project | null }) {
  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-ink">课堂问答</h2>
          <p className="mt-1 text-sm text-muted">先给追问方向，后续接 GraphRAG。</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <MappedCard title="可追问知识点" items={[
            selectedKp ? `这个知识点重要吗：${selectedKp.name}` : "这个知识点在哪考过？",
            selectedKp ? `前置知识：${selectedKp.id}` : "这个题型怎么补？",
            selectedKp ? "能用在哪些项目？" : "怎么向家长解释？",
          ]} />
          <MappedCard title="可追问项目" items={[
            selectedProject ? `备赛依据：${selectedProject.project_name}` : "能对标哪些竞赛？",
            selectedProject ? `如何降低项目难度？` : "如何从知识点反推项目？",
            selectedProject ? "怎么准备答辩？" : "怎么生成课堂材料？",
          ]} />
        </CardContent>
      </Card>
      <ButtonLink to="/rag-demo" variant="secondary">进入 RAG</ButtonLink>
    </section>
  );
}

function teacherTaskTypeLabel(type: string) {
  const labels: Record<string, string> = {
    zongping_material_candidate: "综评候选",
    parent_feedback_draft: "反馈草稿",
    next_lesson_package: "下节任务",
    markdownflow_question_review: "题型复核",
  };
  return labels[type] ?? type;
}

function teacherTaskStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "待处理",
    in_progress: "进行中",
    completed: "已完成",
    dismissed: "已忽略",
    canceled: "已取消",
  };
  return labels[status] ?? status;
}

function teacherTaskPriorityLabel(priority: string) {
  const labels: Record<string, string> = {
    high: "高优先级",
    medium: "中优先级",
    low: "低优先级",
  };
  return labels[priority] ?? priority;
}

function teacherTaskStatusClass(status: string) {
  if (status === "completed") return "border-success/30 bg-success/10 text-success";
  if (status === "in_progress") return "border-warning/30 bg-warning/10 text-warning";
  if (status === "dismissed" || status === "canceled") return "border-muted/30 bg-canvas text-muted";
  return "";
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <input className="h-10 rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-ink" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <textarea className="min-h-24 resize-y rounded-md border border-line bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-ink" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <input className="h-10 rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-ink" type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <select className="h-10 rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-ink" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SelectBare({ value, options, emptyLabel, labels, onChange }: { value: string; options: string[]; emptyLabel: string; labels?: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <select className="h-11 rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-ink" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option || emptyLabel} value={option}>{option ? (labels?.[option] ?? option) : emptyLabel}</option>)}
    </select>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3.5 size-4 text-muted" />
      <input className="h-11 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm outline-none transition focus:border-ink" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-xs font-semibold text-muted">{label}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">{value}</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-md bg-canvas text-muted">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

function WhiteStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-white/10 px-3 py-2">
      <span className="text-sm text-white/65">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function ActionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function ListBlock({ title, icon: Icon, items }: { title: string; icon: LucideIcon; items: unknown[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <div className="mb-3 flex items-center gap-2 font-semibold text-ink">
        <Icon className="size-4" />
        {title}
      </div>
      <div className="grid gap-2">
        {items.map((item, index) => <p key={`${title}-${index}`} className="text-sm leading-6 text-muted">{stringValue(item)}</p>)}
      </div>
    </div>
  );
}

function TagRow({ title, items }: { title: string; items: unknown[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => <span key={stringValue(item)} className="tag bg-white">{stringValue(item)}</span>)}
      </div>
    </div>
  );
}

function examDisplayTags(project: Project) {
  const display = safeList(project.display_exam_tags);
  const target = safeList(project.target_exams);
  const recommended = safeList(project.recommended_exams);
  const foundations = safeList(project.pre_exam_foundation_for);
  if (display.length > 0) return display;
  if (target.length > 0) return target;
  if (recommended.length > 0) return recommended;
  if (foundations.length > 0) return foundations.map((item) => `前置：${item}`);
  return [];
}

function competitionDisplayTags(project: Project) {
  const display = safeList(project.display_competition_tags);
  const target = safeList(project.target_competitions);
  const recommended = safeList(project.recommended_competitions);
  if (display.length > 0) return display;
  if (target.length > 0) return target;
  if (recommended.length > 0) return recommended;
  if (project.competition_alignment_type === "creativity_exhibition") return ["创意展示"];
  return [];
}

function safeList(items: unknown): string[] {
  return Array.isArray(items) ? items.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function projectAlignmentWarning(project: Project) {
  if (!["L2", "L3", "L4", "L5"].includes(project.age_band)) return "";
  if (examDisplayTags(project).length > 0 && competitionDisplayTags(project).length > 0) return "";
  return "该 L2+ 项目缺少考级或竞赛映射。L2以上项目通常应至少具备考级预备、正式等级考试、竞赛启蒙或项目展示方向，请补充 alignment 配置。";
}

function WarningNote({ value }: { value: string }) {
  return (
    <div className="flex gap-2 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm leading-6 text-muted">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-l5-gold" />
      <span>{value}</span>
    </div>
  );
}

function MappedCard({ title, items, fallback = "暂无" }: { title: string; items: unknown[]; fallback?: string }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <p className="mb-3 font-semibold text-ink">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? <span className="text-sm text-muted">{fallback}</span> : null}
        {items.map((item, index) => <span key={`${title}-${index}-${stringValue(item)}`} className="tag bg-white">{stringValue(item)}</span>)}
      </div>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <p className="mb-2 font-semibold text-ink">{title}</p>
      <p className="text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}

function EvidenceTable({ title, evidence }: { title: string; evidence: KnowledgeEvidence[] }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <p className="mb-3 font-semibold text-ink">{title}</p>
      <div className="grid gap-3">
        {evidence.length === 0 ? <p className="text-sm text-muted">暂无记录。</p> : null}
        {evidence.slice(0, 5).map((item) => (
          <div key={item.evidence_id} className="rounded-md border border-line bg-white p-3">
            <div className="flex flex-wrap gap-2">
              <span className="tag">{item.evidence_type}</span>
              <span className="tag">{item.source_system}</span>
              <span className="tag">{item.evidence_strength}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{item.question_summary ?? item.scoring_point ?? item.application_context}</p>
            <p className="mt-2 font-mono text-xs text-muted">{item.evidence_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CasesTable({ title, cases }: { title: string; cases: KnowledgeApplicationCase[] }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <p className="mb-3 font-semibold text-ink">{title}</p>
      <div className="grid gap-3">
        {cases.length === 0 ? <p className="text-sm text-muted">暂无项目应用记录。</p> : null}
        {cases.slice(0, 5).map((item) => (
          <div key={item.case_id} className="rounded-md border border-line bg-white p-3">
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-xs text-muted">{item.project_id}</span>
              <span className="tag">{item.maturity_level}</span>
              <span className="tag">{item.evidence_strength}</span>
            </div>
            <p className="mt-2 font-semibold text-ink">{item.case_title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.case_summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatternsTable({ patterns }: { patterns: KnowledgeQuestionPattern[] }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <p className="mb-3 font-semibold text-ink">常见题型</p>
      <div className="grid gap-3">
        {patterns.length === 0 ? <p className="text-sm text-muted">暂无题型模式。</p> : null}
        {patterns.slice(0, 4).map((item) => (
          <div key={item.pattern_id} className="rounded-md border border-line bg-white p-3">
            <p className="font-semibold text-ink">{item.pattern_name}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.example_prompt}</p>
            <p className="mt-2 text-xs text-muted">策略：{item.teaching_strategy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoGrid({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="grid gap-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-md border border-line bg-canvas p-3">
          <p className="text-xs font-semibold text-muted">{label}</p>
          <p className="mt-1 text-sm leading-6 text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}

function normalizeViewMode(value: string | null): ViewMode {
  const normalized = (value || "teacher_view").trim();
  if (["teacher_view", "admin_view", "consultant_view", "parent_view", "demo_view", "public_view"].includes(normalized)) {
    return normalized as ViewMode;
  }
  if (normalized === "teacher" || normalized === "admin") return `${normalized}_view` as ViewMode;
  if (normalized === "consultant" || normalized === "parent" || normalized === "demo" || normalized === "public") return `${normalized}_view` as ViewMode;
  return "teacher_view";
}

function normalizeTeacherTab(value: string | null): TeacherTab | null {
  const normalized = (value || "").trim();
  const tabIds = [...teacherNavItems, ...consultantNavItems].map((item) => item.id);
  return tabIds.includes(normalized as TeacherTab) ? (normalized as TeacherTab) : null;
}

function roleLabel(value: string) {
  const labels: Record<string, string> = {
    admin: "管理员",
    curriculum_lead: "教研负责人",
    teacher: "教师",
    consultant: "顾问",
    parent: "家长",
    demo: "演示",
  };
  return labels[value] ?? value;
}

function alertTypeLabel(value: string) {
  const labels: Record<string, string> = {
    repeated_knowledge: "重复知识点",
    ready_to_advance: "可推进",
    missing_prerequisite: "缺前置",
    narrow_project_scope: "项目单一",
    maturity_upgrade_needed: "成熟度升级",
    stale_progress: "进度未更新",
  };
  return labels[value] ?? value;
}

function consultantContent(
  tab: TeacherTab,
  focus: Project | null,
  workspace: TeacherWorkspaceResponse | null,
  highFrequency: HighFrequencyKnowledgePoint[],
) {
  const projectName = focus?.project_name ?? "阶段项目";
  const projectOutputs = focus?.project_outputs?.length ? focus.project_outputs : ["可运行作品", "项目报告", "演示视频", "成长档案"];
  const pathItems = workspace?.recommendation.recommended_path.map((item) => stringValue(item.focus)).filter(Boolean) ?? ["兴趣启蒙", "项目实践", "成果展示", "证据沉淀"];
  const knowledgeItems = highFrequency.slice(0, 4).map((item) => item.name);
  const baseBlocks = [
    { title: "成长路径示意", items: pathItems.slice(0, 4) },
    { title: "项目成果类型", items: projectOutputs.slice(0, 5) },
    { title: "知识点覆盖概览", items: knowledgeItems.length ? knowledgeItems : ["编程逻辑", "工程搭建", "数据表达"] },
  ];
  const mapping: Partial<Record<TeacherTab, { title: string; subtitle: string; blocks: Array<{ title: string; items: string[] }> }>> = {
    overview: {
      title: "系统概览",
      subtitle: "面向家长展示路径、项目、证据和反馈样例，不提供内部操作入口。",
      blocks: baseBlocks,
    },
    growth: {
      title: "成长路径",
      subtitle: "按年龄阶段展示可理解的学习路线。",
      blocks: [
        { title: "当前阶段", items: [workspace?.recommendation.stage ?? focus?.age_band ?? "L3"] },
        { title: "下一步方向", items: pathItems.slice(0, 5) },
        { title: "阶段边界", items: ["先项目实践", "再成果表达", "按真实证据推进"] },
      ],
    },
    outcomes: {
      title: "项目成果",
      subtitle: `以“${projectName}”为例展示作品、报告和成长材料。`,
      blocks: [
        { title: "可见成果", items: projectOutputs.slice(0, 5) },
        { title: "项目价值", items: [focus?.parent_value ?? "帮助孩子把知识点转为可展示作品。"] },
        { title: "后续应用", items: ["成长档案", "项目展示", "综合评价材料"] },
      ],
    },
    portfolioSample: {
      title: "成长档案示例",
      subtitle: "展示档案结构和证据类型，不展示学生完整隐私。",
      blocks: [
        { title: "档案结构", items: ["项目摘要", "过程记录", "成果材料", "下一步建议"] },
        { title: "证据类型", items: ["作品照片", "演示视频", "项目报告"] },
        { title: "展示原则", items: ["真实记录", "不过度包装", "可追溯"] },
      ],
    },
    evidenceChain: {
      title: "交付证据链",
      subtitle: "展示项目成果如何连接知识点、能力和综评材料。",
      blocks: [
        { title: "证据节点", items: ["项目记录", "知识点覆盖", "成果材料"] },
        { title: "可追溯关系", items: ["项目到知识点", "项目到能力", "项目到综评"] },
        { title: "家长可见", items: ["进度概览", "成果样例", "反馈摘要"] },
      ],
    },
    parentSample: {
      title: "家长可见反馈样例",
      subtitle: "只展示面向家庭沟通的结果摘要和下一步建议。",
      blocks: [
        { title: "课堂表现", items: ["能完成核心任务", "能说明作品用途", "需要继续练习表达"] },
        { title: "项目进度", items: ["已完成阶段作品", "正在整理成果材料"] },
        { title: "下一步", items: ["巩固关键知识", "补充展示材料", "选择后续项目"] },
      ],
    },
  };
  return mapping[tab] ?? mapping.overview!;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function parseRows(text: string): Array<Record<string, unknown>> {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed as Array<Record<string, unknown>>;
    const rows = objectValue(parsed).rows;
    if (Array.isArray(rows)) return rows as Array<Record<string, unknown>>;
    return [objectValue(parsed)];
  }
  return parseCsvRows(trimmed);
}

function parseCsvRows(text: string): Array<Record<string, unknown>> {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      row[header] = parseImportCell(values[index] ?? "");
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuote = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === "\"" && inQuote && next === "\"") {
      current += "\"";
      index += 1;
      continue;
    }
    if (char === "\"") {
      inQuote = !inQuote;
      continue;
    }
    if (char === "," && !inQuote) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

function parseImportCell(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  if (trimmed.includes("|")) return trimmed.split("|").map((item) => item.trim()).filter(Boolean);
  return trimmed;
}

function splitListInput(value: string): string[] {
  return value
    .split(/[,，|、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function nextMaturityLevel(value: string) {
  const levels = ["P1", "P2", "P3", "P4"];
  const index = levels.indexOf(value);
  return levels[Math.min(index + 1, levels.length - 1)] ?? "P2";
}

function stringValue(value: unknown, fallback = "--") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
