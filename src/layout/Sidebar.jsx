import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconBook,
  IconFolderPlus,
  IconGrid,
  IconLayers,
  IconSend,
  IconSettings,
} from '../components/Icons';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';

const mainNav = [
  { to: '/dashboard', icon: IconGrid, label: 'Dashboard', end: true },
  { to: '/timeline', icon: IconLayers, label: 'Timeline' },
  { to: '/calendar', icon: IconBook, label: 'Calendar' },
  { to: '/settings', icon: IconSettings, label: 'Settings' },
  { to: '/notifications', icon: IconSend, label: 'Notifications' },
  { to: '/files', icon: IconFolderPlus, label: 'Files' },
];

export default function Sidebar({ open, onNavigate }) {
  const { myNotifications } = useApp();
  const unread = myNotifications.filter((n) => !n.read).length;
  const [tooltip, setTooltip] = useState(null);

  function handleClick() {
    onNavigate?.();
  }

  function showTooltip(event, label) {
    if (window.matchMedia('(max-width: 800px)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      label,
      top: rect.top - 4,
      left: rect.right + 2,
    });
  }

  function hideTooltip() {
    setTooltip(null);
  }

  return (
    <aside id="app-sidebar" className={open ? 'open' : undefined}>
      <NavLink to="/dashboard" className="sidebar-brand" onClick={handleClick}>
        <img src={logo} alt="Workly" className="sidebar-logo" width={44} height={44} />
        <span className="sidebar-brand-name">Workly.</span>
      </NavLink>

      <nav className="sidebar-icons" aria-label="Main">
        <ul>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-icon-btn active' : 'sidebar-icon-btn'
                  }
                  onClick={handleClick}
                  onMouseEnter={(e) => showTooltip(e, item.label)}
                  onMouseLeave={hideTooltip}
                  onFocus={(e) => showTooltip(e, item.label)}
                  onBlur={hideTooltip}
                >
                  <span className="sidebar-icon-wrap">
                    <Icon />
                    {item.label === 'Notifications' && unread > 0 && (
                      <span className="sidebar-notify-dot">{unread}</span>
                    )}
                  </span>
                  <span className="nav-text">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {tooltip && (
        <div
          className="sidebar-tooltip"
          style={{ top: `${tooltip.top}px`, left: `${tooltip.left}px` }}
          role="tooltip"
        >
          {tooltip.label}
        </div>
      )}
    </aside>
  );
}
