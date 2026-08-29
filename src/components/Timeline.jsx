import { useMemo, useState } from 'react';
import { getMemberById, loadTeam } from '../profile';
import {
  barMetrics,
  buildTimelineGroups,
  completionTrend,
  formatMonthLabel,
  getMonthDays,
} from '../timeline';
import { IconChevronLeft, IconChevronRight, IconMore, IconPlus } from './Icons';
import Sparkline from './Sparkline';

const Timeline = ({ tasks, query = '', onInvite }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [expanded, setExpanded] = useState({});
  const team = loadTeam();

  const needle = query.trim().toLowerCase();
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        needle ? task.title.toLowerCase().includes(needle) : true,
      ),
    [tasks, needle],
  );

  const groups = useMemo(() => buildTimelineGroups(filteredTasks), [filteredTasks]);
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const trend = useMemo(() => completionTrend(filteredTasks), [filteredTasks]);

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

  const visibleMembers = team.slice(0, 3);
  const extraMembers = Math.max(team.length - 3, 0);

  return (
    <div className="timeline-page">
      <header className="timeline-head">
        <div className="timeline-head-left">
          <h1>Timeline</h1>
          <button type="button" className="pill-btn" onClick={goToday}>
            Today
          </button>
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
          <button type="button" className="primary-btn" onClick={onInvite}>
            <IconPlus />
            Invite
          </button>
          <div className="timeline-members" aria-label="Team">
            {visibleMembers.map((member) => (
              <span
                key={member.id}
                className="member-avatar small"
                style={{ background: `${member.color}22`, color: member.color }}
                title={member.name}
              >
                {member.initials}
              </span>
            ))}
            {extraMembers > 0 && <span className="member-avatar small muted">+{extraMembers}</span>}
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
                        const member = getMemberById(team, id);
                        if (!member) return null;
                        return (
                          <span
                            key={id}
                            className="member-avatar tiny"
                            style={{ background: `${member.color}22`, color: member.color }}
                          >
                            {member.initials}
                          </span>
                        );
                      })}
                    </span>
                    <span className="timeline-group-more" aria-hidden="true">
                      <IconMore />
                    </span>
                  </button>
                  {open &&
                    group.tasks.map((task) => (
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
            <div className="timeline-days" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(44px, 1fr))` }}>
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
                    {open &&
                      group.tasks.map((task) => {
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
          <Sparkline values={trend} color="#4c6fff" />
          <div className="timeline-insight-stats">
            {trend.map((value, index) => (
              <span key={index}>{value || '–'}</span>
            ))}
          </div>
          <p>{filteredTasks.filter((task) => task.done).length} tasks completed this month</p>
        </aside>
      </div>
    </div>
  );
};

export default Timeline;
