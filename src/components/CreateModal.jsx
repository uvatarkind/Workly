import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PRIORITIES, PRIORITY_LABELS } from '../data/constants';
import { IconX } from './Icons';

const MODES = [
  { id: 'task', label: 'Task' },
  { id: 'project', label: 'Project' },
  { id: 'workspace', label: 'Workspace' },
];

export default function CreateModal({ onClose }) {
  const navigate = useNavigate();
  const { myWorkspaces, addTask, addProject, addWorkspace, state } = useApp();
  const [mode, setMode] = useState('task');
  const [title, setTitle] = useState('');
  const [workspaceId, setWorkspaceId] = useState('ws-acme');
  const [projectId, setProjectId] = useState('p1');
  const [assigneeId, setAssigneeId] = useState('u1');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [wsType, setWsType] = useState('team');

  const projects = state.projects.filter((p) => p.workspaceId === workspaceId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'task') {
      const task = addTask({
        title,
        workspaceId,
        projectId: projectId || projects[0]?.id,
        assigneeId,
        dueDate,
        priority,
      });
      onClose();
      window.dispatchEvent(new CustomEvent('workly:open-task', { detail: task.id }));
    } else if (mode === 'project') {
      const project = addProject({ name: title, workspaceId });
      onClose();
      navigate(`/project/${project.id}`);
    } else {
      const ws = addWorkspace({ name: title, type: wsType });
      onClose();
      navigate(`/workspace/${ws.id}`);
    }
  }

  return (
    <>
      <button type="button" className="modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="modal" role="dialog" aria-label="Create">
        <header className="modal-header">
          <h2>Create</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </header>

        <div className="create-tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={mode === m.id ? 'active' : undefined}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            {mode === 'task' ? 'Task name' : mode === 'project' ? 'Project name' : 'Workspace name'}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={mode === 'task' ? 'Homepage Design' : mode === 'project' ? 'Website Redesign' : 'Design Team'}
              autoFocus
              required
            />
          </label>

          {mode !== 'workspace' && (
            <label>
              Workspace
              <select
                value={workspaceId}
                onChange={(e) => {
                  setWorkspaceId(e.target.value);
                  const first = state.projects.find((p) => p.workspaceId === e.target.value);
                  if (first) setProjectId(first.id);
                }}
              >
                {myWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </label>
          )}

          {mode === 'task' && (
            <>
              <label>
                Project
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Assignee
                <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                  {state.users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </label>
              <div className="field-row">
                <label>
                  Due date
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </label>
                <label>
                  Priority
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          )}

          {mode === 'workspace' && (
            <label>
              Type
              <select value={wsType} onChange={(e) => setWsType(e.target.value)}>
                <option value="personal">Personal</option>
                <option value="team">Team</option>
              </select>
            </label>
          )}

          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn">Create</button>
          </div>
        </form>
      </div>
    </>
  );
}
