import { useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { openCreate, projectPathFor, projectsPathFor } from '../utils/routes';
import { useWorkspaceScope } from '../utils/useWorkspaceScope';
import TaskBoardView from '../components/TaskBoardView';
import ProjectList from '../components/ProjectList';
import ProjectCalendar from '../components/ProjectCalendar';
import { IconChevronLeft, IconPlus } from '../components/Icons';

const TABS = [
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'List' },
  { id: 'calendar', label: 'Calendar' },
];

export default function ProjectPage() {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  const { openTask } = useOutletContext();
  const [tab, setTab] = useState('board');
  const { workspace, workspaceId, projects } = useWorkspaceScope();
  const { getProjectBySlug, getTasksByProject } = useApp();

  const project = workspaceId ? getProjectBySlug(workspaceId, projectSlug) : null;

  if (!workspace || !project) {
    return (
      <div className="page project-page">
        <p className="empty-state">Project not found in this workspace.</p>
        <Link to={projectsPathFor(workspace)} className="ghost-btn">Back to projects</Link>
      </div>
    );
  }

  if (project.slug !== projectSlug) {
    return <Navigate to={projectPathFor(workspace, project)} replace />;
  }

  const tasks = getTasksByProject(project.id);

  function handleProjectChange(nextProjectSlug) {
    const next = projects.find((item) => item.slug === nextProjectSlug);
    if (next && next.slug !== project.slug) {
      navigate(projectPathFor(workspace, next));
    }
  }

  return (
    <div className="page project-page">
      <header className="project-toolbar">
        <Link to={projectsPathFor(workspace)} className="project-back-btn" aria-label="Back to projects">
          <IconChevronLeft />
        </Link>

        <div className="project-toolbar-actions">
          <label className="project-switcher-wrap">
            <span className="visually-hidden">Switch project</span>
            <select
              className="project-switcher"
              value={project.slug}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              {projects.map((item) => (
                <option key={item.id} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="primary-btn small"
            onClick={() => openCreate({ mode: 'task', workspaceId, projectId: project.id })}
          >
            <IconPlus />
            Add task
          </button>
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

      {tab === 'board' && (
        <TaskBoardView
          project={project}
          workspace={workspace}
          tasks={tasks}
          onOpenTask={openTask}
        />
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
