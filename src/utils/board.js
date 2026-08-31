import { todayStamp } from './dates';

export const TAG_TONES = {
  Design: 'design',
  Research: 'research',
  Planning: 'planning',
  Content: 'content',
  Development: 'planning',
  Marketing: 'content',
  Mobile: 'design',
};

export function coverVariant(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i) * (i + 1)) % 4;
  return `cover-${hash}`;
}

export function taskTag(task) {
  return task.labels?.[0] || 'Design';
}

export function taskTagTone(task) {
  return TAG_TONES[taskTag(task)] || 'design';
}

export const BOARD_COLUMNS = [
  {
    id: 'backlog',
    label: 'Backlog',
    match: (t) => t.status === 'todo' && !t.dueDate,
    toStatus: () => ({ status: 'todo', dueDate: '' }),
  },
  {
    id: 'todo',
    label: 'To Do',
    match: (t) => t.status === 'todo' && Boolean(t.dueDate),
    toStatus: (task) => ({
      status: 'todo',
      dueDate: task?.dueDate || todayStamp(),
    }),
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    match: (t) => t.status === 'in_progress',
    toStatus: () => ({ status: 'in_progress' }),
  },
  {
    id: 'in_review',
    label: 'Review',
    match: (t) => t.status === 'in_review',
    toStatus: () => ({ status: 'in_review' }),
  },
  {
    id: 'done',
    label: 'Done',
    match: (t) => t.status === 'done',
    toStatus: () => ({ status: 'done' }),
  },
];

export function columnForTask(task) {
  if (task.status === 'done') return 'done';
  return BOARD_COLUMNS.find((col) => col.match(task))?.id ?? 'backlog';
}

export function subtaskProgress(task) {
  if (!task.subtasks?.length) return null;
  const done = task.subtasks.filter((s) => s.done).length;
  return `${done}/${task.subtasks.length}`;
}
