import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function useRouteWorkspaceId() {
  const location = useLocation();
  const { activeWorkspace, myWorkspaces, state } = useApp();

  const scopedMatch = location.pathname.match(/^\/w\/([^/]+)/);
  if (scopedMatch) return scopedMatch[1];

  const overviewMatch = location.pathname.match(/^\/workspace\/([^/]+)/);
  if (overviewMatch) return overviewMatch[1];

  const projectMatch = location.pathname.match(/^\/project\/([^/]+)/);
  if (projectMatch) {
    const project = state.projects.find((p) => p.id === projectMatch[1]);
    if (project?.workspaceId) return project.workspaceId;
  }

  return activeWorkspace?.id ?? myWorkspaces[0]?.id ?? 'ws-personal';
}
