import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './layout/AppLayout';
import WorkspaceLayout from './layout/WorkspaceLayout';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import MembersPage from './pages/MembersPage';
import TimelinePage from './pages/TimelinePage';
import FilesPage from './pages/FilesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import {
  LegacyWPrefixRedirect,
  LegacyWProjectRedirect,
  LegacyWorkspaceRedirect,
  PersonalLegacyRedirect,
  ProjectLegacyRedirect,
  TasksLegacyRedirect,
  WorkspacePersonalLegacyRedirect,
} from './utils/workspaceRoutes';

const workspacePages = (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="projects" element={<ProjectsPage />} />
    <Route path="projects/:projectSlug" element={<ProjectPage />} />
    <Route path="members" element={<MembersPage />} />
    <Route path="timeline" element={<TimelinePage />} />
    <Route path="calendar" element={<CalendarPage />} />
    <Route path="files" element={<FilesPage />} />
    <Route path="notifications" element={<NotificationsPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </>
);

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<LegacyWorkspaceRedirect section="dashboard" />} />
            <Route path="personal" element={<WorkspaceLayout />}>
              {workspacePages}
            </Route>
            <Route path="workspace/:workspaceSlug" element={<WorkspaceLayout />}>
              {workspacePages}
            </Route>
            <Route path="dashboard" element={<LegacyWorkspaceRedirect section="dashboard" />} />
            <Route path="tasks" element={<LegacyWorkspaceRedirect section="projects" />} />
            <Route path="tasks/:projectId" element={<TasksLegacyRedirect />} />
            <Route path="timeline" element={<LegacyWorkspaceRedirect section="timeline" />} />
            <Route path="calendar" element={<LegacyWorkspaceRedirect section="calendar" />} />
            <Route path="files" element={<LegacyWorkspaceRedirect section="files" />} />
            <Route path="notifications" element={<LegacyWorkspaceRedirect section="notifications" />} />
            <Route path="settings" element={<LegacyWorkspaceRedirect section="settings" />} />
            <Route path="w/:workspaceId" element={<LegacyWPrefixRedirect />} />
            <Route path="w/:workspaceId/:section" element={<LegacyWPrefixRedirect />} />
            <Route path="w/:workspaceId/projects/:projectId" element={<LegacyWProjectRedirect />} />
            <Route path="workspace/personal/*" element={<WorkspacePersonalLegacyRedirect />} />
            <Route path="workspace/ws-personal/*" element={<PersonalLegacyRedirect />} />
            <Route path="project/:id" element={<ProjectLegacyRedirect />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
