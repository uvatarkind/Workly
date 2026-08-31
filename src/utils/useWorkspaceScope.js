import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function useWorkspaceScope() {
  const { workspaceId } = useParams();
  const {
    getWorkspace,
    getProjectsByWorkspace,
    getTasksByWorkspace,
    isWorkspaceMember,
    state,
  } = useApp();

  const workspace = workspaceId ? getWorkspace(workspaceId) : null;
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
    workspaceId,
    workspace,
    isMember,
    projects,
    tasks,
    workspaceTasks,
    workspaceProjects,
  };
}

export function workspaceSectionPath(workspaceId, section) {
  return `/w/${workspaceId}/${section}`;
}

export function currentSectionFromPath(pathname) {
  const match = pathname.match(/^\/w\/[^/]+\/(.+)$/);
  if (match) {
    const rest = match[1];
    if (rest.startsWith('projects/')) return 'projects';
    if (rest.startsWith('tasks/')) return 'projects';
    return rest.split('/')[0];
  }

  const legacy = {
    '/dashboard': 'dashboard',
    '/tasks': 'projects',
    '/timeline': 'timeline',
    '/calendar': 'calendar',
    '/files': 'files',
    '/notifications': 'notifications',
    '/settings': 'settings',
  };
  return legacy[pathname] ?? 'dashboard';
}
