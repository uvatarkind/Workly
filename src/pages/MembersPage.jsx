import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ROLE_LABELS } from '../data/constants';
import { useWorkspaceScope } from '../utils/useWorkspaceScope';
import PageNav from '../components/PageNav';

export default function MembersPage() {
  const { workspace, workspaceId } = useWorkspaceScope();
  const { getUser, getWorkspaceInvites, sendWorkspaceInvite, currentUser } = useApp();
  const [inviteEmail, setInviteEmail] = useState('');
  const [feedback, setFeedback] = useState(null);

  if (!workspace) return <p className="empty-state">Workspace not found.</p>;

  const members = workspace.memberIds.map((mid) => getUser(mid)).filter(Boolean);
  const pendingInvites = getWorkspaceInvites(workspaceId);

  function handleInvite(e) {
    e.preventDefault();
    const result = sendWorkspaceInvite(workspaceId, inviteEmail);
    if (result.error) {
      setFeedback({ type: 'error', text: result.error });
    } else if (result.warning) {
      setFeedback({ type: 'warning', text: result.warning });
      setInviteEmail('');
    } else {
      setFeedback({ type: 'success', text: `Invite sent to ${inviteEmail.trim()}.` });
      setInviteEmail('');
    }
  }

  return (
    <div className="page">
      <PageNav workspace={workspace} section="members" />
      <header className="page-header">
        <h1>Team members</h1>
        <p>{workspace.name}</p>
      </header>

      <section className="panel">
        <ul className="team-list">
          {members.map((member) => (
            <li key={member.id}>
              <span className="team-avatar member-avatar">{member.initials}</span>
              <div>
                <strong>
                  {member.name}
                  {member.id === currentUser.id && (
                    <span className="team-you">You</span>
                  )}
                </strong>
                <span>{member.email}</span>
              </div>
              <span className={`role-badge role-${member.role}`}>
                {ROLE_LABELS[member.role]}
              </span>
            </li>
          ))}
        </ul>

        {pendingInvites.length > 0 && (
          <div className="pending-invites-block">
            <h2>Pending invites</h2>
            <ul className="pending-invite-list">
              {pendingInvites.map((inv) => (
                <li key={inv.id}>
                  <span>{inv.email}</span>
                  <span className="pending-label">Awaiting response</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {workspace.type === 'team' && (
          <form className="team-add" onSubmit={handleInvite}>
            <input
              type="email"
              placeholder="Invite by email…"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button type="submit" className="primary-btn" disabled={!inviteEmail.trim()}>
              Send invite
            </button>
          </form>
        )}

        {feedback && (
          <p className={`invite-feedback ${feedback.type}`}>{feedback.text}</p>
        )}

        <p className="settings-note">
          Demo emails: sarah@workly.app, mike@workly.app, john@workly.app, alex@workly.app
        </p>
      </section>
    </div>
  );
}
