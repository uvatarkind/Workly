function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function inRange(timestamp, start, end) {
  return timestamp >= start && timestamp < end;
}

function taskCompletedAt(task) {
  if (task.status !== 'done') return null;
  return task.completedAt ?? task.createdAt;
}

export function sparklineValues(tasks, kind, days = 7) {
  const origin = startOfDay(new Date());
  return Array.from({ length: days }, (_, index) => {
    const start = origin.getTime() - (days - 1 - index) * 86400000;
    const end = start + 86400000;
    return tasks.filter((task) => {
      const at =
        kind === 'completed'
          ? taskCompletedAt(task)
          : task.createdAt;
      return at && inRange(at, start, end);
    }).length;
  });
}

export function weekDelta(tasks, kind) {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const valueOf = (task) => {
    if (kind === 'completed') return taskCompletedAt(task);
    if (kind === 'projects') return task.createdAt;
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

export function deltaLabel(delta) {
  if (delta > 0) return `${delta}+ more from last week`;
  if (delta < 0) return `${Math.abs(delta)} fewer than last week`;
  return 'Same as last week';
}

export function deltaDisplay(delta) {
  if (delta > 0) {
    return { value: `${delta}+`, suffix: 'more', sub: 'from last week', tone: 'up' };
  }
  if (delta < 0) {
    return { value: `${delta}`, suffix: 'fewer', sub: 'than last week', tone: 'down' };
  }
  return { value: '0', suffix: 'change', sub: 'from last week', tone: 'neutral' };
}

export function activitySeries(tasks, range) {
  const origin = startOfDay(new Date());
  const buckets =
    range === 'monthly'
      ? Array.from({ length: 12 }, (_, index) => {
          const date = new Date(origin.getFullYear(), origin.getMonth() - (11 - index), 1);
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
    labels: buckets.map((b) => b.label),
    created: buckets.map(
      (b) => tasks.filter((t) => inRange(t.createdAt, b.start, b.end)).length,
    ),
    completed: buckets.map((b) =>
      tasks.filter((t) => {
        const at = taskCompletedAt(t);
        return at && inRange(at, b.start, b.end);
      }).length,
    ),
  };
}

export function taskProgress(task) {
  if (task.subtasks?.length) {
    const done = task.subtasks.filter((s) => s.done).length;
    return Math.round((done / task.subtasks.length) * 100);
  }
  if (task.status === 'done') return 100;
  if (task.status === 'in_review') return 85;
  if (task.status === 'in_progress') return 50;
  return 12;
}
