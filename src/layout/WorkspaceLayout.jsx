import { Link, Navigate, Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  canonicalWorkspacePath,
  isPersonalAppPath,
  resolvePersonalWorkspace,
  workspacePathFor,
} from '../utils/routes';
import { useSyncActiveWorkspace } from '../utils/useSyncActiveWorkspace';

export default function WorkspaceLayout() {
  const { workspaceSlug: paramSlug } = useParams();
  const location = useLocation();
  const parentContext = useOutletContext() ?? {};
  const { getWorkspaceBySlug, isWorkspaceMember, myWorkspaces } = useApp();

  const isPersonalRoute = isPersonalAppPath(location.pathname);
  const workspace = isPersonalRoute
    ? resolvePersonalWorkspace(myWorkspaces, getWorkspaceBySlug)
    : (paramSlug ? getWorkspaceBySlug(paramSlug) : null);

  const workspaceId = workspace?.id ?? null;
  const workspaceSlug = workspace?.slug ?? paramSlug;

  useSyncActiveWorkspace(workspaceId);

  const isMember = workspaceId ? isWorkspaceMember(workspaceId) : false;

  if (!workspace) {
    return <p className="empty-state">Workspace not found.</p>;
  }

  if (!isPersonalRoute && workspace.type === 'personal') {
    const rest = location.pathname.replace(/^\/workspace\/[^/]+\/?/, '');
    return (
      <Navigate
        to={canonicalWorkspacePath(workspace, rest || 'dashboard')}
        replace
      />
    );
  }

  if (!isPersonalRoute && workspace.slug !== paramSlug) {
    const rest = location.pathname.replace(/^\/workspace\/[^/]+\/?/, '');
    return (
      <Navigate
        to={canonicalWorkspacePath(workspace, rest || 'dashboard')}
        replace
      />
    );
  }

  if (!isMember) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>{workspace.icon} {workspace.name}</h1>
          <p>You don&apos;t have access to this workspace.</p>
        </header>
        <Link to={workspacePathFor(workspace, 'dashboard')} className="ghost-btn">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <Outlet context={{
      ...parentContext,
      workspaceSlug,
      workspaceId,
      workspace,
    }}
    />
  );
}
