import {
  BarChart3,
  Bell,
  BookMarked,
  Building2,
  ClipboardCheck,
  DatabaseZap,
  FileArchive,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Menu,
  PackageCheck,
  PlugZap,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";

import { api } from "@/api/client";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AuthPermissionResponse } from "@/types/api";

const adminNav = [
  { label: "总览", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "校区管理", to: "/admin/campuses", icon: Building2 },
  { label: "教师管理", to: "/admin/teachers", icon: UsersRound },
  { label: "班级管理", to: "/admin/classes", icon: GraduationCap },
  { label: "学生项目", to: "/admin/student-projects", icon: BookMarked },
  { label: "项目进展", to: "/admin/project-progress", icon: BarChart3 },
  { label: "项目验收", to: "/admin/acceptance", icon: ClipboardCheck },
  { label: "交付物", to: "/admin/deliverables", icon: FileCheck2 },
  { label: "知识点覆盖", to: "/admin/knowledge-coverage", icon: Gauge },
  { label: "竞赛/综评", to: "/admin/competition-zongping", icon: ShieldCheck },
  { label: "草案提审", to: "/admin/event-graph/project-package-review", icon: Send },
  { label: "项目插件", to: "/admin/project-plugins", icon: PackageCheck },
  { label: "RAG 健康度", to: "/admin/rag-health", icon: DatabaseZap },
  { label: "数据质量", to: "/admin/data-quality", icon: ShieldAlert },
  { label: "通知中心", to: "/admin/notifications", icon: Bell },
  { label: "成绩复核", to: "/admin/answer-audit", icon: ClipboardCheck },
  { label: "小麦同步", to: "/admin/integrations/xiaomai", icon: PlugZap },
  { label: "WorkBuddy", to: "/admin/workbuddy-artifacts", icon: FileText },
  { label: "报表导出", to: "/admin/reports", icon: FileArchive },
  { label: "系统设置", to: "/admin/settings", icon: Settings },
];

const filterKeys = ["time_range", "campus_id", "course_level", "course_track", "teacher_user_id", "class_id", "project_status"] as const;
type AdminFilterKey = (typeof filterKeys)[number];
type AdminFilters = Record<AdminFilterKey, string>;

const emptyFilters: AdminFilters = {
  time_range: "month",
  campus_id: "",
  course_level: "",
  course_track: "",
  teacher_user_id: "",
  class_id: "",
  project_status: "",
};

export function AdminConsoleLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.toString();
  const [filters, setFilters] = useState<AdminFilters>(() => readFilters(searchParams));
  const [auth, setAuth] = useState<AuthPermissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.authMe()
      .then((result) => {
        setAuth(result);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "权限校验失败"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilters(readFilters(searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const allowed = Boolean(auth?.admin_console_allowed || auth?.admin_tools_allowed);

  function updateFilter(key: AdminFilterKey, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function applyFilters() {
    const next = new URLSearchParams(searchParams);
    filterKeys.forEach((key) => {
      const value = filters[key];
      if (value && !(key === "time_range" && value === "month")) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams);
    filterKeys.forEach((key) => next.delete(key));
    setFilters(emptyFilters);
    setSearchParams(next);
  }

  function exitAdmin() {
    api.clearAuthToken();
    setOpen(false);
    navigate("/", { replace: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F7F8FA] text-sm text-[#6B7280]">
        管理后台权限校验中
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-dvh bg-[#F7F8FA]">
        <main className="mx-auto flex min-h-dvh max-w-[720px] flex-col justify-center px-6 py-10">
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-subtle">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#0B1F3A] text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold text-[#111827]">需要管理后台权限</h1>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              当前账号没有 Admin Console 访问权限。教师请回到教师台，顾问请使用展示视图。
            </p>
            {error ? <p className="mt-3 text-xs text-danger">{error}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink to="/teacher" variant="secondary">教师台</ButtonLink>
              <Button
                variant="secondary"
                onClick={() => {
                  api.setAuthToken("dev-admin-token");
                  window.location.reload();
                }}
              >
                开发管理员
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F7F8FA] text-[#111827]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B1F3A] text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link to="/admin/dashboard" className="min-w-0">
            <p className="truncate text-sm font-semibold">唯思乐管理后台</p>
            <p className="text-xs text-white/55">Admin Operations Console</p>
          </Link>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="关闭后台导航">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "mb-1 flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white",
                  isActive && "bg-white text-[#0B1F3A] hover:bg-white hover:text-[#0B1F3A]",
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-semibold">{auth?.display_name}</p>
          <p className="mt-1 text-xs text-white/55">{auth?.role}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 h-9 w-full border-white/20 bg-white/10 px-3 text-white hover:border-white/40 hover:bg-white/15"
            onClick={exitAdmin}
          >
            <LogOut className="h-4 w-4" />
            回首页
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white">
          <div className="flex min-h-16 items-center gap-3 px-4 py-3 lg:px-6">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E7EB] bg-white lg:hidden" onClick={() => setOpen(true)} aria-label="打开后台导航">
              <Menu className="h-5 w-5" />
            </button>
            <form
              className="grid flex-1 gap-2 md:grid-cols-2 xl:grid-cols-[112px_1fr_112px_1fr_1fr_1fr_140px_auto_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                applyFilters();
              }}
            >
              <select className={filterFieldClass} value={filters.time_range} onChange={(event) => updateFilter("time_range", event.target.value)} aria-label="时间范围">
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="term">本学期</option>
              </select>
              <input className={filterFieldClass} value={filters.campus_id} onChange={(event) => updateFilter("campus_id", event.target.value)} placeholder="校区ID" aria-label="校区" />
              <select className={filterFieldClass} value={filters.course_level} onChange={(event) => updateFilter("course_level", event.target.value)} aria-label="课程阶段">
                <option value="">L1-L5</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="L4">L4</option>
                <option value="L5">L5</option>
              </select>
              <input className={filterFieldClass} value={filters.course_track} onChange={(event) => updateFilter("course_track", event.target.value)} placeholder="课程方向" aria-label="课程方向" />
              <input className={filterFieldClass} value={filters.teacher_user_id} onChange={(event) => updateFilter("teacher_user_id", event.target.value)} placeholder="教师ID" aria-label="教师" />
              <input className={filterFieldClass} value={filters.class_id} onChange={(event) => updateFilter("class_id", event.target.value)} placeholder="班级ID" aria-label="班级" />
              <select className={filterFieldClass} value={filters.project_status} onChange={(event) => updateFilter("project_status", event.target.value)} aria-label="项目状态">
                <option value="">项目状态</option>
                <option value="active">进行中</option>
                <option value="pending_acceptance">待验收</option>
                <option value="completed">已完成</option>
              </select>
              <Button type="submit" className="h-9 bg-[#2563EB] hover:bg-[#1D4ED8]">应用</Button>
              <Button type="button" variant="secondary" className="h-9" onClick={resetFilters}>重置</Button>
            </form>
            <Button type="button" variant="secondary" className="h-9 shrink-0 px-3" onClick={exitAdmin}>
              <LogOut className="h-4 w-4" />
              回首页
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}

const filterFieldClass = "h-9 min-w-0 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15";

function readFilters(searchParams: URLSearchParams): AdminFilters {
  return filterKeys.reduce<AdminFilters>(
    (result, key) => ({ ...result, [key]: searchParams.get(key) ?? emptyFilters[key] }),
    { ...emptyFilters },
  );
}
