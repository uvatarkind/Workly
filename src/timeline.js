import { getCategoryTone, todayStamp } from './tasks';

const categoryIcons = {
  Research: '🔍',
  Design: '🎨',
  Planning: '📋',
  Content: '✏️',
};

const categoryLabels = {
  Research: 'UX Research',
  Design: 'Design Phase',
  Planning: 'Information Architecture',
  Content: 'Development',
};

export function parseStamp(stamp) {
  const [year, month, day] = stamp.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(startStamp, endStamp) {
  const ms = parseStamp(endStamp) - parseStamp(startStamp);
  return Math.round(ms / 86400000);
}

export function addDays(stamp, days) {
  const date = parseStamp(stamp);
  date.setDate(date.getDate() + days);
  return todayStamp(date);
}

export function taskStartDate(task) {
  if (typeof task?.startDate === 'string' && task.startDate) return task.startDate;
  return todayStamp(new Date(task.createdAt));
}

export function taskEndDate(task) {
  if (task.dueDate) return task.dueDate;
  return addDays(taskStartDate(task), 4 + (task.title.length % 5));
}

export function taskProgress(task) {
  if (task.done) return 100;
  const byStage = { backlog: 12, todo: 34, in_progress: 58, review: 82 };
  return byStage[task.stage] ?? 40;
}

export function getMonthDays(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1);
    const stamp = todayStamp(date);
    return {
      stamp,
      weekday: date.toLocaleDateString(undefined, { weekday: 'narrow' }),
      day: index + 1,
      isToday: stamp === todayStamp(),
    };
  });
}

export function formatMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

export function buildTimelineGroups(tasks) {
  const grouped = new Map();

  tasks.forEach((task) => {
    const key = task.category || 'Design';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(task);
  });

  if (grouped.size === 0) {
    return getDemoGroups();
  }

  return [...grouped.entries()].map(([category, items]) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    category,
    label: categoryLabels[category] || category,
    icon: categoryIcons[category] || '📌',
    tone: getCategoryTone(category),
    tasks: items.sort((a, b) => parseStamp(taskStartDate(a)) - parseStamp(taskStartDate(b))),
    assigneeIds: [...new Set(items.flatMap((task) => task.assigneeIds || ['self']))].slice(0, 3),
  }));
}

function getDemoGroups() {
  const today = todayStamp();
  const make = (title, category, offset, span, stage, done = false) => ({
    id: `demo-${title.toLowerCase().replace(/\s+/g, '-')}`,
    title,
    category,
    description: '',
    done,
    priority: 'medium',
    stage,
    dueDate: addDays(today, offset + span),
    assigneeIds: ['self'],
    createdAt: parseStamp(addDays(today, offset)).getTime(),
    startDate: addDays(today, offset),
  });

  return [
    {
      id: 'research',
      category: 'Research',
      label: 'UX Research',
      icon: '🔍',
      tone: 'research',
      assigneeIds: ['self'],
      tasks: [make('User interviews', 'Research', -2, 6, 'in_progress')],
    },
    {
      id: 'planning',
      category: 'Planning',
      label: 'Information Architecture',
      icon: '📋',
      tone: 'planning',
      assigneeIds: ['self'],
      tasks: [make('Site map', 'Planning', 0, 8, 'todo')],
    },
    {
      id: 'design',
      category: 'Design',
      label: 'Design Phase',
      icon: '🎨',
      tone: 'design',
      assigneeIds: ['self'],
      tasks: [
        make('Profile screens', 'Design', 1, 5, 'in_progress'),
        make('Login flow', 'Design', 3, 7, 'todo'),
        make('Menu navigation', 'Design', 5, 9, 'todo'),
      ],
    },
    {
      id: 'content',
      category: 'Content',
      label: 'Development',
      icon: '✏️',
      tone: 'content',
      assigneeIds: ['self'],
      tasks: [
        make('Homepage build', 'Content', 4, 10, 'todo'),
        make('Back-end API', 'Content', 6, 12, 'backlog'),
      ],
    },
  ];
}

export function barMetrics(task, days) {
  if (!days.length) return null;
  const rangeStart = days[0].stamp;
  const rangeEnd = days[days.length - 1].stamp;
  const start = taskStartDate(task);
  const end = taskEndDate(task);

  if (end < rangeStart || start > rangeEnd) return null;

  const total = days.length;
  const clampedStart = start < rangeStart ? rangeStart : start;
  const clampedEnd = end > rangeEnd ? rangeEnd : end;
  const offset = daysBetween(rangeStart, clampedStart);
  const span = daysBetween(clampedStart, clampedEnd) + 1;

  return {
    left: `${(offset / total) * 100}%`,
    width: `${(span / total) * 100}%`,
    progress: taskProgress(task),
    tone: getCategoryTone(task.category),
    label: task.title,
  };
}

export function completionTrend(tasks) {
  const values = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(todayStamp(), index - 6);
    return tasks.filter((task) => {
      if (!task.done) return false;
      const completed = todayStamp(new Date(task.completedAt || task.createdAt));
      return completed === day;
    }).length;
  });
  return values.some((value) => value > 0) ? values : [2, 4, 3, 6, 5, 7, 4];
}
