import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TaskDrawer from '../components/TaskDrawer';
import CreateModal from '../components/CreateModal';
import SearchModal from '../components/SearchModal';

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  useEffect(() => {
    function onOpenTask(e) {
      setActiveTaskId(e.detail);
    }
    window.addEventListener('workly:open-task', onOpenTask);
    return () => window.removeEventListener('workly:open-task', onOpenTask);
  }, []);

  return (
    <div className="app">
      {menuOpen && (
        <button
          type="button"
          className="backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="app-shell">
        <Navbar
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((o) => !o)}
          onSearchOpen={() => setSearchOpen(true)}
        />
        <main>
          <Outlet context={{ openTask: setActiveTaskId }} />
        </main>
      </div>
      {activeTaskId && (
        <TaskDrawer taskId={activeTaskId} onClose={() => setActiveTaskId(null)} />
      )}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} />}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onOpenTask={setActiveTaskId} />}
    </div>
  );
}
