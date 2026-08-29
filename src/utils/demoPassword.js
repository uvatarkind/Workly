const PASSWORD_KEY = 'workly.demoPasswords';

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(PASSWORD_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getDemoPassword(userId) {
  return loadAll()[userId] ?? null;
}

export function setDemoPassword(userId, password) {
  const next = { ...loadAll(), [userId]: password };
  localStorage.setItem(PASSWORD_KEY, JSON.stringify(next));
}

export function clearDemoPassword(userId) {
  const next = { ...loadAll() };
  delete next[userId];
  localStorage.setItem(PASSWORD_KEY, JSON.stringify(next));
}
