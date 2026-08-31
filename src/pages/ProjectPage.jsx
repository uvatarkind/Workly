import { useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { openCreate, projectPath, projectsPath } from '../utils/routes';
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
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { openTask } = useOutletContext();
  const [tab, setTab] = useState('board');
  const { workspace, projects } = useWorkspaceScope();
  const { getProject, getTasksByProject, getWorkspace } = useApp();

  const project = getProject(projectId);
  const ws = getWorkspace(workspaceId);

  if (!project || !ws || project.workspaceId !== workspaceId) {
    return (
      <div className="page project-page">
        <p className="empty-state">Project not found in this workspace.</p>
        <Link to={projectsPath(workspaceId)} className="ghost-btn">Back to projects</Link>
      </div>
    );
  }

  const tasks = getTasksByProject(projectId);

  function handleProjectChange(nextProjectId) {
    if (nextProjectId && nextProjectId !== projectId) {
      navigate(projectPath(workspaceId, nextProjectId));
    }
  }

  return (
    <div className="page project-page">
      <header className="project-toolbar">
        <Link to={projectsPath(workspaceId)} className="project-back-btn" aria-label="Back to projects">
          <IconChevronLeft />
        </Link>

        <div className="project-toolbar-actions">
          <label className="project-switcher-wrap">
            <span className="visually-hidden">Switch project</span>
            <select
              className="project-switcher"
              value={projectId}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              {projects.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="primary-btn small"
            onClick={() => openCreate({ mode: 'task', workspaceId, projectId })}
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
