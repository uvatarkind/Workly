import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getMonthLabel, getCalendarGrid, getWeekdayLabels, todayStamp } from '../utils/dates';
import { IconChevronLeft, IconChevronRight } from '../components/Icons';

export default function CalendarPage() {
  const { openTask } = useOutletContext();
  const { state } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const grid = getCalendarGrid(year, month);
  const weekdays = getWeekdayLabels();
  const todayStr = todayStamp();

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function tasksForDay(day) {
    if (!day) return [];
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    return state.tasks.filter((t) => t.dueDate === dateStr);
  }

  return (
    <div className="page calendar-page">
      <header className="page-header split">
        <div>
          <h1>Calendar</h1>
          <p>What tasks are happening when?</p>
        </div>
        <div className="calendar-nav">
          <button type="button" className="icon-btn" onClick={prevMonth} aria-label="Previous month">
            <IconChevronLeft />
          </button>
          <strong>{getMonthLabel(year, month)}</strong>
          <button type="button" className="icon-btn" onClick={nextMonth} aria-label="Next month">
            <IconChevronRight />
          </button>
        </div>
      </header>

      <section className="panel calendar-panel">
        <div className="calendar-grid">
          {weekdays.map((day) => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
          {grid.map((day, i) => {
            const tasks = tasksForDay(day);
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
                  {tasks.slice(0, 3).map((task) => (
                    <li key={task.id}>
                      <button type="button" onClick={() => openTask(task.id)}>
                        {task.title}
                      </button>
                    </li>
                  ))}
                  {tasks.length > 3 && (
                    <li className="calendar-more">+{tasks.length - 3} more</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
