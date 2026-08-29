import { NavLink } from 'react-router-dom';
import {
  IconBell,
  IconCalendar,
  IconFolder,
  IconGrid,
  IconList,
  IconPlus,
  IconSettings,
  IconTimeline,
} from '../components/Icons';
import { useApp } from '../context/AppContext';

const mainNav = [
  { to: '/dashboard', icon: IconGrid, label: 'Dashboard', end: true },
  { to: '/timeline', icon: IconTimeline, label: 'Timeline' },
  { to: '/calendar', icon: IconCalendar, label: 'Calendar' },
  { to: '/project/p1', icon: IconList, label: 'Board' },
  { to: '/files', icon: IconFolder, label: 'Files' },
  { to: '/settings', icon: IconSettings, label: 'Settings' },
  { to: '/notifications', icon: IconBell, label: 'Notifications' },
];

export default function Sidebar({ open, onNavigate }) {
  const { myNotifications } = useApp();
  const unread = myNotifications.filter((n) => !n.read).length;

  function handleClick() {
    onNavigate?.();
  }

  return (
    <aside id="app-sidebar" className={open ? 'open' : undefined}>
      <nav className="sidebar-icons" aria-label="Main">
        <ul>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className="sidebar-icon-btn"
                  title={item.label}
                  onClick={handleClick}
                >
                  <Icon />
                  <span className="nav-text">{item.label}</span>
                  {item.label === 'Notifications' && unread > 0 && (
                    <span className="sidebar-notify-dot">{unread}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-icon-btn create-icon-btn"
          title="Create"
          onClick={() => {
            handleClick();
            window.dispatchEvent(new CustomEvent('workly:create'));
          }}
        >
          <IconPlus />
          <span className="nav-text">Create</span>
        </button>
      </div>
    </aside>
  );
}
