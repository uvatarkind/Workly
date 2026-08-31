import { Navigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  personalPath,
  projectPathFor,
  resolvePersonalWorkspace,
  workspacePathFor,
} from './routes';

export function LegacyWorkspaceRedirect({ section = 'dashboard' }) {
  const { activeWorkspace, myWorkspaces, getWorkspaceBySlug } = useApp();
  const personal = resolvePersonalWorkspace(myWorkspaces, getWorkspaceBySlug);
  const workspace = activeWorkspace ?? personal ?? myWorkspaces[0];
  if (!workspace?.slug) return <Navigate to="/" replace />;
  return <Navigate to={workspacePathFor(workspace, section)} replace />;
}

export function PersonalLegacyRedirect() {
  const { '*': rest } = useParams();
  const suffix = rest?.replace(/^\//, '') || 'dashboard';
  return <Navigate to={`/personal/${suffix}`} replace />;
}

export function WorkspacePersonalLegacyRedirect() {
  const { '*': rest } = useParams();
  const suffix = rest?.replace(/^\//, '') || 'dashboard';
  return <Navigate to={`/personal/${suffix}`} replace />;
}

export function LegacyWPrefixRedirect() {
  const { workspaceId, section = 'dashboard' } = useParams();
  const { getWorkspace, getWorkspaceBySlug } = useApp();
  const workspace = getWorkspace(workspaceId) ?? getWorkspaceBySlug(workspaceId);
  if (!workspace?.slug) return <Navigate to="/" replace />;
  if (workspace.type === 'personal' || workspaceId === 'ws-personal') {
    return <Navigate to={personalPath(section)} replace />;
  }
  return <Navigate to={workspacePathFor(workspace, section)} replace />;
}

export function LegacyWProjectRedirect() {
  const { workspaceId, projectId } = useParams();
  const { getWorkspace, getProject } = useApp();
  const workspace = getWorkspace(workspaceId);
  const project = getProject(projectId);
  if (!workspace?.slug || !project?.slug) {
    return <LegacyWorkspaceRedirect section="projects" />;
  }
  return <Navigate to={projectPathFor(workspace, project)} replace />;
}

export function TasksLegacyRedirect() {
  const { projectId } = useParams();
  const { getProject, getWorkspace } = useApp();
  const project = getProject(projectId);
  if (!project) return <LegacyWorkspaceRedirect section="projects" />;
  const workspace = getWorkspace(project.workspaceId);
  if (!workspace?.slug || !project.slug) return <LegacyWorkspaceRedirect section="projects" />;
  return <Navigate to={projectPathFor(workspace, project)} replace />;
}

export function ProjectLegacyRedirect() {
  const { id } = useParams();
  const { getProject, getWorkspace } = useApp();
  const project = getProject(id);
  if (!project) return <Navigate to="/" replace />;
  const workspace = getWorkspace(project.workspaceId);
  if (!workspace?.slug || !project.slug) return <Navigate to="/" replace />;
  return <Navigate to={projectPathFor(workspace, project)} replace />;
}
