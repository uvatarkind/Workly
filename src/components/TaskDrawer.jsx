import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LABEL_COLORS,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  TASK_LABELS,
} from '../data/constants';
import { coverVariant, columnForTask, BOARD_COLUMNS } from '../utils/board';
import { IconCheck, IconX } from './Icons';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function TaskDrawer({ taskId, onClose }) {
  const {
    getTask, getProject, getUser, getWorkspace,
    updateTask, toggleSubtask, addSubtask, removeSubtask, addComment, deleteTask,
    currentUser, state,
  } = useApp();

  const task = getTask(taskId);
  const [comment, setComment] = useState('');
  const [subtaskDraft, setSubtaskDraft] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!task) return null;

  const project = getProject(task.projectId);
  const workspace = getWorkspace(task.workspaceId);
  const assignee = getUser(task.assigneeId);
  const column = BOARD_COLUMNS.find((c) => c.id === columnForTask(task));
  const subtasksDone = task.subtasks.filter((s) => s.done).length;
  const subtaskPct = task.subtasks.length
    ? Math.round((subtasksDone / task.subtasks.length) * 100)
    : 0;

  function saveTitle() {
    const next = titleDraft.trim();
    if (next && next !== task.title) {
      updateTask(taskId, { title: next });
    }
    setEditingTitle(false);
  }

  function toggleLabel(label) {
    const labels = task.labels ?? [];
    const next = labels.includes(label)
      ? labels.filter((l) => l !== label)
      : [...labels, label];
    updateTask(taskId, { labels: next });
  }

  function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(taskId, comment);
    setComment('');
  }

  function handleAddSubtask(e) {
    e.preventDefault();
    if (!subtaskDraft.trim()) return;
    addSubtask(taskId, subtaskDraft);
    setSubtaskDraft('');
  }

  return (
    <>
      <button type="button" className="task-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="task-modal" role="dialog" aria-label={task.title}>
        <div className={`task-modal-cover ${coverVariant(task.id)}`} aria-hidden="true" />

        <header className="task-modal-header">
          <div className="task-modal-header-main">
            <span className="task-modal-list-name">
              {column?.label ?? 'Task'} in{' '}
              <Link to={projectPath(task.workspaceId, task.projectId)} onClick={onClose}>
                {project?.name}
              </Link>
            </span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </header>

        <div className="task-modal-layout">
          <div className="task-modal-main">
            <div className="task-modal-title-row">
              <span className="task-modal-status-dot" data-status={task.status} aria-hidden="true" />
              {editingTitle ? (
                <input
                  className="task-modal-title-input"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitle();
                    if (e.key === 'Escape') setEditingTitle(false);
                  }}
                  autoFocus
                />
              ) : (
                <h1
                  className="task-modal-title"
                  onClick={() => {
                    setTitleDraft(task.title);
                    setEditingTitle(true);
                  }}
                >
                  {task.title}
                </h1>
              )}
            </div>

            {(task.labels?.length > 0) && (
              <section className="task-modal-block">
                <h2>Labels</h2>
                <div className="task-label-chips readonly">
                  {task.labels.map((label) => (
                    <span key={label} className={`task-label-chip tag-${LABEL_COLORS[label] ?? 'design'}`}>
                      {label}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="task-modal-block">
              <h2>Description</h2>
              <textarea
                className="task-modal-description"
                value={task.description ?? ''}
                onChange={(e) => updateTask(taskId, { description: e.target.value })}
                placeholder="Add a more detailed description…"
                rows={4}
              />
            </section>

            <section className="task-modal-block">
              <div className="task-modal-block-head">
                <h2>
                  <IconCheck />
                  Checklist
                </h2>
                {task.subtasks.length > 0 && (
                  <span className="task-checklist-pct">{subtaskPct}%</span>
                )}
              </div>
              {task.subtasks.length > 0 && (
                <div className="task-checklist-bar">
                  <div className="task-checklist-fill" style={{ width: `${subtaskPct}%` }} />
                </div>
              )}
              <ul className="subtask-list task-modal-checklist">
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
                    <button
                      type="button"
                      className="subtask-remove"
                      aria-label={`Remove ${sub.title}`}
                      onClick={() => removeSubtask(taskId, sub.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <form className="subtask-add-form" onSubmit={handleAddSubtask}>
                <input
                  value={subtaskDraft}
                  onChange={(e) => setSubtaskDraft(e.target.value)}
                  placeholder="Add an item…"
                />
                <button type="submit" className="primary-btn small" disabled={!subtaskDraft.trim()}>
                  Add
                </button>
              </form>
            </section>

            <section className="task-modal-block">
              <h2>Activity</h2>
              <form className="comment-form task-modal-comment-form" onSubmit={handleComment}>
                <span className="member-avatar tiny">{currentUser.initials}</span>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment…"
                />
              </form>
              <ul className="comment-list task-modal-activity">
                {task.comments.length === 0 ? (
                  <li className="activity-empty">No comments yet.</li>
                ) : (
                  [...task.comments].reverse().map((c) => {
                    const user = getUser(c.userId);
                    return (
                      <li key={c.id}>
                        <span className="member-avatar tiny">{user?.initials}</span>
                        <div>
                          <div className="activity-head">
                            <strong>{user?.name}</strong>
                            <time>{timeAgo(c.createdAt)}</time>
                          </div>
                          <p>{c.text}</p>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </section>
          </div>

          <aside className="task-modal-sidebar">
            <p className="task-modal-sidebar-label">Add to card</p>

            <label className="task-sidebar-field">
              <span>Status</span>
              <select
                value={task.status}
                onChange={(e) => updateTask(taskId, { status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </label>

            <label className="task-sidebar-field">
              <span>Assignee</span>
              <select
                value={task.assigneeId}
                onChange={(e) => updateTask(taskId, { assigneeId: e.target.value })}
              >
                {state.users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </label>

            <label className="task-sidebar-field">
              <span>Due date</span>
              <input
                type="date"
                value={task.dueDate}
                className={isOverdue(task) ? 'overdue' : undefined}
                onChange={(e) => updateTask(taskId, { dueDate: e.target.value })}
              />
              {task.dueDate && (
                <span className={`task-due-hint${isOverdue(task) ? ' overdue' : ''}`}>
                  {formatDateLong(task.dueDate)}
                </span>
              )}
            </label>

            <label className="task-sidebar-field">
              <span>Priority</span>
              <select
                value={task.priority}
                onChange={(e) => updateTask(taskId, { priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </label>

            <div className="task-sidebar-field">
              <span>Labels</span>
              <div className="task-label-picker">
                {TASK_LABELS.map((label) => {
                  const active = task.labels?.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`task-label-chip tag-${LABEL_COLORS[label] ?? 'design'}${active ? ' active' : ''}`}
                      onClick={() => toggleLabel(label)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="task-sidebar-meta">
              <span>Project</span>
              <Link to={projectPath(task.workspaceId, task.projectId)} onClick={onClose}>
                {project?.name}
              </Link>
              <span>Workspace</span>
              <span>{workspace?.name}</span>
              {assignee && (
                <>
                  <span>Assigned to</span>
                  <span className="task-sidebar-assignee">
                    <span className="member-avatar tiny">{assignee.initials}</span>
                    {assignee.name}
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              className="danger-btn task-modal-delete"
              onClick={() => { deleteTask(taskId); onClose(); }}
            >
              Delete task
            </button>
          </aside>
        </div>
      </div>
    </>
  );
}
