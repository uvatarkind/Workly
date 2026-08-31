import { Navigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { projectPath, workspacePath } from './routes';

export function LegacyWorkspaceRedirect({ section = 'dashboard' }) {
  const { activeWorkspace, myWorkspaces } = useApp();
  const id = activeWorkspace?.id ?? myWorkspaces[0]?.id ?? 'ws-personal';
  return <Navigate to={workspacePath(id, section)} replace />;
}

export function WorkspaceLegacyRedirect() {
  const { id } = useParams();
  return <Navigate to={workspacePath(id, 'dashboard')} replace />;
}

export function WorkspaceProjectsLegacyRedirect() {
  const { id } = useParams();
  return <Navigate to={`/w/${id}/projects`} replace />;
}

export function WorkspaceTasksLegacyRedirect() {
  const { id } = useParams();
  return <Navigate to={`/w/${id}/projects`} replace />;
}

export function WorkspaceMembersLegacyRedirect() {
  const { id } = useParams();
  return <Navigate to={`/w/${id}/members`} replace />;
}

export function TasksLegacyRedirect() {
  const { projectId } = useParams();
  const { getProject } = useApp();
  const project = getProject(projectId);
  if (!project) {
    return <LegacyWorkspaceRedirect section="projects" />;
  }
  return <Navigate to={projectPath(project.workspaceId, project.id)} replace />;
}

export function ProjectLegacyRedirect() {
  const { id } = useParams();
  const { getProject } = useApp();
  const project = getProject(id);
  if (!project) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={projectPath(project.workspaceId, project.id)} replace />;
}
