import { useNavigate, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import WorkspacePageHeader from '../components/WorkspacePageHeader';
import { workspacePath } from '../utils/routes';
import { useWorkspaceScope } from '../utils/useWorkspaceScope';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const ICONS = {
  assignment: '📌',
  comment: '💬',
  due: '⏰',
  mention: '@',
  workspace_invite: '✉️',
  workspace_joined: '🎉',
};

const TASK_TYPES = new Set(['assignment', 'comment', 'due', 'mention']);

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { openTask } = useOutletContext();
  const { workspace } = useWorkspaceScope();
  const {
    myNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    acceptWorkspaceInvite,
    declineWorkspaceInvite,
    getWorkspace,
  } = useApp();

  const unread = myNotifications.filter((n) => !n.read).length;

  function handleAccept(inviteId, workspaceId) {
    const result = acceptWorkspaceInvite(inviteId);
    if (!result.error && workspaceId) {
      navigate(workspacePath(workspaceId, 'dashboard'));
    }
  }

  function handleNotificationClick(notification) {
    if (notification.taskId && TASK_TYPES.has(notification.type)) {
      openTask(notification.taskId);
      if (!notification.read) markNotificationRead(notification.id);
      return;
    }

    if (notification.type === 'workspace_joined' && notification.workspaceId) {
      navigate(workspacePath(notification.workspaceId, 'dashboard'));
      if (!notification.read) markNotificationRead(notification.id);
    }
  }

  return (
    <div className="page">
      <WorkspacePageHeader workspace={workspace} section="Notifications" />
      <header className="page-header split">
        <div>
          <p>{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
        </div>
        {unread > 0 && (
          <button type="button" className="ghost-btn" onClick={markAllNotificationsRead}>
            Mark all read
          </button>
        )}
      </header>

      <section className="panel">
        {myNotifications.length === 0 ? (
          <p className="empty-state">No notifications yet.</p>
        ) : (
          <ul className="notification-list">
            {myNotifications.map((n) => {
              const workspace = n.workspaceId ? getWorkspace(n.workspaceId) : null;
              const isClickable = Boolean(
                (n.taskId && TASK_TYPES.has(n.type)) ||
                (n.type === 'workspace_joined' && n.workspaceId),
              );

              return (
                <li key={n.id} className={n.read ? 'read' : 'unread'}>
                  <span className="notification-icon">{ICONS[n.type] ?? '🔔'}</span>
                  <div className="notification-body">
                    {isClickable ? (
                      <button
                        type="button"
                        className="notification-link"
                        onClick={() => handleNotificationClick(n)}
                      >
                        {n.message}
                      </button>
                    ) : (
                      <p>{n.message}</p>
                    )}
                    {workspace && n.type === 'workspace_invite' && (
                      <span className="notification-meta">{workspace.icon} {workspace.name}</span>
                    )}
                    <time>{timeAgo(n.createdAt)}</time>
                    {n.type === 'workspace_invite' && n.inviteId && !n.read && (
                      <div className="notification-actions">
                        <button
                          type="button"
                          className="primary-btn small"
                          onClick={() => handleAccept(n.inviteId, n.workspaceId)}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="ghost-btn small"
                          onClick={() => declineWorkspaceInvite(n.inviteId)}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                  {!n.read && n.type !== 'workspace_invite' && (
                    <button
                      type="button"
                      className="ghost-btn small"
                      onClick={() => markNotificationRead(n.id)}
                    >
                      Mark read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
