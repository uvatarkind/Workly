import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as store from '../data/store';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const value = useMemo(() => {
    void version;
    const state = store.getState();
    return {
      state,
      currentUser: store.getCurrentUser(),
      myWorkspaces: store.getMyWorkspaces(),
      activeWorkspace: store.getActiveWorkspace(),
      myNotifications: store.getMyNotifications(),
      refresh,
      getUser: store.getUser,
      getWorkspace: store.getWorkspace,
      getProject: store.getProject,
      getTask: store.getTask,
      getProjectsByWorkspace: store.getProjectsByWorkspace,
      getTasksByProject: store.getTasksByProject,
      getTasksByWorkspace: store.getTasksByWorkspace,
      getMyTasks: store.getMyTasks,
      getMyWorkspaces: store.getMyWorkspaces,
      getActiveWorkspace: store.getActiveWorkspace,
      setActiveWorkspace: (...args) => {
        const before = store.getActiveWorkspace()?.id;
        const result = store.setActiveWorkspace(...args);
        if (!result.error && !result.unchanged && result.workspace?.id !== before) {
          refresh();
        }
        return result;
      },
      getMyNotifications: store.getMyNotifications,
      getPendingInvitesForUser: store.getPendingInvitesForUser,
      getWorkspaceInvites: store.getWorkspaceInvites,
      isWorkspaceMember: store.isWorkspaceMember,
      projectProgress: store.projectProgress,
      addTask: (...args) => { const r = store.addTask(...args); refresh(); return r; },
      updateTask: (...args) => { store.updateTask(...args); refresh(); },
      deleteTask: (...args) => { store.deleteTask(...args); refresh(); },
      toggleSubtask: (...args) => { store.toggleSubtask(...args); refresh(); },
      addSubtask: (...args) => { store.addSubtask(...args); refresh(); },
      removeSubtask: (...args) => { store.removeSubtask(...args); refresh(); },
      addComment: (...args) => { store.addComment(...args); refresh(); },
      addProject: (...args) => { const r = store.addProject(...args); refresh(); return r; },
      addWorkspace: (...args) => { const r = store.addWorkspace(...args); refresh(); return r; },
      sendWorkspaceInvite: (...args) => { const r = store.sendWorkspaceInvite(...args); refresh(); return r; },
      acceptWorkspaceInvite: (...args) => { const r = store.acceptWorkspaceInvite(...args); refresh(); return r; },
      declineWorkspaceInvite: (...args) => { const r = store.declineWorkspaceInvite(...args); refresh(); return r; },
      switchUser: (...args) => { const r = store.switchUser(...args); refresh(); return r; },
      markNotificationRead: (...args) => { store.markNotificationRead(...args); refresh(); },
      markAllNotificationsRead: () => { store.markAllNotificationsRead(); refresh(); },
      updateProfile: (...args) => { store.updateProfile(...args); refresh(); },
      clearAllData: () => { store.clearAllData(); refresh(); },
      searchAll: store.searchAll,
    };
  }, [version, refresh]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
