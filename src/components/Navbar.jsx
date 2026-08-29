import { IconBell, IconMenu, IconSearch } from './Icons';

const Navbar = ({
  query,
  onQueryChange,
  menuOpen,
  onMenuToggle,
  alertCount = 0,
  profile,
  onOpenProfile,
}) => {
  const initials = profile?.avatarInitials || 'Y';

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
        <label className="search">
          <IconSearch />
          <span className="visually-hidden">Search tasks</span>
          <input
            type="search"
            name="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search anything..."
            autoComplete="off"
          />
        </label>
        <div className="nav-actions">
          <span className="bell" title="Overdue tasks">
            <IconBell />
            {alertCount > 0 && <span className="badge">{alertCount}</span>}
            <span className="visually-hidden">
              {alertCount} overdue {alertCount === 1 ? 'task' : 'tasks'}
            </span>
          </span>
          <button
            type="button"
            className="user-chip"
            title="Open profile settings"
            onClick={onOpenProfile}
          >
            <span className="avatar">{initials}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
