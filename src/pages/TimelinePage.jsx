import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import WorkspacePageHeader from '../components/WorkspacePageHeader';
import { membersPath } from '../utils/routes';
import {
  barMetrics,
  buildTimelineGroups,
  formatMonthLabel,
  getMonthDays,
} from '../utils/timeline';
import { useWorkspaceScope } from '../utils/useWorkspaceScope';
import { IconChevronLeft, IconChevronRight, IconMore, IconPlus } from '../components/Icons';

export default function TimelinePage() {
  const { getUser } = useApp();
  const { workspace, workspaceTasks } = useWorkspaceScope();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [expanded, setExpanded] = useState({});

  const tasks = workspaceTasks;
  const groups = useMemo(() => buildTimelineGroups(tasks), [tasks]);
  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  const memberIds = workspace?.memberIds ?? [];
  const members = memberIds.map((id) => getUser(id)).filter(Boolean);

  function goToday() {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  function shiftMonth(delta) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function toggleGroup(id) {
    setExpanded((current) => ({ ...current, [id]: !(current[id] ?? true) }));
  }

  return (
    <div className="page timeline-page">
      <WorkspacePageHeader workspace={workspace} section="Timeline" />
      <header className="timeline-head">
        <div className="timeline-head-left">
          <button type="button" className="pill-btn" onClick={goToday}>Today</button>
          <div className="timeline-nav">
            <button type="button" className="icon-btn" aria-label="Previous month" onClick={() => shiftMonth(-1)}>
              <IconChevronLeft />
            </button>
            <span>{formatMonthLabel(year, month)}</span>
            <button type="button" className="icon-btn" aria-label="Next month" onClick={() => shiftMonth(1)}>
              <IconChevronRight />
            </button>
          </div>
        </div>
        <div className="timeline-head-right">
          {workspace?.type === 'team' && (
            <Link to={membersPath(workspace.id)} className="primary-btn">
              <IconPlus />
              Invite
            </Link>
          )}
          <div className="timeline-members" aria-label="Team">
            {members.slice(0, 3).map((member) => (
              <span key={member.id} className="member-avatar small" title={member.name}>
                {member.initials}
              </span>
            ))}
            {members.length > 3 && (
              <span className="member-avatar small muted">+{members.length - 3}</span>
            )}
          </div>
        </div>
      </header>

      <div className="timeline-shell panel">
        <div className="timeline-board">
          <div className="timeline-labels">
            <div className="timeline-labels-spacer" />
            {groups.length === 0 ? (
              <div className="timeline-empty-labels">
                <p>No active tasks this month</p>
              </div>
            ) : groups.map((group) => {
              const open = expanded[group.id] ?? true;
              return (
                <div key={group.id} className="timeline-group-block">
                  <button
                    type="button"
                    className="timeline-group-row"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={open}
                  >
                    <span className={`timeline-group-icon tone-${group.tone}`}>{group.icon}</span>
                    <span className="timeline-group-title">{group.label}</span>
                    <span className="timeline-group-members">
                      {group.assigneeIds.slice(0, 2).map((id) => {
                        const member = getUser(id);
                        if (!member) return null;
                        return (
                          <span key={id} className="member-avatar tiny">{member.initials}</span>
                        );
                      })}
                    </span>
                    <span className="timeline-group-more" aria-hidden="true"><IconMore /></span>
                  </button>
                  {open && group.tasks.map((task) => (
                    <div key={task.id} className="timeline-task-row">
                      <span className="timeline-task-dot" />
                      <span className="timeline-task-name">{task.title}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="timeline-scroll">
            <div
              className="timeline-chart-wrap"
              style={{ minWidth: `${days.length * 44}px` }}
            >
              <div
                className="timeline-days"
                style={{ gridTemplateColumns: `repeat(${days.length}, 44px)` }}
              >
                {days.map((day) => (
                  <div key={day.stamp} className={day.isToday ? 'timeline-day today' : 'timeline-day'}>
                    <span>{day.weekday}</span>
                    <strong>{String(day.day).padStart(2, '0')}</strong>
                  </div>
                ))}
              </div>

              <div className="timeline-rows">
                {groups.length === 0 ? (
                  <div className="timeline-empty-chart">
                    <p>Add tasks with start dates to see them on the timeline</p>
                  </div>
                ) : groups.map((group) => {
                  const open = expanded[group.id] ?? true;
                  return (
                    <div key={group.id} className="timeline-group-block">
                      <div className="timeline-track-row group-track">
                        <div
                          className="timeline-track-grid"
                          style={{ gridTemplateColumns: `repeat(${days.length}, 44px)` }}
                        >
                          {days.map((day) => (
                            <span key={day.stamp} className={day.isToday ? 'grid-cell today' : 'grid-cell'} />
                          ))}
                        </div>
                      </div>
                      {open && group.tasks.map((task) => {
                        const metrics = barMetrics(task, days);
                        return (
                          <div key={task.id} className="timeline-track-row">
                            <div
                              className="timeline-track-grid"
                              style={{ gridTemplateColumns: `repeat(${days.length}, 44px)` }}
                            >
                              {days.map((day) => (
                                <span key={day.stamp} className={day.isToday ? 'grid-cell today' : 'grid-cell'} />
                              ))}
                              {metrics && (
                                <div
                                  className={`timeline-bar tone-${metrics.tone}`}
                                  style={{ left: metrics.left, width: metrics.width }}
                                  title={`${metrics.label} · ${metrics.progress}%`}
                                >
                                  <span className="timeline-bar-fill" style={{ width: `${metrics.progress}%` }} />
                                  <span className="timeline-bar-label">
                                    <span className="timeline-bar-text">{metrics.label}</span>
                                    <strong>{metrics.progress}%</strong>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
