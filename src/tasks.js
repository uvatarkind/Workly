export const STORAGE_KEY = 'taskflow.tasks';
export const PRIORITIES = ['high', 'medium', 'low'];
export const STAGES = ['backlog', 'todo', 'in_progress', 'review'];

export const BOARD_COLUMNS = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
];

const categoryByPriority = {
  high: 'Planning',
  medium: 'Design',
  low: 'Research',
};

const categoryTone = {
  Design: 'design',
  Research: 'research',
  Planning: 'planning',
  Content: 'content',
};

export function todayStamp(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function normalizeTask(task) {
  const done = Boolean(task?.done);
  const priority = PRIORITIES.includes(task?.priority) ? task.priority : 'medium';
  const category =
    typeof task?.category === 'string' && task.category
      ? task.category
      : categoryByPriority[priority];
  let stage = STAGES.includes(task?.stage) ? task.stage : done ? 'review' : 'todo';

  return {
    id: String(task?.id ?? crypto.randomUUID()),
    title: String(task?.title ?? '').trim(),
    description: String(task?.description ?? '').trim(),
    done,
    priority,
    category,
    stage,
    dueDate: typeof task?.dueDate === 'string' ? task.dueDate : '',
    assigneeIds: Array.isArray(task?.assigneeIds) && task.assigneeIds.length
      ? task.assigneeIds.map(String)
      : ['self'],
    createdAt: Number(task?.createdAt) || Date.now(),
    completedAt: done ? Number(task?.completedAt) || Number(task?.createdAt) || Date.now() : null,
  };
}

export function createTask({ title, description = '', priority = 'medium', dueDate = '', stage = 'todo' }) {
  return normalizeTask({
    id: crypto.randomUUID(),
    title,
    description,
    done: false,
    priority,
    dueDate,
    stage,
    createdAt: Date.now(),
    completedAt: null,
  });
}

export function addTask(tasks, input) {
  const title = typeof input === 'string' ? input : input?.title;
  const trimmed = String(title ?? '').trim();
  if (!trimmed) return tasks;
  return [
    createTask({
      title: trimmed,
      description: typeof input === 'object' ? input.description : '',
      priority: typeof input === 'object' ? input.priority : 'medium',
      dueDate: typeof input === 'object' ? input.dueDate : '',
      stage: typeof input === 'object' ? input.stage : 'todo',
    }),
    ...tasks,
  ];
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => {
    if (task.id !== id) return task;
    const done = !task.done;
    return {
      ...task,
      done,
      stage: done ? 'review' : task.stage === 'review' ? 'todo' : task.stage,
      completedAt: done ? Date.now() : null,
    };
  });
}

export function moveTask(tasks, id, stage) {
  if (!STAGES.includes(stage)) return tasks;
  return tasks.map((task) => (task.id === id ? { ...task, stage } : task));
}

export function getCategoryTone(category) {
  return categoryTone[category] || 'design';
}

export function coverVariant(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i) * (i + 1)) % 4;
  return `cover-${hash}`;
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function filterCompleted(tasks) {
  return tasks.filter((task) => task.done);
}

export function isOverdue(task) {
  if (task.done || !task.dueDate) return false;
  return task.dueDate < todayStamp();
}

export function getVisibleTasks(tasks, { query = '', status = 'all', priority = 'all' } = {}) {
  const needle = query.trim().toLowerCase();
  return tasks.filter((task) => {
    if (needle && !task.title.toLowerCase().includes(needle)) return false;
    if (status === 'open' && task.done) return false;
    if (status === 'completed' && !task.done) return false;
    if (priority !== 'all' && task.priority !== priority) return false;
    return true;
  });
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTask).filter((task) => task.title);
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function dueToday(tasks) {
  const today = todayStamp();
  return tasks.filter((task) => !task.done && task.dueDate === today);
}

export function overdueCount(tasks) {
  return tasks.filter(isOverdue).length;
}

function inRange(timestamp, start, end) {
  return timestamp >= start && timestamp < end;
}

export function weekDelta(tasks, kind) {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const valueOf = (task) => {
    if (kind === 'completed') return task.done ? task.completedAt || task.createdAt : null;
    if (kind === 'created') return task.createdAt;
    return task.createdAt;
  };
  const thisWeek = tasks.filter((task) => {
    const at = valueOf(task);
    return at && inRange(at, now - week, now + 1);
  }).length;
  const lastWeek = tasks.filter((task) => {
    const at = valueOf(task);
    return at && inRange(at, now - week * 2, now - week);
  }).length;
  return thisWeek - lastWeek;
}

export function sparklineValues(tasks, kind, days = 7) {
  const origin = startOfDay(new Date());
  return Array.from({ length: days }, (_, index) => {
    const start = origin.getTime() - (days - 1 - index) * 86400000;
    const end = start + 86400000;
    return tasks.filter((task) => {
      const at =
        kind === 'completed'
          ? task.done
            ? task.completedAt || task.createdAt
            : null
          : task.createdAt;
      return at && inRange(at, start, end);
    }).length;
  });
}

export function activitySeries(tasks, range) {
  const origin = startOfDay(new Date());
  const buckets =
    range === 'monthly'
      ? Array.from({ length: 6 }, (_, index) => {
          const date = new Date(origin.getFullYear(), origin.getMonth() - (5 - index), 1);
          const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
          return {
            label: date.toLocaleDateString(undefined, { month: 'short' }),
            start: date.getTime(),
            end: end.getTime(),
          };
        })
      : range === 'weekly'
        ? Array.from({ length: 8 }, (_, index) => {
            const start = new Date(origin);
            start.setDate(origin.getDate() - (7 - index) * 7);
            const end = new Date(start);
            end.setDate(start.getDate() + 7);
            return {
              label: `W${index + 1}`,
              start: start.getTime(),
              end: end.getTime(),
            };
          })
        : Array.from({ length: 7 }, (_, index) => {
            const start = new Date(origin);
            start.setDate(origin.getDate() - (6 - index));
            const end = new Date(start);
            end.setDate(start.getDate() + 1);
            return {
              label: start.toLocaleDateString(undefined, { weekday: 'short' }),
              start: start.getTime(),
              end: end.getTime(),
            };
          });

  return {
    labels: buckets.map((bucket) => bucket.label),
    created: buckets.map(
      (bucket) =>
        tasks.filter((task) => inRange(task.createdAt, bucket.start, bucket.end)).length,
    ),
    completed: buckets.map(
      (bucket) =>
        tasks.filter((task) => {
          const at = task.done ? task.completedAt || task.createdAt : null;
          return at && inRange(at, bucket.start, bucket.end);
        }).length,
    ),
  };
}
