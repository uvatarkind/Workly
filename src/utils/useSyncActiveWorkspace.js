import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useSyncActiveWorkspace(workspaceId) {
  const { setActiveWorkspace, isWorkspaceMember, activeWorkspace } = useApp();

  useEffect(() => {
    if (!workspaceId || !isWorkspaceMember(workspaceId)) return;
    if (activeWorkspace?.id === workspaceId) return;
    setActiveWorkspace(workspaceId);
  }, [workspaceId, setActiveWorkspace, isWorkspaceMember, activeWorkspace?.id]);
}
