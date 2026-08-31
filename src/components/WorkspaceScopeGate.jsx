import { Link } from 'react-router-dom';
import { useWorkspaceScope, workspaceSectionPath } from '../utils/useWorkspaceScope';

export default function WorkspaceScopeGate({ children }) {
  const { workspace, isMember, workspaceId } = useWorkspaceScope();

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

  return children;
}
