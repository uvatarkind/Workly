const STORAGE_KEY = 'workly.theme';

export function getTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* empty */
  }
  return 'dark';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
}

export function setTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
  window.dispatchEvent(new CustomEvent('workly:theme', { detail: next }));
  return next;
}

export function initTheme() {
  applyTheme(getTheme());
}

export function subscribeTheme(callback) {
  function onChange(e) {
    callback(e.detail);
  }
  window.addEventListener('workly:theme', onChange);
  return () => window.removeEventListener('workly:theme', onChange);
}
