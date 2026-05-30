import { AlertTriangle, CheckCircle2, ClipboardCheck, Lock, PackageOpen, RefreshCw, Search, Send, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/api/client";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/StateViews";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type {
  AuthPermissionResponse,
  EventGraphGeneratedProjectDraft,
  EventGraphPackageValidationResult,
  EventGraphProjectPackageReviewResponse,
  EventGraphReviewRecord,
  ProjectPackageDetail,
  ProjectValidationResult,
} from "@/types/api";

type ReviewSurface = "teacher" | "admin";
type ValidationRow = EventGraphPackageValidationResult | ProjectValidationResult;

const ageBands = ["", "L1", "L2", "L3", "L4", "L5"];
const reviewGateStages = [
  { stage: "teacher_confirmation", label: "教师确认", passDecisions: ["teacher_confirmed", "approved"] },
  { stage: "system_validation", label: "系统校验", passDecisions: ["system_validated", "approved"] },
  { stage: "teaching_research_review", label: "教研审核", passDecisions: ["approved"] },
];

export function EventGraphPackageReviewPage({ surface }: { surface: ReviewSurface }) {
  const [auth, setAuth] = useState<AuthPermissionResponse | null>(null);
  const [drafts, setDrafts] = useState<EventGraphGeneratedProjectDraft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState("");
  const [query, setQuery] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reviewRecords, setReviewRecords] = useState<EventGraphReviewRecord[]>([]);
  const [packageDetail, setPackageDetail] = useState<ProjectPackageDetail | null>(null);
  const [reviewResult, setReviewResult] = useState<EventGraphProjectPackageReviewResponse | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmitReview = Boolean(auth?.admin_tools_allowed);
  const selectedDraft = drafts.find((draft) => draft.draft_id === selectedDraftId) ?? drafts[0] ?? null;
  const filteredDrafts = useMemo(() => filterDrafts(drafts, query, ageBand), [ageBand, drafts, query]);
  const gateRows = useMemo(() => buildGateRows(reviewRecords), [reviewRecords]);
  const readyForPackageReview = gateRows.every((gate) => gate.passed);
  const validationSummary = reviewResult?.validation_summary ?? packageDetail?.validation_summary ?? selectedDraft?.validation_summary_json ?? {};
  const validationRows: ValidationRow[] = reviewResult?.validation_results ?? packageDetail?.validation_results ?? [];
  const packageStatus = reviewResult?.package_status ?? packageDetail?.status ?? "未导入";
  const lifecycleStage = reviewResult?.lifecycle_stage ?? packageDetail?.lifecycle_stage ?? selectedDraft?.lifecycle_stage ?? "-";

  async function loadDrafts() {
    setLoading(true);
    setError("");
    try {
      const [authResult, draftRows] = await Promise.all([
        api.authMe().catch(() => null),
        api.eventGraphGeneratedProjectDrafts({ limit: 500 }),
      ]);
      setAuth(authResult);
      setDrafts(draftRows);
      setSelectedDraftId((current) => current || draftRows[0]?.draft_id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "草案队列加载失败");
    } finally {
      setLoading(false);
    }
  }

  async function loadDraftReviewContext(draft: EventGraphGeneratedProjectDraft | null) {
    if (!draft) return;
    setRecordsLoading(true);
    setActionError("");
    setReviewResult(null);
    try {
      const records = await api.eventGraphReviewRecords(draft.draft_id, { limit: 100 });
      setReviewRecords(records);
      if (canSubmitReview) {
        try {
          setPackageDetail(await api.projectPlugin(draft.package_id));
        } catch {
          setPackageDetail(null);
        }
      } else {
        setPackageDetail(null);
      }
    } catch (err) {
      setReviewRecords([]);
      setPackageDetail(null);
      setActionError(err instanceof Error ? err.message : "审核门状态加载失败");
    } finally {
      setRecordsLoading(false);
    }
  }

  useEffect(() => {
    void loadDrafts();
  }, []);

  useEffect(() => {
    if (!selectedDraftId) return;
    void loadDraftReviewContext(selectedDraft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDraftId, canSubmitReview]);

  async function submitProjectPackageReview() {
    if (!selectedDraft) return;
    setBusy(true);
    setActionError("");
    try {
      const result = await api.prepareEventGraphProjectPackageReview(selectedDraft.draft_id, {
        actor: auth?.user_id || "event_graph_ui",
        submit_for_review: true,
      });
      setReviewResult(result);
      if (canSubmitReview) {
        setPackageDetail(await api.projectPlugin(result.package_id).catch(() => null));
      }
      toast.success(result.submitted_for_review ? "草案已进入项目包审核" : "项目包校验完成");
    } catch (err) {
      const message = err instanceof Error ? readableApiError(err.message) : "提审失败";
      setActionError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="page-shell"><LoadingState label="草案队列加载中" /></div>;
  if (error) return <div className="page-shell"><ErrorState message={error} onRetry={() => void loadDrafts()} /></div>;

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow={surface === "admin" ? "Event Graph Review" : "Teacher Draft Review"}
        title="事理图谱草案提审"
        description="草案进入 ProjectPackage 前保留教师确认、系统校验和教研审核三道门。"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void loadDrafts()}>
              <RefreshCw className="size-4" />刷新
            </Button>
            {packageDetail ? (
              <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-medium text-ink hover:border-ink" to={`/admin/project-plugins/${packageDetail.package_id}`}>
                <PackageOpen className="size-4" />项目包
              </Link>
            ) : null}
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="草案" value={String(filteredDrafts.length)} note="当前筛选" />
        <MetricCard label="项目包状态" value={packageStatus} note={lifecycleStage} />
        <MetricCard label="审核门" value={readyForPackageReview ? "ready" : "blocked"} note={readyForPackageReview ? "可进入项目包审核" : "需补齐审核"} />
        <MetricCard label="校验" value={summaryValue(validationSummary, "passed", "-")} note={`总项 ${summaryValue(validationSummary, "total", "-")}`} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-ink">草案队列</h2>
              <Badge>{String(drafts.length)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <input
                  className="h-10 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-ink"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索草案 / 项目 / 想法"
                />
              </div>
              <select className="h-10 rounded-md border border-line bg-white px-3 text-sm" value={ageBand} onChange={(event) => setAgeBand(event.target.value)}>
                {ageBands.map((item) => <option key={item || "all"} value={item}>{item || "全部阶段"}</option>)}
              </select>
            </div>

            <div className="mt-4 grid max-h-[620px] gap-2 overflow-y-auto pr-1">
              {filteredDrafts.map((draft) => (
                <button
                  key={draft.draft_id}
                  type="button"
                  className={cn(
                    "rounded-md border p-3 text-left transition",
                    selectedDraft?.draft_id === draft.draft_id ? "border-ink bg-ink text-white" : "border-line bg-canvas hover:border-ink",
                  )}
                  onClick={() => setSelectedDraftId(draft.draft_id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{draft.title}</p>
                      <p className={cn("mt-1 truncate font-mono text-xs", selectedDraft?.draft_id === draft.draft_id ? "text-white/65" : "text-muted")}>{draft.draft_id}</p>
                    </div>
                    <span className={cn("rounded-md border px-2 py-1 text-xs font-semibold", selectedDraft?.draft_id === draft.draft_id ? "border-white/25 text-white" : "border-line text-muted")}>{draft.age_band}</span>
                  </div>
                  <p className={cn("mt-2 text-xs", selectedDraft?.draft_id === draft.draft_id ? "text-white/70" : "text-muted")}>{slotLabel(draft.slot_type)} / {modeLabel(draft.generation_mode)}</p>
                </button>
              ))}
              {filteredDrafts.length === 0 ? <EmptyState title="暂无草案" description="请调整搜索或阶段筛选。" /> : null}
            </div>
          </CardContent>
        </Card>

        {selectedDraft ? (
          <div className="grid gap-5">
            {actionError ? <ErrorState message={actionError} onRetry={() => void loadDraftReviewContext(selectedDraft)} /> : null}
            {recordsLoading ? <LoadingState label="审核门状态加载中" /> : null}

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted">{selectedDraft.package_id}</p>
                    <h2 className="mt-1 text-xl font-semibold text-ink">{selectedDraft.title}</h2>
                    <p className="mt-2 text-sm text-muted">{selectedDraft.project_id} / {selectedDraft.created_by}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge level={selectedDraft.age_band}>{selectedDraft.age_band}</Badge>
                    <Badge>{selectedDraft.status}</Badge>
                    <Badge>{modeLabel(selectedDraft.generation_mode)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoTile label="插入位" value={slotLabel(selectedDraft.slot_type)} />
                <InfoTile label="Project ID" value={selectedDraft.project_id} />
                <InfoTile label="Package ID" value={selectedDraft.package_id} />
                <InfoTile label="创建时间" value={formatDate(selectedDraft.created_at)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-ink" />
                  <h2 className="font-semibold text-ink">审核门</h2>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-3">
                {gateRows.map((gate) => (
                  <div key={gate.stage} className={cn("rounded-md border p-4", gate.passed ? "border-success/30 bg-success/10" : "border-line bg-canvas")}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-ink">{gate.label}</p>
                      {gate.passed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                    </div>
                    <p className="mt-2 text-sm text-muted">{gate.record ? gate.record.decision_reason : "待补齐"}</p>
                    <p className="mt-3 font-mono text-xs text-muted">{gate.record?.draft_status_after ?? gate.stage}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-ink" />
                    <h2 className="font-semibold text-ink">ProjectPackage 校验</h2>
                  </div>
                  <Button onClick={() => void submitProjectPackageReview()} disabled={busy || !canSubmitReview || !readyForPackageReview}>
                    {canSubmitReview ? <Send className="size-4" /> : <Lock className="size-4" />}
                    {busy ? "提审中" : "校验并提审"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                {!canSubmitReview ? <WarningLine value="当前账号没有管理权限，教师端仅展示草案与审核门状态。" /> : null}
                {canSubmitReview && !readyForPackageReview ? <WarningLine value="草案尚未达到 ready_for_project_package_review，不能进入 ProjectPackage 校验/提审。" /> : null}

                <div className="grid gap-3 md:grid-cols-4">
                  <InfoTile label="总项" value={summaryValue(validationSummary, "total", "-")} />
                  <InfoTile label="通过" value={summaryValue(validationSummary, "passed", "-")} />
                  <InfoTile label="错误" value={summaryValue(validationSummary, "failed_errors", "-")} />
                  <InfoTile label="可启用" value={booleanLabel(validationSummary.can_activate)} />
                </div>

                {validationRows.length > 0 ? (
                  <div className="grid gap-2">
                    {validationRows.map((item) => (
                      <div key={item.validation_id} className="flex items-start justify-between gap-3 rounded-md border border-line bg-canvas p-3 text-sm">
                        <div>
                          <p className="font-semibold text-ink">{item.validation_type}</p>
                          <p className="mt-1 text-muted">{item.message}</p>
                        </div>
                        <span className={item.passed ? "text-success" : "text-warning"}>{item.passed ? "通过" : item.severity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <DraftValidationPreview draft={selectedDraft} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-ink">审核记录</h2>
              </CardHeader>
              <CardContent className="grid gap-2">
                {reviewRecords.map((record) => (
                  <div key={record.review_id} className="rounded-md border border-line bg-canvas p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-ink">{stageLabel(record.review_stage)} / {decisionLabel(record.decision)}</p>
                      <span className="font-mono text-xs text-muted">{formatDate(record.created_at)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">{record.decision_reason}</p>
                    {record.required_changes.length > 0 ? <p className="mt-2 text-xs text-warning">{record.required_changes.join(" / ")}</p> : null}
                  </div>
                ))}
                {reviewRecords.length === 0 ? <EmptyState title="暂无审核记录" description="教师确认、系统校验、教研审核完成后会显示在这里。" /> : null}
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState title="暂无可查看草案" />
        )}
      </div>
    </div>
  );
}

function filterDrafts(drafts: EventGraphGeneratedProjectDraft[], query: string, ageBand: string) {
  const needle = query.trim().toLowerCase();
  return drafts.filter((draft) => {
    if (ageBand && draft.age_band !== ageBand) return false;
    if (!needle) return true;
    return [draft.draft_id, draft.idea_id, draft.package_id, draft.project_id, draft.title, draft.generation_mode, draft.slot_type]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}

function buildGateRows(records: EventGraphReviewRecord[]) {
  return reviewGateStages.map((gate) => {
    const record = records.find((item) => item.review_stage === gate.stage);
    const passed = Boolean(
      record
      && (gate.passDecisions.includes(record.decision) || record.draft_status_after === "ready_for_project_package_review"),
    );
    return { ...gate, record, passed };
  });
}

function DraftValidationPreview({ draft }: { draft: EventGraphGeneratedProjectDraft }) {
  const requiredReview = stringList(draft.validation_summary_json.required_review);
  return (
    <div className="rounded-md border border-line bg-canvas p-4">
      <p className="font-semibold text-ink">草案预检</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <InfoTile label="可启用" value={booleanLabel(draft.validation_summary_json.can_activate)} />
        <InfoTile label="必需审核" value={requiredReview.length ? requiredReview.join(" / ") : "暂无"} />
        <InfoTile label="文件数" value={summaryValue(draft.validation_summary_json, "file_count", "-")} />
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-canvas p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-ink">{value || "-"}</p>
    </div>
  );
}

function WarningLine({ value }: { value: string }) {
  return (
    <div className="flex gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm leading-6 text-muted">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-l5-gold" />
      <span>{value}</span>
    </div>
  );
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function summaryValue(summary: Record<string, unknown>, key: string, fallback: string) {
  const value = summary[key];
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function booleanLabel(value: unknown) {
  if (value === true) return "是";
  if (value === false) return "否";
  return "-";
}

function slotLabel(value: string) {
  const labels: Record<string, string> = {
    pre_remediation: "前置补齐",
    synchronous_carrier: "同步承载",
    extension_challenge: "延伸挑战",
    review_repair: "复盘修复",
    competition_packaging: "竞赛包装",
    zongping_portfolio: "综合评价",
  };
  return labels[value] ?? value;
}

function modeLabel(value: string) {
  const labels: Record<string, string> = {
    reuse_existing: "复用项目",
    variant: "项目变体",
    new_package: "新项目包",
  };
  return labels[value] ?? value;
}

function stageLabel(value: string) {
  const labels: Record<string, string> = {
    teacher_confirmation: "教师确认",
    system_validation: "系统校验",
    teaching_research_review: "教研审核",
  };
  return labels[value] ?? value;
}

function decisionLabel(value: string) {
  const labels: Record<string, string> = {
    approved: "通过",
    changes_requested: "要求修改",
    rejected: "驳回",
    teacher_confirmed: "教师已确认",
    system_validated: "系统已校验",
  };
  return labels[value] ?? value;
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

function readableApiError(value: string) {
  try {
    const parsed = JSON.parse(value) as { detail?: string };
    return parsed.detail || value;
  } catch {
    return value;
  }
}
