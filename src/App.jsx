import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Files from './components/Files';
import Settings from './components/Settings';
import TaskBoard from './components/TaskBoard';
import Timeline from './components/Timeline';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import {
  addTask,
  deleteTask,
  filterCompleted,
  getVisibleTasks,
  loadTasks,
  moveTask,
  overdueCount,
  saveTasks,
  toggleTask,
} from './tasks';
import { loadProfile } from './profile';

function emptyMessage(tasks, query) {
  if (tasks.length === 0) {
    return query.trim()
      ? 'No tasks match your search.'
      : 'No tasks yet. Add one above.';
  }
  return 'No tasks match these filters.';
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [view, setView] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function handleAdd(input) {
    setTasks((current) => addTask(current, input));
  }

  function handleToggle(id) {
    setTasks((current) => toggleTask(current, id));
  }

  function handleDelete(id) {
    setTasks((current) => deleteTask(current, id));
  }

  function handleMove(id, stage) {
    setTasks((current) => moveTask(current, id, stage));
  }

  function handleNavigate(nextView) {
    setView(nextView);
    setMenuOpen(false);
    if (nextView === 'settings') {
      setProfile(loadProfile());
    }
  }

  function handleClearAll() {
    setTasks([]);
  }

  const completedTasks = filterCompleted(tasks);
  const openCount = tasks.length - completedTasks.length;
  const scopedTasks = view === 'completed' ? completedTasks : tasks;
  const visibleTasks = getVisibleTasks(scopedTasks, {
    query,
    status: view === 'completed' ? 'completed' : status,
    priority,
  });

  let content;
  if (view === 'dashboard') {
    content = (
      <Dashboard
        tasks={tasks}
        visibleTasks={visibleTasks}
        openCount={openCount}
        completedCount={completedTasks.length}
        status={status}
        priority={priority}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onAdd={handleAdd}
        onToggle={handleToggle}
        onDelete={handleDelete}
        emptyMessage={tasks.length === 0 ? null : emptyMessage(tasks, query)}
      />
    );
  } else if (view === 'timeline') {
    content = (
      <Timeline
        tasks={tasks}
        query={query}
        onInvite={() => handleNavigate('settings')}
      />
    );
  } else if (view === 'tasks') {
    content = (
      <TaskBoard
        tasks={visibleTasks}
        onAdd={handleAdd}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onMove={handleMove}
        emptyMessage={emptyMessage(tasks, query)}
      />
    );
  } else if (view === 'files') {
    content = <Files query={query} />;
  } else if (view === 'settings') {
    content = (
      <Settings
        onClearAll={handleClearAll}
        onProfileSaved={() => setProfile(loadProfile())}
      />
    );
  } else if (view === 'completed') {
    content = (
      <>
        <header className="page-header">
          <div>
            <h1>Completed</h1>
            <p>Finished work stays here until you delete it</p>
          </div>
        </header>
        <section className="panel">
          <TaskFilters
            status={status}
            priority={priority}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            hideStatus
          />
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            emptyMessage={
              completedTasks.length === 0
                ? 'No completed tasks yet.'
                : 'No completed tasks match these filters.'
            }
          />
        </section>
      </>
    );
  }

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
      <Sidebar view={view} onNavigate={handleNavigate} open={menuOpen} />
      <div className="app-shell">
        <Navbar
          query={query}
          onQueryChange={setQuery}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
          alertCount={overdueCount(tasks)}
          profile={profile}
          onOpenProfile={() => handleNavigate('settings')}
        />
        <main>{content}</main>
      </div>
    </div>
  );
}

export default App;
