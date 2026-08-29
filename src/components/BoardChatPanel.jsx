import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { loadBoardChat, saveBoardChat, boardChatSeed } from '../utils/boardChat';
import { IconMore } from './Icons';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function BoardChatPanel({ projectId }) {
  const { state, getUser, getProject, currentUser } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => loadBoardChat(projectId));

  const project = getProject(projectId);
  const workspace = state.workspaces.find((w) => w.id === project?.workspaceId);
  const memberIds = workspace?.memberIds ?? state.users.map((u) => u.id);
  const members = memberIds.map((id) => getUser(id)).filter(Boolean);

  function updateMessages(next) {
    setMessages(next);
    saveBoardChat(projectId, next);
  }

  function handleSend(e) {
    e.preventDefault();
    if (!message.trim()) return;
    updateMessages([
      ...messages,
      {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        text: message.trim(),
        createdAt: Date.now(),
      },
    ]);
    setMessage('');
  }

  function handleReset() {
    updateMessages([...boardChatSeed]);
  }

  return (
    <aside className="board-chat panel">
      <div className="board-chat-members">
        <div className="board-chat-members-head">
          <h2>Member ({members.length})</h2>
          <button type="button" className="link-btn">View All</button>
        </div>
        <ul className="board-member-row">
          {members.slice(0, 7).map((member, i) => (
            <li key={member.id}>
              <span className={`member-avatar small${i < 3 ? ' online' : ''}`}>{member.initials}</span>
            </li>
          ))}
          {members.length > 7 && (
            <li><span className="member-avatar small muted">+{members.length - 7}</span></li>
          )}
        </ul>
      </div>

      <div className="board-chat-feed">
        <h2>Group Chat</h2>
        <ul className="board-chat-list">
          {messages.map((msg) => {
            const user = getUser(msg.userId);
            return (
              <li key={msg.id} className="board-chat-msg">
                <span className="member-avatar tiny">{user?.initials}</span>
                <div>
                  <div className="board-chat-msg-head">
                    <strong>{user?.name.split(' ')[0]}</strong>
                    <time>{formatTime(msg.createdAt)}</time>
                  </div>
                  {msg.voice ? (
                    <div className="voice-note">
                      <span className="voice-wave" aria-hidden="true" />
                      <span>1:25</span>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <form className="board-chat-input" onSubmit={handleSend}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="write here…"
        />
        <button type="button" className="icon-btn" aria-label="Voice message">🎤</button>
        <button type="button" className="icon-btn" aria-label="Reset chat" onClick={handleReset}>
          <IconMore />
        </button>
      </form>
    </aside>
  );
}
