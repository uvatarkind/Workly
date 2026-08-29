const CHAT_KEY = 'workly.boardChat';

export const boardChatSeed = [
  { id: 'bc1', userId: 'u2', text: 'Can you share the latest wireframes?', createdAt: Date.now() - 5400000 },
  { id: 'bc2', userId: 'u3', text: 'On it — uploading now.', createdAt: Date.now() - 4800000 },
  { id: 'bc3', userId: 'u1', text: 'Looks good. Can we adjust the hero section?', createdAt: Date.now() - 3600000 },
  { id: 'bc4', userId: 'u2', text: "Sure, I'll update it today.", createdAt: Date.now() - 1800000, voice: true },
];

function normalizeMessage(msg) {
  if (!msg?.id || !msg.userId) return null;
  return {
    id: String(msg.id),
    userId: String(msg.userId),
    text: String(msg.text ?? ''),
    createdAt: Number(msg.createdAt) || Date.now(),
    voice: Boolean(msg.voice),
  };
}

export function loadBoardChat(projectId) {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [...boardChatSeed];
    const parsed = JSON.parse(raw);
    const messages = parsed?.[projectId];
    if (!Array.isArray(messages) || !messages.length) return [...boardChatSeed];
    return messages.map(normalizeMessage).filter(Boolean);
  } catch {
    return [...boardChatSeed];
  }
}

export function saveBoardChat(projectId, messages) {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[projectId] = messages;
    localStorage.setItem(CHAT_KEY, JSON.stringify(parsed));
  } catch {
    /* ignore */
  }
}
