import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { projectProgress } from '../data/store';
import { formatDate } from '../utils/dates';
import { openCreate, projectPath } from '../utils/routes';
import { useWorkspaceScope } from '../utils/useWorkspaceScope';
import { IconPlus } from '../components/Icons';

export default function ProjectsPage() {
  const { workspace, workspaceId, projects } = useWorkspaceScope();
  const { getUser, getTasksByProject } = useApp();

  if (!workspace) return <p className="empty-state">Workspace not found.</p>;

  return (
    <div className="page projects-page">
      <header className="page-header split">
        <div>
          <h1>Projects</h1>
          <p>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          type="button"
          className="primary-btn small"
          onClick={() => openCreate({ mode: 'project', workspaceId })}
        >
          <IconPlus />
          New project
        </button>
      </header>

      {projects.length === 0 ? (
        <div className="projects-empty panel">
          <h2>No projects yet</h2>
          <p>Create a project to organize tasks on a board — like Trello.</p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => openCreate({ mode: 'project', workspaceId })}
          >
            <IconPlus />
            Create your first project
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => {
            const manager = getUser(project.managerId);
            const progress = projectProgress(project.id);
            const tasks = getTasksByProject(project.id);
            const openTasks = tasks.filter((t) => t.status !== 'done').length;
            return (
              <Link
                key={project.id}
                to={projectPath(workspaceId, project.id)}
                className="project-card large"
              >
                <div className="project-card-top">
                  <h3>{project.name}</h3>
                  <span className="project-card-stat">{openTasks} open</span>
                </div>
                <p>{project.description || 'No description yet.'}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="project-card-foot">
                  <span>{manager?.name}</span>
                  <span>{tasks.length} tasks</span>
                  <span>{progress}%</span>
                  {project.dueDate && <span>Due {formatDate(project.dueDate)}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
