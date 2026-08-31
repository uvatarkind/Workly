import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isPersonalAppPath, resolvePersonalWorkspace } from './routes';

export function useRouteWorkspaceId() {
  const location = useLocation();
  const { activeWorkspace, myWorkspaces, getWorkspaceBySlug, getProject } = useApp();

  if (isPersonalAppPath(location.pathname)) {
    const personal = resolvePersonalWorkspace(myWorkspaces, getWorkspaceBySlug);
    if (personal) return personal.id;
  }

  const scopedMatch = location.pathname.match(/^\/workspace\/([^/]+)/);
  if (scopedMatch) {
    const workspace = getWorkspaceBySlug(scopedMatch[1]);
    if (workspace) return workspace.id;
  }

  const legacyMatch = location.pathname.match(/^\/w\/([^/]+)/);
  if (legacyMatch) {
    const workspace = getWorkspaceBySlug(legacyMatch[1]) ?? { id: legacyMatch[1] };
    return workspace.id ?? legacyMatch[1];
  }

  const projectMatch = location.pathname.match(/^\/project\/([^/]+)/);
  if (projectMatch) {
    const project = getProject(projectMatch[1]);
    if (project?.workspaceId) return project.workspaceId;
  }

  const personal = resolvePersonalWorkspace(myWorkspaces, getWorkspaceBySlug);
  return activeWorkspace?.id ?? personal?.id ?? myWorkspaces[0]?.id ?? 'ws-personal';
}

export function useRouteWorkspaceSlug() {
  const location = useLocation();
  const { activeWorkspace, myWorkspaces, getWorkspaceBySlug } = useApp();

  if (isPersonalAppPath(location.pathname)) {
    const personal = resolvePersonalWorkspace(myWorkspaces, getWorkspaceBySlug);
    return personal?.slug ?? 'personal';
  }

  const scopedMatch = location.pathname.match(/^\/(?:workspace|w)\/([^/]+)/);
  if (scopedMatch) {
    const workspace = getWorkspaceBySlug(scopedMatch[1]);
    if (workspace?.slug) return workspace.slug;
  }

  const personal = resolvePersonalWorkspace(myWorkspaces, getWorkspaceBySlug);
  return activeWorkspace?.slug ?? personal?.slug ?? 'personal';
}
