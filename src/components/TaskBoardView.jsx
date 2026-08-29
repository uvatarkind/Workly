import { BOARD_COLUMNS, columnForTask } from '../utils/board';
import { useApp } from '../context/AppContext';
import BoardKanbanCard from './BoardKanbanCard';
import BoardChatPanel from './BoardChatPanel';
import { IconPlus } from './Icons';

export default function TaskBoardView({ project, tasks, onOpenTask }) {
  const { getUser, updateTask, state } = useApp();

  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const workspace = state.workspaces.find((w) => w.id === project.workspaceId);
  const memberIds = workspace?.memberIds ?? [];
  const members = memberIds.map((id) => getUser(id)).filter(Boolean);

  function handleMove(taskId, columnId) {
    const col = BOARD_COLUMNS.find((c) => c.id === columnId);
    if (!col) return;
    updateTask(taskId, col.toStatus());
  }

  return (
    <div className="task-board-layout">
      <div className="task-board-main">
        <header className="task-board-head">
          <div>
            <h1>🔥 Task</h1>
            <p>Move cards across Backlog, To Do, In Progress, and Review.</p>
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
              aria-label="Add member"
              onClick={() => window.dispatchEvent(new CustomEvent('workly:create'))}
            >
              <IconPlus />
            </button>
          </div>
        </header>

        <div className="kanban-board mockup-board">
          {BOARD_COLUMNS.map((col) => {
            const colTasks = activeTasks.filter(col.match);
            return (
              <div key={col.id} className="kanban-column">
                <div className="kanban-column-head">
                  <h2>{col.label}</h2>
                  <div className="kanban-column-actions">
                    <button type="button" className="icon-btn" aria-label={`Add to ${col.label}`}>
                      <IconPlus />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Column options">⋯</button>
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

      <BoardChatPanel key={project.id} projectId={project.id} />
    </div>
  );
}
