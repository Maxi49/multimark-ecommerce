const STORAGE_KEY = 'recentViewedMotos';
const MAX_RECENT = 5;

const isBrowser = () => typeof window !== 'undefined';

export const getRecentViewedIds = (): string[] => {
  if (!isBrowser()) return [];

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((value) => typeof value === 'string').slice(0, MAX_RECENT);
    }
  } catch {
    return [];
  }

  return [];
};

export const addRecentViewedId = (id: string) => {
  if (!isBrowser()) return;

  const current = getRecentViewedIds();
  if (current.includes(id)) return;
  if (current.length >= MAX_RECENT) return;

  const next = [...current, id];

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('recentViewedUpdated'));
  } catch {
    return;
  }
};
