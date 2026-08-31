export function workspacePath(workspaceId, section = 'dashboard') {
  return `/w/${workspaceId}/${section}`;
}

export function projectsPath(workspaceId) {
  return `/w/${workspaceId}/projects`;
}

export function projectPath(workspaceId, projectId) {
  return `/w/${workspaceId}/projects/${projectId}`;
}

export function tasksPath(workspaceId, projectId) {
  return projectId
    ? `/w/${workspaceId}/tasks/${projectId}`
    : `/w/${workspaceId}/tasks`;
}

export function membersPath(workspaceId) {
  return `/w/${workspaceId}/members`;
}

export function openCreate(options = {}) {
  window.dispatchEvent(new CustomEvent('workly:create', { detail: options }));
}
