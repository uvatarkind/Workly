import { loadTeam } from '../profile';
import TaskForm from './TaskForm';
import KanbanBoard from './KanbanBoard';

const TaskBoard = ({ tasks, onAdd, onToggle, onDelete, onMove, emptyMessage }) => {
  const team = loadTeam().slice(0, 4);

  return (
    <div className="task-board">
      <header className="task-board-head">
        <div>
          <h1>Task</h1>
          <p>Move cards across Backlog, To Do, In Progress, and Review.</p>
        </div>
        <div className="task-board-members" aria-label="Team">
          {team.map((member) => (
            <span
              key={member.id}
              className="member-avatar"
              style={{ background: `${member.color}22`, color: member.color }}
              title={member.name}
            >
              {member.initials}
            </span>
          ))}
          {team.length < 6 && <span className="member-avatar muted">+</span>}
        </div>
      </header>

      <section className="panel task-board-form">
        <TaskForm onAdd={onAdd} idPrefix="board" compact />
      </section>

      <KanbanBoard
        tasks={tasks}
        onToggle={onToggle}
        onDelete={onDelete}
        onMove={onMove}
        emptyMessage={emptyMessage}
      />
    </div>
  );
};

export default TaskBoard;
