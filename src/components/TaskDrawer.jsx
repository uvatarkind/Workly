import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STATUS_LABELS, PRIORITY_LABELS, STATUSES, PRIORITIES } from '../data/constants';
import { IconX } from './Icons';

export default function TaskDrawer({ taskId, onClose }) {
  const {
    getTask, getProject, getUser, getWorkspace,
    updateTask, toggleSubtask, addComment, deleteTask,
    state,
  } = useApp();

  const task = getTask(taskId);
  const [comment, setComment] = useState('');

  if (!task) return null;

  const project = getProject(task.projectId);
  const workspace = getWorkspace(task.workspaceId);

  function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(taskId, comment);
    setComment('');
  }

  return (
    <>
      <button type="button" className="drawer-backdrop" aria-label="Close" onClick={onClose} />
      <aside className="task-drawer" role="dialog" aria-label={task.title}>
        <header className="drawer-header">
          <Link to={`/project/${task.projectId}`} className="drawer-back" onClick={onClose}>
            ← {project?.name}
          </Link>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </header>

        <div className="drawer-body">
          <h1>{task.title}</h1>

          <section className="drawer-section">
            <h2>Description</h2>
            <p>{task.description || 'No description.'}</p>
          </section>

          <section className="drawer-meta">
            <div className="meta-row">
              <span>Status</span>
              <select
                value={task.status}
                onChange={(e) => updateTask(taskId, { status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="meta-row">
              <span>Priority</span>
              <select
                value={task.priority}
                onChange={(e) => updateTask(taskId, { priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <div className="meta-row">
              <span>Assignee</span>
              <select
                value={task.assigneeId}
                onChange={(e) => updateTask(taskId, { assigneeId: e.target.value })}
              >
                {state.users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="meta-row">
              <span>Due</span>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => updateTask(taskId, { dueDate: e.target.value })}
              />
            </div>
            <div className="meta-row">
              <span>Project</span>
              <Link to={`/project/${task.projectId}`} onClick={onClose}>
                {project?.name}
              </Link>
            </div>
            <div className="meta-row">
              <span>Workspace</span>
              <span>{workspace?.name}</span>
            </div>
          </section>

          {task.subtasks.length > 0 && (
            <section className="drawer-section">
              <h2>Subtasks</h2>
              <ul className="subtask-list">
                {task.subtasks.map((sub) => (
                  <li key={sub.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={sub.done}
                        onChange={() => toggleSubtask(taskId, sub.id)}
                      />
                      <span className={sub.done ? 'done' : undefined}>{sub.title}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="drawer-section">
            <h2>Comments</h2>
            <ul className="comment-list">
              {task.comments.map((c) => {
                const user = getUser(c.userId);
                return (
                  <li key={c.id}>
                    <span className="member-avatar tiny">{user?.initials}</span>
                    <div>
                      <strong>{user?.name.split(' ')[0]}</strong>
                      <p>{c.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <form className="comment-form" onSubmit={handleComment}>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment…"
              />
              <button type="submit" className="primary-btn small">Send</button>
            </form>
          </section>

          <section className="drawer-section drawer-danger">
            <button type="button" className="danger-btn" onClick={() => { deleteTask(taskId); onClose(); }}>
              Delete task
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}
