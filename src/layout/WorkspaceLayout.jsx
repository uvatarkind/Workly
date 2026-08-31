import { Link, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSyncActiveWorkspace } from '../utils/useSyncActiveWorkspace';
import { workspaceSectionPath } from '../utils/useWorkspaceScope';

export default function WorkspaceLayout() {
  const { workspaceId } = useParams();
  const parentContext = useOutletContext() ?? {};
  const { getWorkspace, isWorkspaceMember } = useApp();

  useSyncActiveWorkspace(workspaceId);

  const workspace = workspaceId ? getWorkspace(workspaceId) : null;
  const isMember = workspaceId ? isWorkspaceMember(workspaceId) : false;

  if (!workspaceId || !workspace) {
    return <p className="empty-state">Workspace not found.</p>;
  }

  if (!isMember) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>{workspace.icon} {workspace.name}</h1>
          <p>You don&apos;t have access to this workspace.</p>
        </header>
        <Link to={workspaceSectionPath(workspaceId, 'dashboard')} className="ghost-btn">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <Outlet context={{ ...parentContext, workspaceId, workspace }} />
  );
}
