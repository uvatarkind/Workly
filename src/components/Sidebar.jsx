import {
  IconCalendar,
  IconCheckCircle,
  IconFolder,
  IconGrid,
  IconList,
  IconSettings,
} from './Icons';

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: IconGrid },
  { id: 'timeline', label: 'Timeline', icon: IconCalendar },
  { id: 'tasks', label: 'My Tasks', icon: IconList },
  { id: 'completed', label: 'Completed', icon: IconCheckCircle },
  { id: 'files', label: 'Files', icon: IconFolder },
  { id: 'settings', label: 'Settings', icon: IconSettings },
];

const Sidebar = ({ view, onNavigate, open }) => {
  return (
    <aside id="app-sidebar" className={open ? 'open' : undefined}>
      <div className="workspace">
        <span className="logo" aria-hidden="true">
          TF
        </span>
      </div>
      <nav aria-label="Main">
        <ul>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={view === item.id ? 'active' : undefined}
                  aria-current={view === item.id ? 'page' : undefined}
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon />
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
