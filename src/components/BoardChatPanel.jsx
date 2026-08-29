import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IconMore } from './Icons';

const boardChatSeed = [
  { id: 'bc1', userId: 'u2', text: 'Can you share the latest wireframes?', createdAt: Date.now() - 5400000 },
  { id: 'bc2', userId: 'u3', text: 'On it — uploading now.', createdAt: Date.now() - 4800000 },
  { id: 'bc3', userId: 'u1', text: 'Looks good. Can we adjust the hero section?', createdAt: Date.now() - 3600000 },
  { id: 'bc4', userId: 'u2', text: 'Sure, I\'ll update it today.', createdAt: Date.now() - 1800000, voice: true },
];

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function BoardChatPanel({ projectId }) {
  const { state, getUser, getProject } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(boardChatSeed);

  const project = getProject(projectId);
  const workspace = state.workspaces.find((w) => w.id === project?.workspaceId);
  const memberIds = workspace?.memberIds ?? state.users.map((u) => u.id);
  const members = memberIds.map((id) => getUser(id)).filter(Boolean);

  function handleSend(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        userId: state.currentUserId ?? 'u1',
        text: message.trim(),
        createdAt: Date.now(),
      },
    ]);
    setMessage('');
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
        <button type="button" className="icon-btn" aria-label="More"><IconMore /></button>
      </form>
    </aside>
  );
}
