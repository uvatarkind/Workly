export const FILES_KEY = 'workly.files';

const folderColors = ['blue', 'purple', 'yellow', 'green', 'red', 'orange'];

export const defaultFiles = {
  folders: [
    { id: 'f1', name: 'Documents', count: 128, color: 'blue', memberIds: ['u1', 'u2'] },
    { id: 'f2', name: 'Work Project', count: 74, color: 'purple', memberIds: ['u1', 'u3'] },
    { id: 'f3', name: 'Personal', count: 42, color: 'yellow', memberIds: ['u1'] },
    { id: 'f4', name: 'Design Assets', count: 96, color: 'green', memberIds: ['u2', 'u4'] },
    { id: 'f5', name: 'Archive', count: 31, color: 'red', memberIds: ['u1'] },
    { id: 'f6', name: 'Shared', count: 18, color: 'orange', memberIds: ['u1', 'u2', 'u3'] },
  ],
  recent: [
    { id: 'r1', name: 'Proposal.docx', type: 'doc', size: '2.9 MB', modified: 'Aug 20, 2026', memberIds: ['u1', 'u2'] },
    { id: 'r2', name: 'Background.jpg', type: 'image', size: '1.1 MB', modified: 'Aug 18, 2026', memberIds: ['u2'] },
    { id: 'r3', name: 'Workly.fig', type: 'design', size: '8.6 MB', modified: 'Aug 15, 2026', memberIds: ['u1', 'u3'] },
    { id: 'r4', name: 'Sprint-notes.pdf', type: 'pdf', size: '540 KB', modified: 'Aug 12, 2026', memberIds: ['u1'] },
  ],
  storage: {
    usedGb: 2.1,
    totalGb: 15,
    breakdown: [
      { id: 'media', label: 'Media', value: 45, color: '#004aad' },
      { id: 'docs', label: 'Documents', value: 28, color: '#38b6ff' },
      { id: 'music', label: 'Music', value: 12, color: '#ffa726' },
      { id: 'other', label: 'Other File', value: 15, color: '#00b884' },
    ],
  },
};

function normalizeFolder(folder, index) {
  const name = String(folder?.name ?? '').trim();
  if (!name) return null;
  return {
    id: String(folder?.id ?? crypto.randomUUID()),
    name,
    count: Number(folder?.count) || 0,
    color: folderColors.includes(folder?.color) ? folder.color : folderColors[index % folderColors.length],
    memberIds: Array.isArray(folder?.memberIds) ? folder.memberIds.map(String) : ['u1'],
  };
}

function normalizeRecent(file) {
  const name = String(file?.name ?? '').trim();
  if (!name) return null;
  return {
    id: String(file?.id ?? crypto.randomUUID()),
    name,
    type: String(file?.type ?? 'doc'),
    size: String(file?.size ?? '—'),
    modified: String(file?.modified ?? '—'),
    memberIds: Array.isArray(file?.memberIds) ? file.memberIds.map(String) : ['u1'],
  };
}

export function loadFiles() {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    if (!raw) return structuredClone(defaultFiles);
    const parsed = JSON.parse(raw);
    const folders = (parsed?.folders ?? defaultFiles.folders).map(normalizeFolder).filter(Boolean);
    const recent = (parsed?.recent ?? defaultFiles.recent).map(normalizeRecent).filter(Boolean);
    return {
      folders: folders.length ? folders : structuredClone(defaultFiles.folders),
      recent: recent.length ? recent : structuredClone(defaultFiles.recent),
      storage: parsed?.storage ?? structuredClone(defaultFiles.storage),
    };
  } catch {
    return structuredClone(defaultFiles);
  }
}

export function saveFiles(data) {
  localStorage.setItem(FILES_KEY, JSON.stringify(data));
}

export function addFolder(files, name) {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return files;
  const folder = normalizeFolder(
    {
      id: crypto.randomUUID(),
      name: trimmed,
      count: 0,
      color: folderColors[files.folders.length % folderColors.length],
      memberIds: ['u1'],
    },
    files.folders.length,
  );
  return { ...files, folders: [folder, ...files.folders] };
}

export function storagePercent(storage) {
  if (!storage?.totalGb) return 0;
  return Math.min(100, Math.round((storage.usedGb / storage.totalGb) * 100));
}
