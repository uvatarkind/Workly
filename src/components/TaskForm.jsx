import { useState } from 'react';
import { IconPlus } from './Icons';

const TaskForm = ({ onAdd, stacked = false, idPrefix = 'new', compact = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onAdd({ title, description, priority, dueDate });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  }

  return (
    <form className={stacked ? 'task-form stacked' : compact ? 'task-form compact' : 'task-form'} onSubmit={handleSubmit}>
      <label htmlFor={`${idPrefix}-task-title`} className="visually-hidden">
        New task
      </label>
      <input
        id={`${idPrefix}-task-title`}
        name="title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        autoComplete="off"
      />
      <label htmlFor={`${idPrefix}-task-desc`} className="visually-hidden">
        Description
      </label>
      <input
        id={`${idPrefix}-task-desc`}
        name="description"
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Short description"
        autoComplete="off"
      />
      <label htmlFor={`${idPrefix}-task-priority`} className="visually-hidden">
        Priority
      </label>
      <select
        id={`${idPrefix}-task-priority`}
        name="priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        aria-label="Priority"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <label htmlFor={`${idPrefix}-task-due`} className="visually-hidden">
        Due date
      </label>
      <input
        id={`${idPrefix}-task-due`}
        name="dueDate"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        aria-label="Due date"
      />
      <button type="submit">
        <IconPlus />
        New
      </button>
    </form>
  );
};

export default TaskForm;
