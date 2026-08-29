import { useState } from 'react';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatDateLong } from '../utils/dates';
import TaskBoardView from '../components/TaskBoardView';
import ProjectList from '../components/ProjectList';
import ProjectCalendar from '../components/ProjectCalendar';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'List' },
  { id: 'calendar', label: 'Calendar' },
];

export default function ProjectPage() {
  const { id } = useParams();
  const { openTask } = useOutletContext();
  const [tab, setTab] = useState('board');
  const { getProject, getTasksByProject, getUser, getWorkspace, projectProgress } = useApp();

  const project = getProject(id);
  if (!project) return <p className="empty-state">Project not found.</p>;

  const tasks = getTasksByProject(id);
  const manager = getUser(project.managerId);
  const workspace = getWorkspace(project.workspaceId);
  const progress = projectProgress(id);

  const counts = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
  };

  return (
    <div className="page project-page">
      <header className="page-header">
        <p className="breadcrumb">
          <Link to={`/workspace/${project.workspaceId}/projects`}>{workspace?.name}</Link>
          <span>/</span>
          <span>{project.name}</span>
        </p>
        <h1>{project.name}</h1>
        <div className="project-meta">
          <span>Project Manager: <strong>{manager?.name}</strong></span>
          {project.dueDate && <span>Due: <strong>{formatDateLong(project.dueDate)}</strong></span>}
          <span>Progress: <strong>{progress}%</strong></span>
        </div>
      </header>

      <div className="view-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="project-overview">
          <section className="panel">
            <h2>Progress</h2>
            <div className="progress-bar large">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-label">{progress}% complete</p>
          </section>
          <section className="panel">
            <h2>Tasks</h2>
            <ul className="task-stats">
              <li><strong>{counts.total}</strong> total</li>
              <li><strong>{counts.done}</strong> completed</li>
              <li><strong>{counts.inProgress}</strong> in progress</li>
              <li><strong>{counts.todo}</strong> todo</li>
            </ul>
          </section>
          <section className="panel">
            <h2>Description</h2>
            <p>{project.description}</p>
          </section>
        </div>
      )}

      {tab === 'board' && (
        <TaskBoardView project={project} tasks={tasks} onOpenTask={openTask} />
      )}

      {tab === 'list' && (
        <ProjectList tasks={tasks} onOpenTask={openTask} />
      )}

      {tab === 'calendar' && (
        <ProjectCalendar tasks={tasks} onOpenTask={openTask} />
      )}
    </div>
  );
}
