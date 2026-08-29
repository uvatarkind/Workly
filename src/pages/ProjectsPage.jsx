import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { projectProgress } from '../data/store';
import { formatDate } from '../utils/dates';
import WorkspaceAccess from '../components/WorkspaceAccess';

export default function ProjectsPage() {
  const { id } = useParams();
  const { getWorkspace, getProjectsByWorkspace, getUser } = useApp();

  const workspace = getWorkspace(id);
  if (!workspace) return <p className="empty-state">Workspace not found.</p>;

  const projects = getProjectsByWorkspace(id);

  return (
    <WorkspaceAccess workspaceId={id}>
    <div className="page">
      <header className="page-header">
        <h1>Projects</h1>
        <p>{workspace.name} — {projects.length} project{projects.length !== 1 ? 's' : ''}</p>
      </header>

      <div className="project-grid">
        {projects.map((project) => {
          const manager = getUser(project.managerId);
          const progress = projectProgress(project.id);
          return (
            <Link key={project.id} to={`/project/${project.id}`} className="project-card large">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="project-card-foot">
                <span>{manager?.name}</span>
                <span>{progress}%</span>
                {project.dueDate && <span>Due {formatDate(project.dueDate)}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
    </WorkspaceAccess>
  );
}
