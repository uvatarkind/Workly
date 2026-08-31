import { Link } from 'react-router-dom';
import { IconChevronLeft } from './Icons';
import { projectsPathFor, workspacePathFor } from '../utils/routes';

export default function PageNav({ workspace, section, projectName }) {
  if (!workspace) return null;

  const dashboardUrl = workspacePathFor(workspace, 'dashboard');
  const projectsUrl = projectsPathFor(workspace);

  return (
    <nav className="page-nav" aria-label="Page navigation">
      <div className="page-nav-back-row">
        {section === 'project' && (
          <Link to={projectsUrl} className="page-nav-back">
            <IconChevronLeft />
            Back to projects
          </Link>
        )}
        {section === 'members' && (
          <Link to={dashboardUrl} className="page-nav-back">
            <IconChevronLeft />
            Back to dashboard
          </Link>
        )}
      </div>

      <div className="page-nav-trail">
        {section === 'project' && (
          <>
            <Link to={projectsUrl}>Projects</Link>
            {projectName && (
              <>
                <span className="page-nav-sep">/</span>
                <span className="page-nav-current">{projectName}</span>
              </>
            )}
          </>
        )}
        {section === 'members' && (
          <>
            <Link to={dashboardUrl}>{workspace.icon} {workspace.name}</Link>
            <span className="page-nav-sep">/</span>
            <span className="page-nav-current">Members</span>
          </>
        )}
      </div>
    </nav>
  );
}
