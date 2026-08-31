import {
  seedUsers,
  seedWorkspaces,
  seedProjects,
  seedTasks,
  seedNotifications,
  seedActivity,
  seedInvites,
} from './mockData';

const STORAGE_KEY = 'workly.app';

function normalizeState(raw) {
  const base = {
    currentUserId: 'u1',
    users: seedUsers,
    workspaces: seedWorkspaces,
    projects: seedProjects,
    tasks: seedTasks,
    notifications: seedNotifications,
    activity: seedActivity,
    invites: seedInvites,
  };

  if (!raw) {
    const initial = { ...base };
    initial.activeWorkspaceId = resolveActiveWorkspaceId(initial);
    return initial;
  }

  const state = { ...base, ...raw, invites: raw.invites ?? seedInvites };
  state.notifications = (state.notifications ?? []).map((n) => ({
    ...n,
    userId: n.userId ?? 'u1',
  }));
  state.workspaces = (state.workspaces ?? []).map((w) => {
    const seed = seedWorkspaces.find((s) => s.id === w.id);
    const memberIds = seed
      ? [...new Set([...(w.memberIds ?? []), ...seed.memberIds])]
      : (w.memberIds ?? []);
    return {
      ...w,
      memberIds,
      type: w.type ?? seed?.type ?? 'team',
      icon: w.icon ?? seed?.icon ?? '🏢',
      name: w.name ?? seed?.name ?? 'Workspace',
    };
  });

  const existingWsIds = new Set(state.workspaces.map((w) => w.id));
  state.workspaces = [
    ...state.workspaces,
    ...seedWorkspaces.filter((w) => !existingWsIds.has(w.id)),
  ];

  const existingProjectIds = new Set(state.projects.map((p) => p.id));
  state.projects = [
    ...state.projects,
    ...seedProjects.filter((p) => !existingProjectIds.has(p.id)),
  ];

  const existingTaskIds = new Set(state.tasks.map((t) => t.id));
  state.tasks = [
    ...state.tasks,
    ...seedTasks.filter((t) => !existingTaskIds.has(t.id)),
  ];

  const existingInviteIds = new Set(state.invites.map((i) => i.id));
  state.invites = [
    ...state.invites,
    ...seedInvites.filter((i) => !existingInviteIds.has(i.id)),
  ];

  const existingNotifIds = new Set(state.notifications.map((n) => n.id));
  state.notifications = [
    ...state.notifications,
    ...seedNotifications.filter((n) => !existingNotifIds.has(n.id)),
  ];

  state.activeWorkspaceId = resolveActiveWorkspaceId(state);

  return state;
}

function resolveActiveWorkspaceId(state) {
  const myWorkspaces = state.workspaces.filter((w) =>
    w.memberIds.includes(state.currentUserId),
  );
  if (
    state.activeWorkspaceId &&
    myWorkspaces.some((w) => w.id === state.activeWorkspaceId)
  ) {
    return state.activeWorkspaceId;
  }
  return (
    myWorkspaces.find((w) => w.type === 'team')?.id ??
    myWorkspaces[0]?.id ??
    'ws-personal'
  );
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch {
    /* empty */
  }
  return normalizeState(null);
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = load();

export function getState() {
  return state;
}

export function resetState() {
  state = normalizeState(null);
  save(state);
  return state;
}

function commit(next) {
  state = next;
  save(state);
  return state;
}

export function getCurrentUser() {
  return state.users.find((u) => u.id === state.currentUserId) ?? state.users[0];
}

export function getUser(id) {
  return state.users.find((u) => u.id === id);
}

export function getWorkspace(id) {
  return state.workspaces.find((w) => w.id === id);
}

export function getProject(id) {
  return state.projects.find((p) => p.id === id);
}

export function getTask(id) {
  return state.tasks.find((t) => t.id === id);
}

export function getMyWorkspaces(userId = state.currentUserId) {
  return state.workspaces.filter((w) => w.memberIds.includes(userId));
}

export function getActiveWorkspace(userId = state.currentUserId) {
  const id = resolveActiveWorkspaceId({ ...state, currentUserId: userId });
  return getWorkspace(id);
}

export function setActiveWorkspace(workspaceId, userId = state.currentUserId) {
  const workspace = getWorkspace(workspaceId);
  if (!workspace?.memberIds.includes(userId)) return { error: 'Workspace not found.' };
  if (state.activeWorkspaceId === workspaceId) return { workspace, unchanged: true };
  commit({ ...state, activeWorkspaceId: workspaceId });
  return { workspace };
}

export function isWorkspaceMember(workspaceId, userId = state.currentUserId) {
  const workspace = getWorkspace(workspaceId);
  return workspace?.memberIds.includes(userId) ?? false;
}

export function getMyNotifications(userId = state.currentUserId) {
  return state.notifications.filter((n) => n.userId === userId);
}

export function getPendingInvitesForUser(userId = state.currentUserId) {
  const user = getUser(userId);
  if (!user) return [];
  const email = user.email.toLowerCase();
  return state.invites.filter(
    (inv) =>
      inv.status === 'pending' &&
      (inv.userId === userId || inv.email.toLowerCase() === email),
  );
}

export function getWorkspaceInvites(workspaceId) {
  return state.invites.filter(
    (inv) => inv.workspaceId === workspaceId && inv.status === 'pending',
  );
}

export function sendWorkspaceInvite(workspaceId, email) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { error: 'Enter an email address.' };

  const workspace = getWorkspace(workspaceId);
  if (!workspace) return { error: 'Workspace not found.' };
  if (workspace.type === 'personal') return { error: 'Cannot invite others to a personal workspace.' };

  const inviter = getCurrentUser();
  if (normalized === inviter.email.toLowerCase()) {
    return { error: 'You cannot invite yourself.' };
  }

  const targetUser = state.users.find((u) => u.email.toLowerCase() === normalized);

  if (targetUser && workspace.memberIds.includes(targetUser.id)) {
    return { error: 'This person is already a member.' };
  }

  const duplicate = state.invites.some(
    (inv) =>
      inv.workspaceId === workspaceId &&
      inv.email.toLowerCase() === normalized &&
      inv.status === 'pending',
  );
  if (duplicate) return { error: 'An invite is already pending for this email.' };

  const invite = {
    id: crypto.randomUUID(),
    workspaceId,
    email: normalized,
    userId: targetUser?.id ?? null,
    invitedBy: inviter.id,
    status: 'pending',
    createdAt: Date.now(),
  };

  const notifications = [...state.notifications];
  if (targetUser) {
    notifications.unshift({
      id: crypto.randomUUID(),
      type: 'workspace_invite',
      message: `${inviter.name} invited you to join "${workspace.name}"`,
      userId: targetUser.id,
      read: false,
      createdAt: Date.now(),
      inviteId: invite.id,
      workspaceId,
    });
  }

  commit({
    ...state,
    invites: [...state.invites, invite],
    notifications,
  });

  if (!targetUser) {
    return {
      invite,
      warning: 'No Workly account found for that email. The invite is saved for when they sign up.',
    };
  }
  return { invite };
}

export function acceptWorkspaceInvite(inviteId) {
  const invite = state.invites.find((i) => i.id === inviteId);
  if (!invite || invite.status !== 'pending') return { error: 'Invite not found or already handled.' };

  const user = getCurrentUser();
  const email = user.email.toLowerCase();
  const isRecipient =
    invite.userId === user.id ||
    (!invite.userId && invite.email.toLowerCase() === email);
  if (!isRecipient) return { error: 'This invite is not for you.' };

  const workspace = getWorkspace(invite.workspaceId);
  if (!workspace) return { error: 'Workspace no longer exists.' };

  const memberIds = workspace.memberIds.includes(user.id)
    ? workspace.memberIds
    : [...workspace.memberIds, user.id];

  commit({
    ...state,
    activeWorkspaceId: workspace.id,
    workspaces: state.workspaces.map((w) =>
      w.id === workspace.id ? { ...w, memberIds } : w,
    ),
    invites: state.invites.map((i) =>
      i.id === inviteId ? { ...i, status: 'accepted', userId: user.id } : i,
    ),
    notifications: [
      {
        id: crypto.randomUUID(),
        type: 'workspace_joined',
        message: `You joined "${workspace.name}"`,
        userId: user.id,
        read: false,
        createdAt: Date.now(),
        workspaceId: workspace.id,
      },
      ...state.notifications.map((n) =>
        n.inviteId === inviteId ? { ...n, read: true } : n,
      ),
    ],
  });

  return { workspace };
}

export function declineWorkspaceInvite(inviteId) {
  const invite = state.invites.find((i) => i.id === inviteId);
  if (!invite || invite.status !== 'pending') return { error: 'Invite not found or already handled.' };

  const user = getCurrentUser();
  const email = user.email.toLowerCase();
  const isRecipient =
    invite.userId === user.id ||
    (!invite.userId && invite.email.toLowerCase() === email);
  if (!isRecipient) return { error: 'This invite is not for you.' };

  commit({
    ...state,
    invites: state.invites.map((i) =>
      i.id === inviteId ? { ...i, status: 'declined', userId: user.id } : i,
    ),
    notifications: state.notifications.map((n) =>
      n.inviteId === inviteId ? { ...n, read: true } : n,
    ),
  });

  return { ok: true };
}

export function switchUser(userId) {
  if (!state.users.some((u) => u.id === userId)) return { error: 'User not found.' };
  commit({ ...state, currentUserId: userId });
  return { ok: true };
}

export function getProjectsByWorkspace(workspaceId) {
  return state.projects.filter((p) => p.workspaceId === workspaceId);
}

export function getTasksByProject(projectId) {
  return state.tasks.filter((t) => t.projectId === projectId);
}

export function getTasksByWorkspace(workspaceId) {
  return state.tasks.filter((t) => t.workspaceId === workspaceId);
}

export function getMyTasks(userId = state.currentUserId) {
  return state.tasks.filter((t) => t.assigneeId === userId && t.status !== 'done');
}

export function projectProgress(projectId) {
  const tasks = getTasksByProject(projectId);
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

export function addTask(input) {
  const task = {
    id: crypto.randomUUID(),
    workspaceId: input.workspaceId,
    projectId: input.projectId,
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
    status: input.status ?? 'todo',
    priority: input.priority ?? 'medium',
    assigneeId: input.assigneeId ?? state.currentUserId,
    dueDate: input.dueDate ?? '',
    startDate: input.startDate ?? '',
    labels: input.labels ?? [],
    subtasks: [],
    comments: [],
    createdAt: Date.now(),
  };
  commit({ ...state, tasks: [task, ...state.tasks] });
  addActivity('created', task.title);
  return task;
}

export function updateTask(id, patch) {
  const task = getTask(id);
  if (!task) return;

  const next = { ...patch };
  if (patch.status === 'done' && task.status !== 'done') {
    next.completedAt = Date.now();
  } else if (patch.status && patch.status !== 'done' && task.status === 'done') {
    next.completedAt = null;
  }

  commit({
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...next } : t)),
  });
}

export function deleteTask(id) {
  commit({ ...state, tasks: state.tasks.filter((t) => t.id !== id) });
}

export function addSubtask(taskId, title) {
  const task = getTask(taskId);
  if (!task || !title.trim()) return;
  const subtask = { id: crypto.randomUUID(), title: title.trim(), done: false };
  updateTask(taskId, { subtasks: [...task.subtasks, subtask] });
  return subtask;
}

export function removeSubtask(taskId, subtaskId) {
  const task = getTask(taskId);
  if (!task) return;
  updateTask(taskId, {
    subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
  });
}

export function toggleSubtask(taskId, subtaskId) {
  const task = getTask(taskId);
  if (!task) return;
  updateTask(taskId, {
    subtasks: task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, done: !s.done } : s,
    ),
  });
}

export function addComment(taskId, text) {
  const task = getTask(taskId);
  if (!task || !text.trim()) return;
  const comment = {
    id: crypto.randomUUID(),
    userId: state.currentUserId,
    text: text.trim(),
    createdAt: Date.now(),
  };
  updateTask(taskId, { comments: [...task.comments, comment] });
  addActivity('commented on', task.title);
}

export function addProject(input) {
  const project = {
    id: crypto.randomUUID(),
    workspaceId: input.workspaceId,
    name: input.name.trim(),
    description: input.description?.trim() ?? '',
    managerId: input.managerId ?? state.currentUserId,
    dueDate: input.dueDate ?? '',
    progress: 0,
  };
  commit({ ...state, projects: [project, ...state.projects] });
  return project;
}

export function addWorkspace(input) {
  const type = input.type ?? 'team';
  const workspace = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    type,
    icon: input.icon ?? (type === 'personal' ? '👤' : '🏢'),
    memberIds: [state.currentUserId],
  };
  commit({
    ...state,
    workspaces: [...state.workspaces, workspace],
    activeWorkspaceId: workspace.id,
  });
  return workspace;
}

export function markNotificationRead(id) {
  commit({
    ...state,
    notifications: state.notifications.map((n) =>
      n.id === id && n.userId === state.currentUserId ? { ...n, read: true } : n,
    ),
  });
}

export function markAllNotificationsRead() {
  commit({
    ...state,
    notifications: state.notifications.map((n) =>
      n.userId === state.currentUserId ? { ...n, read: true } : n,
    ),
  });
}

export function addActivity(action, target) {
  const entry = {
    id: crypto.randomUUID(),
    userId: state.currentUserId,
    action,
    target,
    createdAt: Date.now(),
  };
  commit({ ...state, activity: [entry, ...state.activity].slice(0, 50) });
}

export function updateProfile(patch) {
  commit({
    ...state,
    users: state.users.map((u) =>
      u.id === state.currentUserId ? { ...u, ...patch } : u,
    ),
  });
}

export function clearAllData() {
  return resetState();
}

export function searchAll(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return { tasks: [], projects: [], workspaces: [], people: [] };
  const myWorkspaceIds = new Set(getMyWorkspaces().map((w) => w.id));
  return {
    tasks: state.tasks.filter((t) => t.title.toLowerCase().includes(needle)),
    projects: state.projects.filter((p) => p.name.toLowerCase().includes(needle)),
    workspaces: state.workspaces.filter(
      (w) => myWorkspaceIds.has(w.id) && w.name.toLowerCase().includes(needle),
    ),
    people: state.users.filter((u) => u.name.toLowerCase().includes(needle)),
  };
}
