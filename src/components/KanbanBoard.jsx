import { BOARD_COLUMNS } from '../tasks';
import KanbanCard from './KanbanCard';

const KanbanBoard = ({ tasks, onToggle, onDelete, onMove, emptyMessage }) => {
  const hasAnyTasks = tasks.length > 0;

  return (
    <>
      {!hasAnyTasks && emptyMessage && (
        <p className="empty-state kanban-empty-hint">{emptyMessage}</p>
      )}
      <div className="kanban-board">
        {BOARD_COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.stage === column.id);
          return (
            <section key={column.id} className="kanban-column">
              <header className="kanban-column-head">
                <h2>{column.label}</h2>
                <span className="kanban-count">{columnTasks.length}</span>
              </header>
              <ul className="kanban-list">
                {columnTasks.map((task) => (
                  <li key={task.id}>
                    <KanbanCard
                      task={task}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onMove={onMove}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default KanbanBoard;
