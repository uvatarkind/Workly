import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function WorkspaceAccess({ workspaceId, children }) {
  const {
    getWorkspace,
    isWorkspaceMember,
    getPendingInvitesForUser,
    acceptWorkspaceInvite,
  } = useApp();

  const workspace = getWorkspace(workspaceId);
  if (!workspace) {
    return <p className="empty-state">Workspace not found.</p>;
  }

  if (isWorkspaceMember(workspaceId)) {
    return children;
  }

  const pendingInvite = getPendingInvitesForUser().find(
    (inv) => inv.workspaceId === workspaceId,
  );

  function handleAccept() {
    if (pendingInvite) acceptWorkspaceInvite(pendingInvite.id);
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>{workspace.icon} {workspace.name}</h1>
        <p>You are not a member of this workspace yet.</p>
      </header>
      <section className="panel invite-access-card">
        {pendingInvite ? (
          <>
            <p>You have a pending invite to join this team workspace.</p>
            <div className="invite-access-actions">
              <button type="button" className="primary-btn" onClick={handleAccept}>
                Accept invite
              </button>
              <Link to="/notifications" className="ghost-btn">View in notifications</Link>
            </div>
          </>
        ) : (
          <>
            <p>Ask a workspace admin to invite you, or check your notifications for pending invites.</p>
            <Link to="/notifications" className="ghost-btn">Go to notifications</Link>
          </>
        )}
      </section>
    </div>
  );
}
