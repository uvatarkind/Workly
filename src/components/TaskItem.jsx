import { isOverdue } from '../tasks';
import { IconClock, IconTrash } from './Icons';

const priorityLabel = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function formatDueDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

const TaskItem = ({ task, onToggle, onDelete }) => {
  const overdue = isOverdue(task);
  const status = task.done ? 'Done' : overdue ? 'Overdue' : 'To Do';

  return (
    <li className={task.done ? 'task-card done' : 'task-card'}>
      <label className="task-card-check">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
        />
        <span className="visually-hidden">
          {task.done ? `Mark ${task.title} open` : `Complete ${task.title}`}
        </span>
      </label>
      <div className="task-card-body">
        <div className="task-card-top">
          <p className="task-title">{task.title}</p>
          <span className={`status status-${status === 'Overdue' ? 'overdue' : task.done ? 'done' : 'todo'}`}>
            {status}
          </span>
          <span className={`priority priority-${task.priority}`}>
            {priorityLabel[task.priority]}
          </span>
        </div>
        <p className={overdue ? 'deadline overdue' : 'deadline'}>
          <IconClock />
          {task.dueDate ? (
            <time dateTime={task.dueDate}>
              {overdue
                ? `Overdue ${formatDueDate(task.dueDate)}`
                : `Deadline: ${formatDueDate(task.dueDate)}`}
            </time>
          ) : (
            <span>No deadline</span>
          )}
        </p>
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        <IconTrash />
      </button>
    </li>
  );
};

export default TaskItem;
