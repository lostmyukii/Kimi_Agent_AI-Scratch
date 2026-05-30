import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AdminCoveragePage } from "@/pages/AdminCoveragePage";
import { AdminCampusesPage } from "@/pages/AdminCampusesPage";
import { AdminClassesPage } from "@/pages/AdminClassesPage";
import { AdminAcceptancePage } from "@/pages/AdminAcceptancePage";
import { AdminAnswerAuditReviewPage } from "@/pages/AdminAnswerAuditReviewPage";
import { AdminCompetitionZongpingPage } from "@/pages/AdminCompetitionZongpingPage";
import { AdminDataQualityPage } from "@/pages/AdminDataQualityPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { AdminDeliverablesPage } from "@/pages/AdminDeliverablesPage";
import { AdminKnowledgeCoveragePage } from "@/pages/AdminKnowledgeCoveragePage";
import { AdminNotificationsPage } from "@/pages/AdminNotificationsPage";
import { AdminProjectProgressPage } from "@/pages/AdminProjectProgressPage";
import { AdminProjectPluginDetailPage } from "@/pages/AdminProjectPluginDetailPage";
import { AdminProjectPluginUploadPage } from "@/pages/AdminProjectPluginUploadPage";
import { AdminProjectPluginsPage } from "@/pages/AdminProjectPluginsPage";
import { AdminRagAuditPage } from "@/pages/AdminRagAuditPage";
import { AdminRagHealthPage } from "@/pages/AdminRagHealthPage";
import { AdminReportsPage } from "@/pages/AdminReportsPage";
import { AdminSettingsPage } from "@/pages/AdminSettingsPage";
import { AdminStudentProjectsPage } from "@/pages/AdminStudentProjectsPage";
import { AdminTeacherOpsAuditPage } from "@/pages/AdminTeacherOpsAuditPage";
import { AdminWorkBuddyAdoptionsPage } from "@/pages/AdminWorkBuddyAdoptionsPage";
import { AdminTeachersPage } from "@/pages/AdminTeachersPage";
import { AdminWorkBuddyArtifactsPage } from "@/pages/AdminWorkBuddyArtifactsPage";
import { AdminXiaomaiIntegrationPage } from "@/pages/AdminXiaomaiIntegrationPage";
import { AssessmentPage } from "@/pages/AssessmentPage";
import { AssessmentResultPage } from "@/pages/AssessmentResultPage";
import { CompetitionMaterialsPage } from "@/pages/CompetitionMaterialsPage";
import { EventGraphPackageReviewPage } from "@/pages/EventGraphPackageReviewPage";
import { GrowthMapPage } from "@/pages/GrowthMapPage";
import { HomePage } from "@/pages/HomePage";
import { InteractiveLessonPlayerPage } from "@/pages/InteractiveLessonPlayerPage";
import { InteractiveLessonsPage } from "@/pages/InteractiveLessonsPage";
import { KnowledgePointPage } from "@/pages/KnowledgePointPage";
import { KnowledgeTreePage } from "@/pages/KnowledgeTreePage";
import { MatrixPage } from "@/pages/MatrixPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ProjectUpgradePage } from "@/pages/ProjectUpgradePage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { RagDemoPage } from "@/pages/RagDemoPage";
import { TeacherAnswerAuditPage } from "@/pages/TeacherAnswerAuditPage";
import { TeacherClassroomAuditPage } from "@/pages/TeacherClassroomAuditPage";
import { TeacherClassroomPage } from "@/pages/TeacherClassroomPage";
import { TeacherClassroomRuntimePage } from "@/pages/TeacherClassroomRuntimePage";
import { TeacherCourseLessonPage } from "@/pages/TeacherCourseLessonPage";
import { TeacherLessonBuilderPage } from "@/pages/TeacherLessonBuilderPage";
import { TeacherLessonPlansPage } from "@/pages/TeacherLessonPlansPage";
import { TeacherPage } from "@/pages/TeacherPage";
import { TeacherParentMessagePage } from "@/pages/TeacherParentMessagePage";
import { TeacherClassProgressionPage, TeacherGroupCapabilityPage, TeacherStudentProgressionPage } from "@/pages/TeacherProgressionDetailPage";
import { TeacherXiaomaiWorkbenchPage } from "@/pages/TeacherXiaomaiWorkbenchPage";
import { TeacherZongpingPage } from "@/pages/TeacherZongpingPage";
import { StudentGapPage } from "@/pages/StudentGapPage";
import { ZongpingEntryPage } from "@/pages/ZongpingEntryPage";
import { ZongpingGeneratePage } from "@/pages/ZongpingGeneratePage";
import { ZongpingMaterialsPage } from "@/pages/ZongpingMaterialsPage";
import { ZongpingTemplatesPage } from "@/pages/ZongpingTemplatesPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/growth-map" element={<GrowthMapPage />} />
        <Route path="/knowledge-tree" element={<KnowledgeTreePage />} />
        <Route path="/knowledge/:id" element={<KnowledgePointPage />} />
        <Route path="/matrix" element={<MatrixPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/:projectId/upgrade" element={<ProjectUpgradePage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment/result" element={<AssessmentResultPage />} />
        <Route path="/student/:id/gap" element={<StudentGapPage />} />
        <Route path="/portfolio/:student_id" element={<PortfolioPage />} />
        <Route path="/competition-materials" element={<CompetitionMaterialsPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/teacher/answer-audit" element={<TeacherAnswerAuditPage />} />
        <Route path="/teacher/classroom-audit" element={<TeacherClassroomAuditPage />} />
        <Route path="/teacher/classroom/:lessonId" element={<TeacherClassroomPage />} />
        <Route path="/teacher/classroom/:lessonId/runtime" element={<TeacherClassroomRuntimePage />} />
        <Route path="/teacher/courses/:courseCode/lessons/:lessonId" element={<TeacherCourseLessonPage />} />
        <Route path="/teacher/interactive-lessons" element={<InteractiveLessonsPage />} />
        <Route path="/teacher/interactive-lessons/:interactiveLessonId" element={<InteractiveLessonPlayerPage />} />
        <Route path="/teacher/students/:studentId" element={<TeacherStudentProgressionPage />} />
        <Route path="/teacher/classes/:classId" element={<TeacherClassProgressionPage />} />
        <Route path="/teacher/groups/:groupId" element={<TeacherGroupCapabilityPage />} />
        <Route path="/teacher/lesson-builder" element={<TeacherLessonBuilderPage />} />
        <Route path="/teacher/project-package-review" element={<EventGraphPackageReviewPage surface="teacher" />} />
        <Route path="/teacher/lesson-plans" element={<TeacherLessonPlansPage />} />
        <Route path="/teacher/parent-message" element={<TeacherParentMessagePage />} />
        <Route path="/teacher/xiaomai/workbench" element={<TeacherXiaomaiWorkbenchPage />} />
        <Route path="/teacher/zongping" element={<TeacherZongpingPage />} />
        <Route path="/rag-demo" element={<RagDemoPage />} />
        <Route path="/zongping" element={<Navigate to="/portfolio/STU-003#zongping" replace />} />
        <Route path="/zongping/student/:id" element={<PortfolioPage />} />
        <Route path="/zongping/generate" element={<ZongpingGeneratePage />} />
        <Route path="/zongping/entry/:id" element={<ZongpingEntryPage />} />
        <Route path="/zongping/materials" element={<ZongpingMaterialsPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/campuses" element={<AdminCampusesPage />} />
        <Route path="/admin/teachers" element={<AdminTeachersPage />} />
        <Route path="/admin/classes" element={<AdminClassesPage />} />
        <Route path="/admin/student-projects" element={<AdminStudentProjectsPage />} />
        <Route path="/admin/project-progress" element={<AdminProjectProgressPage />} />
        <Route path="/admin/acceptance" element={<AdminAcceptancePage />} />
        <Route path="/admin/deliverables" element={<AdminDeliverablesPage />} />
        <Route path="/admin/knowledge-coverage" element={<AdminKnowledgeCoveragePage />} />
        <Route path="/admin/competition-zongping" element={<AdminCompetitionZongpingPage />} />
        <Route path="/admin/data-quality" element={<AdminDataQualityPage />} />
        <Route path="/admin/rag-health" element={<AdminRagHealthPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
        <Route path="/admin/answer-audit" element={<AdminAnswerAuditReviewPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/coverage" element={<AdminCoveragePage />} />
        <Route path="/admin/rag-audit" element={<AdminRagAuditPage />} />
        <Route path="/admin/teacher-ops-audit" element={<AdminTeacherOpsAuditPage />} />
        <Route path="/admin/workbuddy-artifacts" element={<AdminWorkBuddyArtifactsPage />} />
        <Route path="/admin/workbuddy-adoptions" element={<AdminWorkBuddyAdoptionsPage />} />
        <Route path="/admin/integrations/xiaomai" element={<AdminXiaomaiIntegrationPage />} />
        <Route path="/admin/project-plugins" element={<AdminProjectPluginsPage />} />
        <Route path="/admin/event-graph/project-package-review" element={<EventGraphPackageReviewPage surface="admin" />} />
        <Route path="/admin/project-plugins/upload" element={<AdminProjectPluginUploadPage />} />
        <Route path="/admin/project-plugins/:packageId" element={<AdminProjectPluginDetailPage />} />
        <Route path="/admin/zongping/templates" element={<ZongpingTemplatesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
