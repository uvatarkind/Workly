import { BOARD_COLUMNS, columnForTask } from '../utils/board';
import { useApp } from '../context/AppContext';
import { openCreate } from '../utils/routes';
import BoardKanbanCard from './BoardKanbanCard';
import { IconPlus } from './Icons';

export default function TaskBoardView({ project, workspace, tasks, onOpenTask }) {
  const { getUser, updateTask } = useApp();

  const ws = workspace ?? null;
  const memberIds = ws?.memberIds ?? [];
  const members = memberIds.map((id) => getUser(id)).filter(Boolean);

  function handleAddTask() {
    openCreate({
      mode: 'task',
      workspaceId: ws?.id ?? project.workspaceId,
      projectId: project.id,
    });
  }

  function handleMove(taskId, columnId) {
    const col = BOARD_COLUMNS.find((c) => c.id === columnId);
    const task = tasks.find((t) => t.id === taskId);
    if (!col || !task) return;
    updateTask(taskId, col.toStatus(task));
  }

  return (
    <div className="task-board-layout">
      <div className="task-board-main">
        <header className="task-board-head">
          <div className="task-board-head-text">
            <h2>{project.name}</h2>
            <p>{tasks.length} task{tasks.length !== 1 ? 's' : ''} in this project</p>
          </div>
          <div className="task-board-members">
            {members.slice(0, 4).map((member) => (
              <span key={member.id} className="member-avatar" title={member.name}>
                {member.initials}
              </span>
            ))}
            {members.length > 4 && (
              <span className="member-avatar muted">+{members.length - 4}</span>
            )}
            <button
              type="button"
              className="member-add-btn"
              aria-label="Add task"
              onClick={handleAddTask}
            >
              <IconPlus />
            </button>
          </div>
        </header>

        <div className="kanban-board mockup-board">
          {BOARD_COLUMNS.map((col) => {
            const colTasks = tasks.filter(col.match);
            return (
              <div key={col.id} className="kanban-column">
                <div className="kanban-column-head">
                  <h2>{col.label}</h2>
                  <div className="kanban-column-actions">
                    <button type="button" className="icon-btn" aria-label="Column options">⋯</button>
                    <button
                      type="button"
                      className="kanban-add-btn"
                      aria-label={`Add to ${col.label}`}
                      onClick={handleAddTask}
                    >
                      <IconPlus />
                    </button>
                  </div>
                </div>
                <ul className="kanban-list">
                  {colTasks.map((task) => (
                    <li key={task.id}>
                      <BoardKanbanCard
                        task={task}
                        assignee={getUser(task.assigneeId)}
                        onOpen={onOpenTask}
                        onMove={handleMove}
                        columns={BOARD_COLUMNS}
                        currentColumn={columnForTask(task)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
