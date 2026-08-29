export const PROFILE_KEY = 'taskflow.profile';
export const TEAM_KEY = 'taskflow.team';

export const SETTINGS_TABS = [
  { id: 'details', label: 'My details' },
  { id: 'profile', label: 'Profile' },
  { id: 'password', label: 'Password' },
  { id: 'team', label: 'Team' },
  { id: 'plan', label: 'Plan' },
  { id: 'billing', label: 'Billing' },
  { id: 'email', label: 'Email' },
  { id: 'notifications', label: 'Notifications' },
];

const memberColors = ['#4c6fff', '#8b7cf6', '#00b884', '#ffa726', '#eb5757'];

export const defaultProfile = {
  firstName: 'You',
  lastName: '',
  email: '',
  role: 'Product designer',
  avatarInitials: 'Y',
};

export const defaultTeam = [
  { id: 'self', name: 'You', initials: 'Y', color: memberColors[0], isSelf: true },
];

function normalizeProfile(raw) {
  const firstName = String(raw?.firstName ?? defaultProfile.firstName).trim() || 'You';
  const lastName = String(raw?.lastName ?? '').trim();
  const email = String(raw?.email ?? '').trim();
  const role = String(raw?.role ?? defaultProfile.role).trim() || defaultProfile.role;
  const initials =
    String(raw?.avatarInitials ?? '').trim() ||
    `${firstName[0] ?? 'Y'}${lastName[0] ?? ''}`.toUpperCase().slice(0, 2);

  return { firstName, lastName, email, role, avatarInitials: initials };
}

function normalizeMember(member, index) {
  const name = String(member?.name ?? '').trim();
  if (!name) return null;
  const initials =
    String(member?.initials ?? '').trim() ||
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  return {
    id: String(member?.id ?? crypto.randomUUID()),
    name,
    initials,
    color: member?.color || memberColors[index % memberColors.length],
    isSelf: Boolean(member?.isSelf),
  };
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...defaultProfile };
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(profile) {
  const next = normalizeProfile(profile);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}

export function loadTeam() {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (!raw) return [...defaultTeam];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...defaultTeam];
    const members = parsed.map(normalizeMember).filter(Boolean);
    return members.length ? members : [...defaultTeam];
  } catch {
    return [...defaultTeam];
  }
}

export function saveTeam(team) {
  const next = team.map(normalizeMember).filter(Boolean);
  localStorage.setItem(TEAM_KEY, JSON.stringify(next.length ? next : defaultTeam));
  return next.length ? next : [...defaultTeam];
}

export function addTeamMember(team, name) {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return team;
  return [
    ...team,
    normalizeMember({ id: crypto.randomUUID(), name: trimmed }, team.length),
  ];
}

export function removeTeamMember(team, id) {
  return team.filter((member) => member.id !== id || member.isSelf);
}

export function syncSelfMember(team, profile) {
  return team.map((member) =>
    member.isSelf
      ? {
          ...member,
          name: `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}`.trim(),
          initials: profile.avatarInitials,
        }
      : member,
  );
}

export function getMemberById(team, id) {
  return team.find((member) => member.id === id);
}
