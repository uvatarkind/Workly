import { STATUS_LABELS, PRIORITY_LABELS } from '../data/constants';
import { formatDate, isOverdue } from '../utils/dates';
import { useApp } from '../context/AppContext';

const COLUMNS = ['todo', 'in_progress', 'in_review', 'done'];

export default function ProjectBoard({ tasks, onOpenTask }) {
  const { getUser, updateTask } = useApp();

  function handleMove(taskId, status) {
    updateTask(taskId, { status });
  }

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col);
        return (
          <div key={col} className="kanban-column">
            <div className="kanban-column-head">
              <h2>{STATUS_LABELS[col]}</h2>
              <span className="kanban-count">{colTasks.length}</span>
            </div>
            <ul className="kanban-list">
              {colTasks.map((task) => {
                const assignee = getUser(task.assigneeId);
                return (
                  <li key={task.id}>
                    <article className={`kanban-card${task.status === 'done' ? ' done' : ''}`}>
                      <button
                        type="button"
                        className="kanban-card-body card-click"
                        onClick={() => onOpenTask(task.id)}
                      >
                        <div className="kanban-card-top">
                          <span className={`priority-badge priority-${task.priority}`}>
                            {PRIORITY_LABELS[task.priority]}
                          </span>
                        </div>
                        <h3>{task.title}</h3>
                        {task.dueDate && (
                          <span className={`kanban-date${isOverdue(task) ? ' overdue' : ''}`}>
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                        <div className="kanban-card-foot">
                          <span className="kanban-avatars">
                            <span>{assignee?.initials}</span>
                          </span>
                        </div>
                      </button>
                      <div className="kanban-move">
                        <select
                          value={task.status}
                          onChange={(e) => handleMove(task.id, e.target.value)}
                          aria-label={`Move ${task.title}`}
                        >
                          {COLUMNS.map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
