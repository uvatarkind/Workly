import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import WorkspaceTasksPage from './pages/WorkspaceTasksPage';
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import MembersPage from './pages/MembersPage';
import TimelinePage from './pages/TimelinePage';
import FilesPage from './pages/FilesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="workspace/:id" element={<WorkspacePage />} />
            <Route path="workspace/:id/projects" element={<ProjectsPage />} />
            <Route path="workspace/:id/tasks" element={<WorkspaceTasksPage />} />
            <Route path="workspace/:id/members" element={<MembersPage />} />
            <Route path="project/:id" element={<ProjectPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
