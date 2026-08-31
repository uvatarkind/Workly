export const SECTIONS = {
  dashboard: 'dashboard',
  projects: 'projects',
  members: 'members',
  timeline: 'timeline',
  calendar: 'calendar',
  files: 'files',
  notifications: 'notifications',
  settings: 'settings',
};

const TEAM_BASE = '/workspace';
const PERSONAL_BASE = '/personal';

export function isPersonalWorkspace(workspace) {
  return workspace?.type === 'personal';
}

export function personalPath(section = SECTIONS.dashboard) {
  return `${PERSONAL_BASE}/${section}`;
}

export function personalProjectsPath() {
  return `${PERSONAL_BASE}/${SECTIONS.projects}`;
}

export function personalProjectPath(projectSlug) {
  return `${PERSONAL_BASE}/${SECTIONS.projects}/${projectSlug}`;
}

export function workspacePath(workspaceSlug, section = SECTIONS.dashboard) {
  return `${TEAM_BASE}/${workspaceSlug}/${section}`;
}

export function workspacePathFor(workspace, section = SECTIONS.dashboard) {
  if (!workspace?.slug) return '/';
  if (isPersonalWorkspace(workspace)) return personalPath(section);
  return workspacePath(workspace.slug, section);
}

export function projectsPath(workspaceSlug) {
  return `${TEAM_BASE}/${workspaceSlug}/${SECTIONS.projects}`;
}

export function projectsPathFor(workspace) {
  if (!workspace?.slug) return '/';
  if (isPersonalWorkspace(workspace)) return personalProjectsPath();
  return projectsPath(workspace.slug);
}

export function projectPath(workspaceSlug, projectSlug) {
  return `${TEAM_BASE}/${workspaceSlug}/${SECTIONS.projects}/${projectSlug}`;
}

export function projectPathFor(workspace, project) {
  if (!project?.slug) return '/';
  if (isPersonalWorkspace(workspace)) return personalProjectPath(project.slug);
  if (!workspace?.slug) return '/';
  return projectPath(workspace.slug, project.slug);
}

export function membersPath(workspaceSlug) {
  return `${TEAM_BASE}/${workspaceSlug}/${SECTIONS.members}`;
}

export function membersPathFor(workspace) {
  if (!workspace?.slug) return '/';
  if (isPersonalWorkspace(workspace)) return personalPath(SECTIONS.members);
  return membersPath(workspace.slug);
}

export function projectBoardPathFor(workspace, project) {
  return projectPathFor(workspace, project);
}

export function workspaceSectionPath(workspaceOrSlug, section) {
  if (typeof workspaceOrSlug === 'object' && workspaceOrSlug) {
    return workspacePathFor(workspaceOrSlug, section);
  }
  const slug = workspaceOrSlug;
  return slug === 'personal' ? personalPath(section) : workspacePath(slug, section);
}

export function isPersonalAppPath(pathname) {
  return pathname === PERSONAL_BASE || pathname.startsWith(`${PERSONAL_BASE}/`);
}

export function isWorkspaceProjectsPath(pathname, workspaceSlug, workspace) {
  if (isPersonalWorkspace(workspace) || workspaceSlug === 'personal') {
    return pathname.startsWith(`${PERSONAL_BASE}/${SECTIONS.projects}`);
  }
  return pathname.startsWith(`${TEAM_BASE}/${workspaceSlug}/${SECTIONS.projects}`);
}

export function isWorkspaceSectionPath(pathname, workspaceSlug, section, workspace) {
  if (isPersonalWorkspace(workspace) || workspaceSlug === 'personal') {
    const base = personalPath(section);
    return pathname === base || pathname.startsWith(`${base}/`);
  }
  const base = workspacePath(workspaceSlug, section);
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function currentSectionFromPath(pathname) {
  const personal = pathname.match(/^\/personal\/(.+)$/);
  if (personal) {
    const rest = personal[1];
    if (rest.startsWith(`${SECTIONS.projects}/`)) return SECTIONS.projects;
    return rest.split('/')[0];
  }

  const scoped = pathname.match(/^\/workspace\/[^/]+\/(.+)$/);
  if (scoped) {
    const rest = scoped[1];
    if (rest.startsWith(`${SECTIONS.projects}/`)) return SECTIONS.projects;
    return rest.split('/')[0];
  }

  const legacyW = pathname.match(/^\/w\/[^/]+\/(.+)$/);
  if (legacyW) {
    const rest = legacyW[1];
    if (rest.startsWith('projects/') || rest.startsWith('tasks/')) return SECTIONS.projects;
    return rest.split('/')[0];
  }

  const shortcuts = {
    '/dashboard': SECTIONS.dashboard,
    '/tasks': SECTIONS.projects,
    '/timeline': SECTIONS.timeline,
    '/calendar': SECTIONS.calendar,
    '/files': SECTIONS.files,
    '/notifications': SECTIONS.notifications,
    '/settings': SECTIONS.settings,
  };
  return shortcuts[pathname] ?? SECTIONS.dashboard;
}

export function canonicalWorkspacePath(workspace, rest = SECTIONS.dashboard) {
  if (!workspace?.slug) return '/';
  const clean = rest.replace(/^\//, '');
  if (isPersonalWorkspace(workspace)) {
    return `${PERSONAL_BASE}/${clean}`;
  }
  return `${TEAM_BASE}/${workspace.slug}/${clean}`;
}

export function openCreate(options = {}) {
  window.dispatchEvent(new CustomEvent('workly:create', { detail: options }));
}

export function resolvePersonalWorkspace(workspaces, getWorkspaceBySlug) {
  return workspaces.find((w) => w.type === 'personal')
    ?? getWorkspaceBySlug?.('personal')
    ?? getWorkspaceBySlug?.('ws-personal');
}
