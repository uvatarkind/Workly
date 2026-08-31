import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconCalendar,
  IconFolder,
  IconFolderPlus,
  IconGrid,
  IconLayers,
  IconPlus,
  IconSend,
  IconSettings,
} from '../components/Icons';
import { useApp } from '../context/AppContext';
import { useRouteWorkspaceId } from '../utils/useRouteWorkspaceId';
import { workspaceSectionPath } from '../utils/useWorkspaceScope';
import logo from '../assets/logo.png';

const mainNav = [
  { section: 'dashboard', icon: IconGrid, label: 'Dashboard' },
  { section: 'projects', icon: IconFolder, label: 'Projects' },
  { section: 'timeline', icon: IconLayers, label: 'Timeline' },
  { section: 'calendar', icon: IconCalendar, label: 'Calendar' },
  { section: 'settings', icon: IconSettings, label: 'Settings' },
  { section: 'notifications', icon: IconSend, label: 'Notifications' },
  { section: 'files', icon: IconFolderPlus, label: 'Files' },
];

export default function Sidebar({ open, onNavigate, onCreateWorkspace }) {
  const { myNotifications, myWorkspaces, activeWorkspace, setActiveWorkspace } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const wsId = useRouteWorkspaceId();
  const unread = myNotifications.filter((n) => !n.read).length;

  function closeMenu() {
    onNavigate?.();
  }

  function goToSection(section) {
    const target = workspaceSectionPath(wsId, section);
    if (location.pathname !== target && !location.pathname.startsWith(`${target}/`)) {
      navigate(target);
    }
    closeMenu();
  }

  function selectWorkspace(workspace) {
    setActiveWorkspace(workspace.id);
    navigate(workspaceSectionPath(workspace.id, 'dashboard'));
    closeMenu();
  }

  function isSectionActive(section) {
    const base = workspaceSectionPath(wsId, section);
    if (section === 'projects') {
      return location.pathname.startsWith(`/w/${wsId}/projects`);
    }
    return location.pathname === base;
  }

  return (
    <aside id="app-sidebar" className={open ? 'open' : undefined}>
      <button
        type="button"
        className="sidebar-brand sidebar-brand-btn"
        onClick={() => goToSection('dashboard')}
      >
        <img src={logo} alt="Workly" className="sidebar-logo" width={44} height={44} />
        <span className="sidebar-brand-name">Workly.</span>
      </button>

      <div className="sidebar-workspaces">
        <div className="sidebar-workspaces-head">
          <span className="sidebar-workspaces-label">Workspaces</span>
          <button
            type="button"
            className="sidebar-workspaces-add"
            aria-label="New workspace"
            onClick={onCreateWorkspace}
          >
            <IconPlus />
          </button>
        </div>
        <ul className="sidebar-workspace-list">
          {myWorkspaces.map((workspace) => {
            const active = workspace.id === activeWorkspace?.id;
            return (
              <li key={workspace.id}>
                <button
                  type="button"
                  className={active ? 'sidebar-workspace-item active' : 'sidebar-workspace-item'}
                  onClick={() => selectWorkspace(workspace)}
                >
                  <span className="sidebar-workspace-icon" aria-hidden="true">{workspace.icon}</span>
                  <span className="sidebar-workspace-text">
                    <span className="sidebar-workspace-name">{workspace.name}</span>
                    <span className="sidebar-workspace-type">
                      {workspace.type === 'personal' ? 'Personal' : 'Team'}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <nav className="sidebar-icons" aria-label="Main">
        <ul>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isSectionActive(item.section);
            return (
              <li key={item.label}>
                <button
                  type="button"
                  className={active ? 'sidebar-icon-btn active' : 'sidebar-icon-btn'}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => goToSection(item.section)}
                >
                  <span className="sidebar-icon-wrap">
                    <Icon />
                    {item.label === 'Notifications' && unread > 0 && (
                      <span className="sidebar-notify-dot">{unread}</span>
                    )}
                  </span>
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
