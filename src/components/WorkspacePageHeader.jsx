import { Link } from 'react-router-dom';
import { projectsPathFor } from '../utils/routes';

function typeLabel(type) {
  return type === 'personal' ? 'Personal space' : 'Team workspace';
}

export default function WorkspacePageHeader({ workspace, section }) {
  if (!workspace) return null;

  return (
    <header className="workspace-page-header">
      <div className="workspace-page-header-main">
        <span className="workspace-page-header-icon" aria-hidden="true">{workspace.icon}</span>
        <div>
          <p className="workspace-page-header-eyebrow">{typeLabel(workspace.type)}</p>
          <h1>{section ? section : workspace.name}</h1>
        </div>
      </div>
      <Link to={projectsPathFor(workspace)} className="ghost-btn small">
        View projects
      </Link>
    </header>
  );
}
