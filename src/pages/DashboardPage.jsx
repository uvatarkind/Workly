import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sparkline from '../components/Sparkline';
import AreaChart from '../components/AreaChart';
import WorkspacePageHeader from '../components/WorkspacePageHeader';
import { IconCheckCircle, IconPlus, IconStar } from '../components/Icons';
import {
  activitySeries,
  deltaDisplay,
  sparklineValues,
  weekDelta,
} from '../utils/analytics';
import { useWorkspaceScope, workspaceSectionPath } from '../utils/useWorkspaceScope';

export default function DashboardPage() {
  const {
    currentUser,
    getUser,
    getPendingInvitesForUser,
    getWorkspace,
    acceptWorkspaceInvite,
    projectProgress,
  } = useApp();
  const { workspace, workspaceTasks, workspaceProjects, workspaceId } = useWorkspaceScope();

  const [range, setRange] = useState('monthly');

  const pendingInvites = getPendingInvitesForUser();
  const myTasks = workspaceTasks.filter(
    (t) => t.assigneeId === currentUser.id && t.status !== 'done',
  );
  const completedCount = workspaceTasks.filter(
    (t) => t.assigneeId === currentUser.id && t.status === 'done',
  ).length;
  const projectsDone = workspaceProjects.filter((p) => projectProgress(p.id) >= 90).length;
  const doneTasks = workspaceTasks.filter((t) => t.status === 'done');

  const series = activitySeries(workspaceTasks, range);

  const statCards = [
    {
      icon: IconStar,
      label: 'Task Completed',
      value: completedCount,
      delta: weekDelta(workspaceTasks, 'completed'),
      spark: sparklineValues(workspaceTasks, 'completed'),
      color: '#7c3aed',
    },
    {
      icon: IconPlus,
      label: 'New Task',
      value: myTasks.length,
      delta: weekDelta(workspaceTasks, 'created'),
      spark: sparklineValues(workspaceTasks, 'created'),
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

  return (
    <div className="page dashboard-page">
      <WorkspacePageHeader workspace={workspace} section="Dashboard" />
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
          <Link to={workspaceSectionPath(workspaceId, 'notifications')} className="ghost-btn small">View all notifications</Link>
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
      </div>
    </div>
  );
}
