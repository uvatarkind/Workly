import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PRIORITIES, PRIORITY_LABELS } from '../data/constants';
import { projectPathFor, workspacePathFor } from '../utils/routes';
import { IconX } from './Icons';

const MODES = [
  { id: 'task', label: 'Task' },
  { id: 'project', label: 'Project' },
  { id: 'workspace', label: 'Workspace' },
];

export default function CreateModal({
  onClose,
  initialMode = 'task',
  initialWorkspaceId,
  initialProjectId,
}) {
  const navigate = useNavigate();
  const { myWorkspaces, activeWorkspace, addTask, addProject, addWorkspace, state } = useApp();
  const [mode, setMode] = useState(initialMode);
  const [title, setTitle] = useState('');
  const defaultWorkspaceId = initialWorkspaceId ?? activeWorkspace?.id ?? myWorkspaces[0]?.id ?? '';
  const defaultProjectId = initialProjectId
    ?? state.projects.find((p) => p.workspaceId === defaultWorkspaceId)?.id
    ?? '';
  const [workspaceId, setWorkspaceId] = useState(defaultWorkspaceId);
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [assigneeId, setAssigneeId] = useState('u1');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [wsType, setWsType] = useState('team');

  const projects = state.projects.filter((p) => p.workspaceId === workspaceId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'task') {
      const project = state.projects.find(
        (p) => p.id === projectId && p.workspaceId === workspaceId,
      ) ?? projects[0];
      if (!project) return;

      const task = addTask({
        title,
        workspaceId: project.workspaceId,
        projectId: project.id,
        assigneeId,
        dueDate,
        priority,
      });
      onClose();
      window.dispatchEvent(new CustomEvent('workly:open-task', { detail: task.id }));
    } else if (mode === 'project') {
      const project = addProject({ name: title, workspaceId });
      onClose();
      navigate(projectPathFor(
        state.workspaces.find((w) => w.id === workspaceId),
        project,
      ));
    } else {
      const ws = addWorkspace({ name: title, type: wsType });
      onClose();
      navigate(workspacePathFor(ws, 'dashboard'));
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
                  const wsId = e.target.value;
                  setWorkspaceId(wsId);
                  const first = state.projects.find((p) => p.workspaceId === wsId);
                  setProjectId(first?.id ?? '');
                }}
              >
                {myWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.icon} {ws.name} ({ws.type === 'personal' ? 'Personal' : 'Team'})
                  </option>
                ))}
              </select>
            </label>
          )}

          {mode === 'task' && (
            <>
              <label>
                Project
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  disabled={projects.length === 0}
                >
                  {projects.length === 0 ? (
                    <option value="">No projects in this workspace</option>
                  ) : (
                    projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))
                  )}
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
            <>
              <p className="field-hint">
                Personal spaces are for your own work. Team workspaces let you collaborate and invite members.
              </p>
              <label>
                Type
                <select value={wsType} onChange={(e) => setWsType(e.target.value)}>
                  <option value="personal">Personal space</option>
                  <option value="team">Team workspace</option>
                </select>
              </label>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={mode === 'task' && projects.length === 0}>
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
