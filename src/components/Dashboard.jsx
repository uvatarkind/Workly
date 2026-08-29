import { useState } from 'react';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import Sparkline from './Sparkline';
import AreaChart from './AreaChart';
import {
  activitySeries,
  dueToday,
  sparklineValues,
  weekDelta,
} from '../tasks';

function deltaLabel(delta) {
  if (delta > 0) return `${delta}+ more from last week`;
  if (delta < 0) return `${Math.abs(delta)} fewer than last week`;
  return 'Same as last week';
}

const Dashboard = ({
  tasks,
  visibleTasks,
  openCount,
  completedCount,
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  onAdd,
  onToggle,
  onDelete,
  emptyMessage,
}) => {
  const [range, setRange] = useState('monthly');
  const series = activitySeries(tasks, range);
  const todayTasks = dueToday(tasks);
  const featured = todayTasks[0] || tasks.find((task) => !task.done);

  return (
    <div className="dash">
      <div className="dash-main">
        <ul className="stat-grid">
          <li className="stat-card octo">
            <div>
              <span className="stat-label">Task Completed</span>
              <strong>{String(completedCount).padStart(2, '0')}</strong>
              <small>{deltaLabel(weekDelta(tasks, 'completed'))}</small>
            </div>
            <Sparkline values={sparklineValues(tasks, 'completed')} color="#8b7cf6" />
          </li>
          <li className="stat-card octo">
            <div>
              <span className="stat-label">New Task</span>
              <strong>{String(openCount).padStart(2, '0')}</strong>
              <small>{deltaLabel(weekDelta(tasks, 'created'))}</small>
            </div>
            <Sparkline values={sparklineValues(tasks, 'created')} color="#4c6fff" />
          </li>
          <li className="stat-card octo">
            <div>
              <span className="stat-label">All Tasks</span>
              <strong>{String(tasks.length).padStart(2, '0')}</strong>
              <small>{deltaLabel(weekDelta(tasks, 'created'))}</small>
            </div>
            <Sparkline values={sparklineValues(tasks, 'created')} color="#ffa726" />
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

        <section className="panel">
          <div className="panel-head">
            <h2>Task</h2>
          </div>
          {tasks.length > 0 && (
            <TaskFilters
              status={status}
              priority={priority}
              onStatusChange={onStatusChange}
              onPriorityChange={onPriorityChange}
            />
          )}
          <TaskList
            tasks={visibleTasks}
            onToggle={onToggle}
            onDelete={onDelete}
            emptyMessage={
              emptyMessage ?? 'No tasks yet. Create one in the sidebar.'
            }
          />
        </section>
      </div>

      <aside className="dash-rail">
        <section className="panel">
          <div className="panel-head">
            <h2>Today’s Schedule</h2>
          </div>
          {featured ? (
            <div className="schedule-card">
              <p className="schedule-kicker">
                {featured.dueDate ? `Due ${featured.dueDate}` : 'Open task'}
              </p>
              <h3>{featured.title}</h3>
              <p>{featured.done ? 'Completed' : `${featured.priority} priority`}</p>
            </div>
          ) : (
            <p className="empty-state">Nothing scheduled today.</p>
          )}
          {todayTasks.length > 1 && (
            <ul className="schedule-list">
              {todayTasks.slice(1).map((task) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Create new</h2>
          </div>
          <TaskForm onAdd={onAdd} stacked idPrefix="dash" />
        </section>
      </aside>
    </div>
  );
};

export default Dashboard;
