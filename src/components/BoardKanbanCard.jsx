import { isOverdue } from '../utils/dates';
import { coverVariant, subtaskProgress } from '../utils/board';
import { LABEL_COLORS } from '../data/constants';
import { IconCheck, IconMessage } from './Icons';

function formatDueDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BoardKanbanCard({ task, assignee, onOpen, onMove, columns, currentColumn }) {
  const showCover = task.status === 'in_progress';
  const comments = task.comments?.length ?? 0;
  const progress = subtaskProgress(task);
  const labels = task.labels?.slice(0, 3) ?? [];

  return (
    <article className={`kanban-card board-card${task.status === 'done' ? ' done' : ''}`}>
      {showCover && <div className={`kanban-cover ${coverVariant(task.id)}`} aria-hidden="true" />}
      <div className="kanban-card-body">
        {labels.length > 0 && (
          <div className="kanban-card-labels">
            {labels.map((label) => (
              <span
                key={label}
                className={`kanban-label tag-${LABEL_COLORS[label] ?? 'design'}`}
              >
                {label}
              </span>
            ))}
          </div>
        )}
        <button type="button" className="board-card-click" onClick={() => onOpen(task.id)}>
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
        </button>
        {task.dueDate && (
          <time
            className={isOverdue(task) ? 'kanban-date overdue' : 'kanban-date'}
            dateTime={task.dueDate}
          >
            {formatDueDate(task.dueDate)}
          </time>
        )}
        <div className="kanban-card-foot">
          <div className="kanban-avatars" aria-hidden="true">
            {assignee && (
              <span className="kanban-avatar">{assignee.initials}</span>
            )}
          </div>
          <div className="kanban-meta">
            {progress && (
              <span className="kanban-checklist">
                <IconCheck />
                {progress}
              </span>
            )}
            {comments > 0 && (
              <span className="kanban-comments">
                <IconMessage />
                {comments} Comment
              </span>
            )}
          </div>
        </div>
        <label className="kanban-move">
          <span className="visually-hidden">Move {task.title}</span>
          <select
            value={currentColumn}
            aria-label={`Move ${task.title}`}
            onChange={(e) => onMove(task.id, e.target.value)}
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>{col.label}</option>
            ))}
          </select>
        </label>
      </div>
    </article>
  );
}
