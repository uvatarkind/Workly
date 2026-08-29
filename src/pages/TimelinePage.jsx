import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  barMetrics,
  buildTimelineGroups,
  completionTrend,
  formatMonthLabel,
  getMonthDays,
} from '../utils/timeline';
import { IconChevronLeft, IconChevronRight, IconMore, IconPlus } from '../components/Icons';
import Sparkline from '../components/Sparkline';

export default function TimelinePage() {
  const { state, getUser } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [expanded, setExpanded] = useState({});

  const tasks = state.tasks;
  const groups = useMemo(() => buildTimelineGroups(tasks), [tasks]);
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const trend = useMemo(() => completionTrend(tasks), [tasks]);

  const teamWorkspace = state.workspaces.find((w) => w.type === 'team');
  const memberIds = teamWorkspace?.memberIds ?? [];
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

  const completedCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="page timeline-page">
      <header className="timeline-head">
        <div className="timeline-head-left">
          <h1>Timeline</h1>
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
          <Link to={`/workspace/${teamWorkspace?.id ?? 'ws-acme'}/members`} className="primary-btn">
            <IconPlus />
            Invite
          </Link>
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
        <div className="timeline-grid">
          <div className="timeline-labels">
            <div className="timeline-labels-spacer" />
            {groups.map((group) => {
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

          <div className="timeline-chart-wrap">
            <div
              className="timeline-days"
              style={{ gridTemplateColumns: `repeat(${days.length}, minmax(44px, 1fr))` }}
            >
              {days.map((day) => (
                <div key={day.stamp} className={day.isToday ? 'timeline-day today' : 'timeline-day'}>
                  <span>{day.weekday}</span>
                  <strong>{String(day.day).padStart(2, '0')}</strong>
                </div>
              ))}
            </div>

            <div className="timeline-rows">
              {groups.map((group) => {
                const open = expanded[group.id] ?? true;
                return (
                  <div key={group.id} className="timeline-group-block">
                    <div className="timeline-track-row group-track">
                      <div
                        className="timeline-track-grid"
                        style={{ gridTemplateColumns: `repeat(${days.length}, minmax(44px, 1fr))` }}
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
                            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(44px, 1fr))` }}
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
                                  {metrics.label}
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

        <aside className="timeline-insight" aria-label="Completion trend">
          <h2>Complete Task</h2>
          <Sparkline values={trend} color="#8b7cf6" />
          <div className="timeline-insight-stats">
            {trend.map((value, index) => (
              <span key={index}>{value || '–'}</span>
            ))}
          </div>
          <p>{completedCount} tasks completed this month</p>
        </aside>
      </div>
    </div>
  );
}
