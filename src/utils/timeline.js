import { todayStamp } from './dates';

const categoryIcons = {
  Design: '🎨',
  Research: '🔍',
  Planning: '📋',
  Development: '✏️',
  Marketing: '📣',
  Mobile: '📱',
};

const categoryLabels = {
  Design: 'Design Phase',
  Research: 'UX Research',
  Planning: 'Information Architecture',
  Development: 'Development',
  Marketing: 'Marketing',
  Mobile: 'Mobile',
};

const categoryTones = {
  Design: 'purple',
  Research: 'blue',
  Planning: 'orange',
  Development: 'green',
  Marketing: 'orange',
  Mobile: 'purple',
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

export function taskCategory(task) {
  return task.labels?.[0] || 'Design';
}

export function taskStartDate(task) {
  if (task.startDate) return task.startDate;
  if (task.createdAt) return todayStamp(new Date(task.createdAt));
  return todayStamp();
}

export function taskEndDate(task) {
  if (task.dueDate) return task.dueDate;
  return addDays(taskStartDate(task), 4 + (task.title.length % 5));
}

export function taskProgress(task) {
  if (task.status === 'done') return 100;
  if (task.subtasks?.length) {
    const done = task.subtasks.filter((s) => s.done).length;
    return Math.round((done / task.subtasks.length) * 100);
  }
  const byStatus = { todo: 20, in_progress: 55, in_review: 82 };
  return byStatus[task.status] ?? 40;
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
    day: 'numeric',
    year: 'numeric',
  });
}

export function buildTimelineGroups(tasks) {
  const grouped = new Map();

  tasks.filter((t) => t.status !== 'done').forEach((task) => {
    const key = taskCategory(task);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(task);
  });

  return [...grouped.entries()].map(([category, items]) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    category,
    label: categoryLabels[category] || category,
    icon: categoryIcons[category] || '📌',
    tone: categoryTones[category] || 'design',
    tasks: items.sort(
      (a, b) => parseStamp(taskStartDate(a)) - parseStamp(taskStartDate(b)),
    ),
    assigneeIds: [...new Set(items.map((t) => t.assigneeId))].slice(0, 3),
  }));
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
  const category = taskCategory(task);

  return {
    left: `${(offset / total) * 100}%`,
    width: `${Math.max((span / total) * 100, 8)}%`,
    progress: taskProgress(task),
    tone: categoryTones[category] || 'design',
    label: task.title,
  };
}

export function completionTrend(tasks) {
  const values = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(todayStamp(), index - 6);
    return tasks.filter((task) => {
      if (task.status !== 'done') return false;
      const completed = todayStamp(new Date(task.createdAt));
      return completed === day;
    }).length;
  });
  return values.some((v) => v > 0) ? values : [2, 4, 3, 6, 5, 7, 4];
}
