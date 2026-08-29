export const FILES_KEY = 'taskflow.files';

const folderColors = ['blue', 'purple', 'yellow', 'green', 'red', 'orange'];

export const defaultFiles = {
  folders: [
    { id: 'f1', name: 'Documents', count: 128, color: 'blue', memberIds: ['self'] },
    { id: 'f2', name: 'Work Project', count: 74, color: 'purple', memberIds: ['self'] },
    { id: 'f3', name: 'Personal', count: 42, color: 'yellow', memberIds: ['self'] },
    { id: 'f4', name: 'Design Assets', count: 96, color: 'green', memberIds: ['self'] },
    { id: 'f5', name: 'Archive', count: 31, color: 'red', memberIds: ['self'] },
    { id: 'f6', name: 'Shared', count: 18, color: 'orange', memberIds: ['self'] },
  ],
  recent: [
    {
      id: 'r1',
      name: 'Proposal.docx',
      type: 'doc',
      size: '2.4 MB',
      modified: 'Aug 20, 2026',
      memberIds: ['self'],
    },
    {
      id: 'r2',
      name: 'Background.jpg',
      type: 'image',
      size: '1.1 MB',
      modified: 'Aug 18, 2026',
      memberIds: ['self'],
    },
    {
      id: 'r3',
      name: 'TaskFlow.fig',
      type: 'design',
      size: '8.6 MB',
      modified: 'Aug 15, 2026',
      memberIds: ['self'],
    },
    {
      id: 'r4',
      name: 'Sprint-notes.pdf',
      type: 'pdf',
      size: '540 KB',
      modified: 'Aug 12, 2026',
      memberIds: ['self'],
    },
  ],
  storage: {
    usedGb: 2.1,
    totalGb: 15,
    breakdown: [
      { id: 'media', label: 'Media', value: 45, color: '#4c6fff' },
      { id: 'docs', label: 'Documents', value: 28, color: '#8b7cf6' },
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
    memberIds: Array.isArray(folder?.memberIds) ? folder.memberIds.map(String) : ['self'],
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
    memberIds: Array.isArray(file?.memberIds) ? file.memberIds.map(String) : ['self'],
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
      memberIds: ['self'],
    },
    files.folders.length,
  );
  return { ...files, folders: [folder, ...files.folders] };
}

export function storagePercent(storage) {
  if (!storage?.totalGb) return 0;
  return Math.min(100, Math.round((storage.usedGb / storage.totalGb) * 100));
}
