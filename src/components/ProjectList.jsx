import { STATUS_LABELS, PRIORITY_LABELS } from '../data/constants';
import { formatDate, isOverdue } from '../utils/dates';
import { useApp } from '../context/AppContext';

export default function ProjectList({ tasks, onOpenTask }) {
  const { getUser } = useApp();

  return (
    <section className="panel">
      <div className="table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const assignee = getUser(task.assigneeId);
              return (
                <tr key={task.id}>
                  <td>
                    <button type="button" className="link-btn" onClick={() => onOpenTask(task.id)}>
                      {task.title}
                    </button>
                  </td>
                  <td>
                    <span className="assignee-cell">
                      <span className="member-avatar tiny">{assignee?.initials}</span>
                      {assignee?.name}
                    </span>
                  </td>
                  <td className={isOverdue(task) ? 'overdue' : undefined}>
                    {task.dueDate ? formatDate(task.dueDate) : '—'}
                  </td>
                  <td>
                    <span className={`priority-badge priority-${task.priority}`}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${task.status}`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
