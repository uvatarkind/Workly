import { useState } from 'react';
import { getMonthLabel, getCalendarGrid, getWeekdayLabels, todayStamp } from '../utils/dates';
import { IconChevronLeft, IconChevronRight } from './Icons';

export default function ProjectCalendar({ tasks, onOpenTask }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const grid = getCalendarGrid(year, month);
  const weekdays = getWeekdayLabels();
  const todayStr = todayStamp();

  function tasksForDay(day) {
    if (!day) return [];
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    return tasks.filter((t) => t.dueDate === dateStr);
  }

  return (
    <section className="panel calendar-panel">
      <div className="calendar-nav inline">
        <button type="button" className="icon-btn" onClick={() => {
          if (month === 0) { setMonth(11); setYear((y) => y - 1); }
          else setMonth((m) => m - 1);
        }}>
          <IconChevronLeft />
        </button>
        <strong>{getMonthLabel(year, month)}</strong>
        <button type="button" className="icon-btn" onClick={() => {
          if (month === 11) { setMonth(0); setYear((y) => y + 1); }
          else setMonth((m) => m + 1);
        }}>
          <IconChevronRight />
        </button>
      </div>
      <div className="calendar-grid">
        {weekdays.map((day) => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {grid.map((day, i) => {
          const dayTasks = tasksForDay(day);
          const m = String(month + 1).padStart(2, '0');
          const d = day ? String(day).padStart(2, '0') : '';
          const dateStr = day ? `${year}-${m}-${d}` : '';
          const isToday = dateStr === todayStr;
          return (
            <div
              key={i}
              className={`calendar-cell${day ? '' : ' empty'}${isToday ? ' today' : ''}`}
            >
              {day && <span className="calendar-day-num">{day}</span>}
              <ul className="calendar-tasks">
                {dayTasks.map((task) => (
                  <li key={task.id}>
                    <button type="button" onClick={() => onOpenTask(task.id)}>
                      {task.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
