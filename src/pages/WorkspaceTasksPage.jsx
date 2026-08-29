import { useParams, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STATUS_LABELS, PRIORITY_LABELS } from '../data/constants';
import { formatDate, isOverdue } from '../utils/dates';
import WorkspaceAccess from '../components/WorkspaceAccess';

export default function WorkspaceTasksPage() {
  const { id } = useParams();
  const { openTask } = useOutletContext();
  const { getWorkspace, getTasksByWorkspace, getProject, getUser } = useApp();

  const workspace = getWorkspace(id);
  if (!workspace) return <p className="empty-state">Workspace not found.</p>;

  const tasks = getTasksByWorkspace(id);

  return (
    <WorkspaceAccess workspaceId={id}>
    <div className="page">
      <header className="page-header">
        <h1>{workspace.type === 'personal' ? 'My Tasks' : 'Tasks'}</h1>
        <p>{workspace.name} — {tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const project = getProject(task.projectId);
                const assignee = getUser(task.assigneeId);
                return (
                  <tr key={task.id}>
                    <td>
                      <button type="button" className="link-btn" onClick={() => openTask(task.id)}>
                        {task.title}
                      </button>
                    </td>
                    <td>{project?.name}</td>
                    <td>
                      <span className="assignee-cell">
                        <span className="member-avatar tiny">{assignee?.initials}</span>
                        {assignee?.name.split(' ')[0]}
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
    </div>
    </WorkspaceAccess>
  );
}
