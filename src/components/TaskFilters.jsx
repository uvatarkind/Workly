const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const TaskFilters = ({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  hideStatus = false,
}) => {
  return (
    <div className="task-filters">
      {!hideStatus && (
        <fieldset>
          <legend className="visually-hidden">Filter by status</legend>
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className={status === option.value ? 'chip active' : 'chip'}
            >
              <input
                type="radio"
                name="status-filter"
                value={option.value}
                checked={status === option.value}
                onChange={() => onStatusChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      )}
      <label className="priority-filter">
        <span className="visually-hidden">Filter by priority</span>
        <select
          value={priority}
          aria-label="Filter by priority"
          onChange={(event) => onPriorityChange(event.target.value)}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default TaskFilters;
