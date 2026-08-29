import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sparkline from '../components/Sparkline';
import AreaChart from '../components/AreaChart';
import { IconClock, IconLink, IconMessage, IconPlay, IconPlus, IconUsers } from '../components/Icons';
import {
  activitySeries,
  deltaLabel,
  sparklineValues,
  taskProgress,
  weekDelta,
} from '../utils/analytics';
import { seedMessages } from '../data/mockData';

export default function DashboardPage() {
  const { openTask } = useOutletContext();
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
  const displayTasks = myTasks.slice(0, 5);

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
            <li className="stat-card octo">
              <div>
                <span className="stat-label">Task Completed</span>
                <strong>{String(completedCount).padStart(2, '0')}</strong>
                <small className="stat-delta up">{deltaLabel(weekDelta(state.tasks, 'completed'))}</small>
              </div>
              <Sparkline values={sparklineValues(state.tasks, 'completed')} color="#8b7cf6" />
            </li>
            <li className="stat-card octo">
              <div>
                <span className="stat-label">New Task</span>
                <strong>{String(myTasks.length).padStart(2, '0')}</strong>
                <small className="stat-delta up">{deltaLabel(weekDelta(state.tasks, 'created'))}</small>
              </div>
              <Sparkline values={sparklineValues(state.tasks, 'created')} color="#4c6fff" />
            </li>
            <li className="stat-card octo">
              <div>
                <span className="stat-label">Project Done</span>
                <strong>{String(projectsDone).padStart(2, '0')}</strong>
                <small className="stat-delta up">{deltaLabel(weekDelta(doneTasks, 'completed'))}</small>
              </div>
              <Sparkline values={sparklineValues(doneTasks, 'completed')} color="#ffa726" />
            </li>
          </ul>

          <section className="panel chart-card">
            <div className="panel-head split">
              <h2>Task Done</h2>
              <div className="range-tabs">
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

          <section className="panel dash-task-panel">
            <div className="panel-head">
              <h2>Task</h2>
            </div>
            {displayTasks.length === 0 ? (
              <p className="empty-state">No open tasks. Create one in the sidebar.</p>
            ) : (
              <ul className="dash-task-list">
                {displayTasks.map((task) => {
                  const progress = taskProgress(task);
                  const comments = task.comments?.length ?? 0;
                  return (
                    <li key={task.id} className="dash-task-row">
                      <button
                        type="button"
                        className="dash-play"
                        aria-label={`Open ${task.title}`}
                        onClick={() => openTask(task.id)}
                      >
                        <IconPlay />
                      </button>
                      <div className="dash-task-body">
                        <div className="dash-task-top">
                          <span className="dash-task-time">
                            {task.dueDate ? `Due ${task.dueDate}` : 'No due date'}
                          </span>
                          <button
                            type="button"
                            className="dash-task-title"
                            onClick={() => openTask(task.id)}
                          >
                            {task.title}
                          </button>
                        </div>
                        <div className="dash-task-meta">
                          {task.description && (
                            <span className="dash-meta-item">
                              <IconLink />
                              {task.description.slice(0, 40)}
                            </span>
                          )}
                          {comments > 0 && (
                            <span className="dash-meta-item">
                              <IconMessage />
                              {comments} comment{comments !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="dash-task-side">
                        <div className="dash-task-progress">
                          <span>{progress}% complete</span>
                          <div className="progress-bar slim">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <button type="button" className="ghost-btn small reminder-btn">
                          <IconClock />
                          Reminder
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
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
