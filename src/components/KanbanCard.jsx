import { coverVariant, getCategoryTone, isOverdue } from '../tasks';
import { getMemberById, loadTeam } from '../profile';
import { IconTrash } from './Icons';

function formatDueDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const KanbanCard = ({ task, onToggle, onDelete, onMove }) => {
  const tone = getCategoryTone(task.category);
  const showCover = task.stage !== 'backlog' || task.priority !== 'low';
  const team = loadTeam();
  const assignees = (task.assigneeIds?.length ? task.assigneeIds : ['self'])
    .map((id) => getMemberById(team, id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className={`kanban-card ${task.done ? 'done' : ''}`}>
      {showCover && <div className={`kanban-cover ${coverVariant(task.id)}`} aria-hidden="true" />}
      <div className="kanban-card-body">
        <div className="kanban-card-top">
          <span className={`kanban-tag tag-${tone}`}>{task.category}</span>
          <button
            type="button"
            className="icon-btn kanban-delete"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.title}`}
          >
            <IconTrash />
          </button>
        </div>
        <h3>{task.title}</h3>
        <p>{task.description || 'Track progress and keep this task moving.'}</p>
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
            {assignees.map((member) => (
              <span
                key={member.id}
                style={{ background: `${member.color}22`, color: member.color }}
              >
                {member.initials}
              </span>
            ))}
          </div>
          <div className="kanban-meta">
            <button type="button" className="kanban-progress" onClick={() => onToggle(task.id)}>
              {task.done ? '1/1 done' : '0/1 done'}
            </button>
            <span className="kanban-comments">0 Comment</span>
          </div>
        </div>
        <label className="kanban-move">
          <span className="visually-hidden">Move {task.title}</span>
          <select
            value={task.stage}
            aria-label={`Move ${task.title}`}
            onChange={(event) => onMove(task.id, event.target.value)}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
          </select>
        </label>
      </div>
    </article>
  );
};

export default KanbanCard;
