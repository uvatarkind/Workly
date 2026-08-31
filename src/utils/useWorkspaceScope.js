import { useParams, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { resolvePersonalWorkspace } from './routes';

export function useWorkspaceScope() {
  const { workspaceSlug: paramSlug } = useParams();
  const outlet = useOutletContext() ?? {};
  const workspaceSlug = paramSlug ?? outlet.workspaceSlug;
  const {
    getWorkspaceBySlug,
    getProjectsByWorkspace,
    getTasksByWorkspace,
    isWorkspaceMember,
    myWorkspaces,
    state,
  } = useApp();

  const workspaceFromOutlet = outlet.workspace;
  const workspace = workspaceFromOutlet
    ?? (workspaceSlug ? getWorkspaceBySlug(workspaceSlug) : null)
    ?? resolvePersonalWorkspace(myWorkspaces, getWorkspaceBySlug);
  const workspaceId = workspace?.id ?? null;
  const isMember = workspaceId ? isWorkspaceMember(workspaceId) : false;
  const projects = workspaceId ? getProjectsByWorkspace(workspaceId) : [];
  const tasks = workspaceId ? getTasksByWorkspace(workspaceId) : [];
  const workspaceTasks = workspaceId
    ? state.tasks.filter((t) => t.workspaceId === workspaceId)
    : [];
  const workspaceProjects = workspaceId
    ? state.projects.filter((p) => p.workspaceId === workspaceId)
    : [];

  return {
    workspaceSlug: workspace?.slug ?? workspaceSlug,
    workspaceId,
    workspace,
    isMember,
    projects,
    tasks,
    workspaceTasks,
    workspaceProjects,
  };
}

export {
  currentSectionFromPath,
  isPersonalAppPath,
  isWorkspaceProjectsPath,
  isWorkspaceSectionPath,
  workspaceSectionPath,
} from './routes';
