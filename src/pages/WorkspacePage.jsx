import { Link, useParams, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { projectProgress } from '../data/store';
import WorkspaceAccess from '../components/WorkspaceAccess';

export default function WorkspacePage() {
  const { id } = useParams();
  const { openTask } = useOutletContext();
  const { getWorkspace, getProjectsByWorkspace, getTasksByWorkspace, getUser } = useApp();

  const workspace = getWorkspace(id);
  if (!workspace) {
    return <p className="empty-state">Workspace not found.</p>;
  }

  const projects = getProjectsByWorkspace(id);
  const tasks = getTasksByWorkspace(id).filter((t) => t.status !== 'done');
  const members = workspace.memberIds.map((mid) => getUser(mid)).filter(Boolean);

  return (
    <WorkspaceAccess workspaceId={id}>
    <div className="page">
      <header className="page-header split">
        <div>
          <h1>{workspace.icon} {workspace.name}</h1>
          <p>
            <span className={workspace.type === 'personal' ? 'workspace-badge personal' : 'workspace-badge team'}>
              {workspace.type === 'personal' ? 'Personal space' : 'Team workspace'}
            </span>
            {' — '}
            {workspace.type === 'personal'
              ? 'Your private workspace for individual work.'
              : 'Collaborate with your team on shared projects.'}
          </p>
        </div>
        <div className="workspace-quick-nav">
          <Link to={`/w/${id}/dashboard`} className="ghost-btn small">Dashboard</Link>
          <Link to={`/workspace/${id}/projects`} className="ghost-btn small">Projects</Link>
          <Link to={`/w/${id}/tasks`} className="ghost-btn small">Tasks</Link>
        </div>
      </header>

      <div className="workspace-overview">
        <section className="panel">
          <div className="panel-head split">
            <h2>Projects</h2>
            <Link to={`/workspace/${id}/projects`} className="ghost-btn small">View all</Link>
          </div>
          <ul className="project-cards">
            {projects.map((project) => (
              <li key={project.id}>
                <Link to={`/project/${project.id}`} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description.slice(0, 80)}{project.description.length > 80 ? '…' : ''}</p>
                  <div className="project-card-meta">
                    <span>{projectProgress(project.id)}% complete</span>
                    {project.dueDate && <span>Due {project.dueDate}</span>}
                  </div>
                </Link>
                <Link to={`/w/${id}/tasks/${project.id}`} className="project-card-board-link">
                  Open task board →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-head split">
            <h2>Open Tasks</h2>
            <Link to={`/w/${id}/tasks`} className="ghost-btn small">View all</Link>
          </div>
          <ul className="simple-task-list">
            {tasks.slice(0, 6).map((task) => (
              <li key={task.id}>
                <button type="button" onClick={() => openTask(task.id)}>
                  {task.title}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {workspace.type === 'team' && (
          <section className="panel">
            <div className="panel-head split">
              <h2>Members</h2>
              <Link to={`/workspace/${id}/members`} className="ghost-btn small">Manage</Link>
            </div>
            <ul className="member-list compact">
              {members.map((member) => (
                <li key={member.id}>
                  <span className="member-avatar">{member.initials}</span>
                  <span>{member.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
    </WorkspaceAccess>
  );
}
