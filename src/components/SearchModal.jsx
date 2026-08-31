import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { projectPath, workspacePath } from '../utils/routes';
import { IconSearch, IconX } from './Icons';

export default function SearchModal({ onClose, onOpenTask }) {
  const { searchAll } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const results = searchAll(query);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <button type="button" className="modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="modal search-modal" role="dialog" aria-label="Search">
        <div className="search-modal-input">
          <IconSearch />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, projects, people…"
            autoFocus
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </div>

        {query.trim() && (
          <div className="search-results">
            {results.tasks.length > 0 && (
              <section>
                <h3>Tasks</h3>
                <ul>
                  {results.tasks.map((task) => (
                    <li key={task.id}>
                      <button type="button" onClick={() => { onOpenTask(task.id); onClose(); }}>
                        {task.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.projects.length > 0 && (
              <section>
                <h3>Projects</h3>
                <ul>
                  {results.projects.map((project) => (
                    <li key={project.id}>
                      <button type="button" onClick={() => { navigate(projectPath(project.workspaceId, project.id)); onClose(); }}>
                        {project.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.workspaces.length > 0 && (
              <section>
                <h3>Workspaces</h3>
                <ul>
                  {results.workspaces.map((workspace) => (
                    <li key={workspace.id}>
                      <button type="button" onClick={() => { navigate(workspacePath(workspace.id, 'dashboard')); onClose(); }}>
                        {workspace.icon} {workspace.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.people.length > 0 && (
              <section>
                <h3>People</h3>
                <ul>
                  {results.people.map((person) => (
                    <li key={person.id}>
                      <span className="member-avatar tiny">{person.initials}</span>
                      {person.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!results.tasks.length && !results.projects.length && !results.workspaces.length && !results.people.length && (
              <p className="empty-state">No results for "{query}"</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
