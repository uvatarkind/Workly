import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sparkline from '../components/Sparkline';
import AreaChart from '../components/AreaChart';
import { IconCheckCircle, IconPlus, IconStar, IconUsers } from '../components/Icons';
import {
  activitySeries,
  deltaDisplay,
  sparklineValues,
  weekDelta,
} from '../utils/analytics';
import { seedMessages } from '../data/mockData';

export default function DashboardPage() {
  const {
    currentUser,
    state,
    myWorkspaces,
    getUser,
    getPendingInvitesForUser,
    getWorkspace,
    acceptWorkspaceInvite,
    addTask,
    projectProgress,
  } = useApp();

  const [range, setRange] = useState('monthly');
  const [quickTitle, setQuickTitle] = useState('');

  const pendingInvites = getPendingInvitesForUser();
  const myTasks = state.tasks.filter(
    (t) => t.assigneeId === currentUser.id && t.status !== 'done',
  );
  const completedCount = state.tasks.filter(
    (t) => t.assigneeId === currentUser.id && t.status === 'done',
  ).length;
  const teamWorkspace = myWorkspaces.find((w) => w.type === 'team');
  const projectsDone = state.projects.filter((p) => projectProgress(p.id) >= 90).length;
  const doneTasks = state.tasks.filter((t) => t.status === 'done');

  const series = activitySeries(state.tasks, range);

  const statCards = [
    {
      icon: IconStar,
      label: 'Task Completed',
      value: completedCount,
      delta: weekDelta(state.tasks, 'completed'),
      spark: sparklineValues(state.tasks, 'completed'),
      color: '#7c3aed',
    },
    {
      icon: IconPlus,
      label: 'New Task',
      value: myTasks.length,
      delta: weekDelta(state.tasks, 'created'),
      spark: sparklineValues(state.tasks, 'created'),
      color: '#004aad',
    },
    {
      icon: IconCheckCircle,
      label: 'Project Done',
      value: projectsDone,
      delta: weekDelta(doneTasks, 'completed'),
      spark: sparklineValues(doneTasks, 'completed'),
      color: '#ffa726',
    },
  ];

  function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    const project = state.projects.find((p) => p.workspaceId === teamWorkspace?.id) ?? state.projects[0];
    addTask({
      title: quickTitle,
      workspaceId: project?.workspaceId ?? 'ws-personal',
      projectId: project?.id,
      assigneeId: currentUser.id,
      priority: 'medium',
    });
    setQuickTitle('');
  }

  return (
    <div className="page dashboard-page">
      {pendingInvites.length > 0 && (
        <section className="panel invite-banner">
          <h2>Workspace invites</h2>
          <ul className="invite-banner-list">
            {pendingInvites.map((inv) => {
              const ws = getWorkspace(inv.workspaceId);
              const inviter = getUser(inv.invitedBy);
              return (
                <li key={inv.id}>
                  <div>
                    <strong>{inviter?.name}</strong> invited you to join{' '}
                    <strong>{ws?.icon} {ws?.name}</strong>
                  </div>
                  <button
                    type="button"
                    className="primary-btn small"
                    onClick={() => acceptWorkspaceInvite(inv.id)}
                  >
                    Accept
                  </button>
                </li>
              );
            })}
          </ul>
          <Link to="/notifications" className="ghost-btn small">View all notifications</Link>
        </section>
      )}

      <div className="dash-layout">
        <div className="dash-main">
          <ul className="stat-grid dash-stats">
            {statCards.map((card) => {
              const Icon = card.icon;
              const delta = deltaDisplay(card.delta);
              return (
                <li key={card.label} className="stat-card octo">
                  <div className="stat-card-top">
                    <span className="stat-icon-wrap">
                      <Icon />
                    </span>
                    <span className="stat-label">{card.label}</span>
                    <strong className="stat-value">{String(card.value).padStart(2, '0')}</strong>
                  </div>
                  <div className="stat-card-divider" aria-hidden="true" />
                  <div className="stat-card-bottom">
                    <Sparkline values={card.spark} color={card.color} />
                    <div className={`stat-delta-block ${delta.tone}`}>
                      <p className="stat-delta-line">
                        <span className="stat-delta-value">{delta.value}</span>
                        <span className="stat-delta-suffix"> {delta.suffix}</span>
                      </p>
                      <span className="stat-delta-sub">{delta.sub}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <section className="panel chart-card">
            <div className="panel-head split chart-head">
              <h2>Task Done</h2>
              <div className="chart-range-tabs">
                {['daily', 'weekly', 'monthly'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={range === value ? 'active' : undefined}
                    onClick={() => setRange(value)}
                  >
                    {value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <AreaChart
              labels={series.labels}
              created={series.created}
              completed={series.completed}
            />
          </section>
        </div>

        <aside className="dash-rail">
          <section className="panel schedule-panel">
            <div className="panel-head split">
              <h2>Today&apos;s Schedule</h2>
              <div className="schedule-toggle" aria-hidden="true">
                <span className="active">☰</span>
                <span>▦</span>
              </div>
            </div>
            <div className="schedule-event">
              <div className="schedule-event-head">
                <div>
                  <h3>Project Discovery Call</h3>
                  <p>30 minute call with Client</p>
                </div>
                <button type="button" className="primary-btn small">
                  <IconUsers />
                  Invite
                </button>
              </div>
              <div className="schedule-call">
                <div className="schedule-call-avatars">
                  {['u2', 'u3', 'u1'].map((id) => (
                    <span key={id} className="member-avatar tiny">{getUser(id)?.initials}</span>
                  ))}
                </div>
                <span className="schedule-call-timer">28:35</span>
                <button type="button" className="schedule-call-btn" aria-label="Join call">📞</button>
              </div>
            </div>
          </section>

          <section className="panel messages-panel">
            <div className="panel-head">
              <h2>Messages</h2>
            </div>
            <ul className="message-list">
              {seedMessages.map((msg) => {
                const user = getUser(msg.userId);
                return (
                  <li key={msg.id}>
                    <span className="member-avatar small">{user?.initials}</span>
                    <div>
                      <strong>{user?.name.split(' ')[0]}</strong>
                      <p>{msg.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="panel quick-task-panel">
            <div className="panel-head">
              <h2>New Task</h2>
            </div>
            <form className="quick-task-form" onSubmit={handleQuickAdd}>
              <input
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Create new…"
              />
              <div className="quick-task-emojis" aria-hidden="true">
                {['😀', '👍', '🔥', '✅', '⭐'].map((emoji) => (
                  <button key={emoji} type="button" className="emoji-btn">{emoji}</button>
                ))}
              </div>
              <div className="quick-task-collab">
                <span className="collab-label">Add collaborators</span>
                <div className="collab-chips">
                  <span className="collab-chip">
                    <span className="member-avatar tiny">SJ</span>
                    Sarah <button type="button" aria-label="Remove Sarah">×</button>
                  </span>
                  <button type="button" className="collab-add" aria-label="Add collaborator">
                    <IconPlus />
                  </button>
                  <button type="submit" className="quick-submit" aria-label="Create task">
                    →
                  </button>
                </div>
              </div>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
