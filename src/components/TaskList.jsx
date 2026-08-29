import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onDelete, emptyMessage }) => {
  if (tasks.length === 0) {
    if (!emptyMessage) return null;
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TaskList;
