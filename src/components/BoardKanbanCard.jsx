import { isOverdue } from '../utils/dates';
import { coverVariant, subtaskProgress, taskTag, taskTagTone } from '../utils/board';
import { IconMore, IconPaperclip } from './Icons';

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
  const tone = taskTagTone(task);
  const tag = taskTag(task);
  const showCover = task.status !== 'todo' || task.priority !== 'low';
  const comments = task.comments?.length ?? 0;
  const files = task.labels?.length > 1 ? task.labels.length : Math.floor(task.title.length % 12);

  return (
    <article className={`kanban-card board-card${task.status === 'done' ? ' done' : ''}`}>
      {showCover && <div className={`kanban-cover ${coverVariant(task.id)}`} aria-hidden="true" />}
      <div className="kanban-card-body">
        <div className="kanban-card-top">
          <span className={`kanban-tag tag-${tone}`}>{tag}</span>
          <button type="button" className="icon-btn kanban-more" aria-label="More options">
            <IconMore />
          </button>
        </div>
        <button type="button" className="board-card-click" onClick={() => onOpen(task.id)}>
          <h3>{task.title}</h3>
          <p>{task.description || 'Track progress and keep this task moving.'}</p>
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
            <span className="kanban-progress">{subtaskProgress(task)} done</span>
            {comments > 0 && <span className="kanban-comments">{comments} Comment</span>}
            {files > 0 && (
              <span className="kanban-files">
                <IconPaperclip />
                {files} file
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
