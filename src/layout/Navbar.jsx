import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconBell, IconChevronDown, IconMenu, IconSearch } from '../components/Icons';
import { useApp } from '../context/AppContext';

export default function Navbar({ menuOpen, onMenuToggle, onSearchOpen }) {
  const { currentUser, myNotifications } = useApp();
  const unread = myNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchOpen();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSearchOpen]);

  return (
    <header className="navbar">
      <nav>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
          onClick={onMenuToggle}
        >
          <IconMenu />
          <span className="visually-hidden">Menu</span>
        </button>

        <button type="button" className="search" onClick={onSearchOpen}>
          <IconSearch />
          <span className="search-placeholder">Search anything…</span>
          <kbd className="search-kbd">⌘K</kbd>
        </button>

        <div className="nav-actions">
          <Link to="/notifications" className="bell" title="Notifications">
            <IconBell />
            {unread > 0 && <span className="badge">{unread}</span>}
            <span className="visually-hidden">{unread} unread notifications</span>
          </Link>
          <Link to="/settings" className="user-chip" title="Settings">
            <span className="avatar">{currentUser.initials}</span>
            <IconChevronDown />
          </Link>
        </div>
      </nav>
    </header>
  );
}
