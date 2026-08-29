import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import WorkspaceAccess from '../components/WorkspaceAccess';
import TeamPanel from '../components/TeamPanel';

export default function MembersPage() {
  const { id } = useParams();
  const { getWorkspace } = useApp();

  const workspace = getWorkspace(id);
  if (!workspace) return <p className="empty-state">Workspace not found.</p>;

  return (
    <WorkspaceAccess workspaceId={id}>
      <div className="page">
        <header className="page-header">
          <h1>Team Members</h1>
          <p>{workspace.name}</p>
        </header>

        <section className="panel">
          <TeamPanel workspaceId={id} showHeader={false} />
          <p className="settings-note">
            Demo emails: sarah@workly.app, mike@workly.app, john@workly.app, alex@workly.app
          </p>
        </section>
      </div>
    </WorkspaceAccess>
  );
}
