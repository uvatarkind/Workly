import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { workspacePath } from '../utils/routes';
import { currentSectionFromPath, workspaceSectionPath } from '../utils/useWorkspaceScope';
import { IconCheckCircle, IconChevronDown, IconPlus } from './Icons';

function workspaceTypeLabel(type) {
  return type === 'personal' ? 'Personal space' : 'Team workspace';
}

export default function WorkspaceSwitcher({ onCreateWorkspace }) {
  const { myWorkspaces, activeWorkspace, setActiveWorkspace } = useApp();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  if (!activeWorkspace) return null;

  function selectWorkspace(workspace) {
    if (workspace.id === activeWorkspace.id) {
      setOpen(false);
      return;
    }

    const result = setActiveWorkspace(workspace.id);
    if (result?.error) return;

    setOpen(false);

    const section = currentSectionFromPath(location.pathname);
    navigate(workspaceSectionPath(workspace.id, section));
  }

  function handleCreate() {
    setOpen(false);
    onCreateWorkspace?.();
  }

  const personal = myWorkspaces.filter((w) => w.type === 'personal');
  const team = myWorkspaces.filter((w) => w.type === 'team');

  function renderGroup(label, items) {
    if (items.length === 0) return null;
    return (
      <div className="ws-switcher-group">
        <p className="ws-switcher-group-label">{label}</p>
        <ul>
          {items.map((workspace) => {
            const active = workspace.id === activeWorkspace.id;
            return (
              <li key={workspace.id}>
                <button
                  type="button"
                  className={active ? 'ws-switcher-item active' : 'ws-switcher-item'}
                  onClick={() => selectWorkspace(workspace)}
                >
                  <span className="ws-switcher-item-icon" aria-hidden="true">{workspace.icon}</span>
                  <span className="ws-switcher-item-text">
                    <strong>{workspace.name}</strong>
                    <span>{workspaceTypeLabel(workspace.type)}</span>
                  </span>
                  {active && <IconCheckCircle />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="ws-switcher" ref={rootRef}>
      <button
        type="button"
        className="ws-switcher-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ws-switcher-trigger-icon" aria-hidden="true">{activeWorkspace.icon}</span>
        <span className="ws-switcher-trigger-text">
          <strong>{activeWorkspace.name}</strong>
          <span className="ws-switcher-type">
            {workspaceTypeLabel(activeWorkspace.type)}
          </span>
        </span>
        <IconChevronDown />
      </button>

      {open && (
        <div className="ws-switcher-menu" role="listbox" aria-label="Workspaces">
          <div className="ws-switcher-menu-head">
            <p>Your workspaces</p>
            <Link
              to={workspacePath(activeWorkspace.id, 'dashboard')}
              className="ws-switcher-view-link"
              onClick={() => setOpen(false)}
            >
              Open dashboard
            </Link>
          </div>

          {renderGroup('Personal', personal)}
          {renderGroup('Teams', team)}

          <button type="button" className="ws-switcher-create" onClick={handleCreate}>
            <IconPlus />
            New workspace
          </button>
        </div>
      )}
    </div>
  );
}
