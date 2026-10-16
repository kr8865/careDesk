// Small fetch wrapper: adds the JWT, refreshes it once on 401, and throws readable errors
const BASE = import.meta.env.VITE_API_URL || '/api';

const getTokens = () => JSON.parse(localStorage.getItem('tokens') || 'null');
export const setTokens = (t) => (t ? localStorage.setItem('tokens', JSON.stringify(t)) : localStorage.removeItem('tokens'));

async function refreshAccess() {
  const tokens = getTokens();
  if (!tokens?.refresh) return false;
  const res = await fetch(`${BASE}/auth/refresh/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  setTokens({ ...tokens, access: data.tokens.access });
  return true;
}

export async function api(path, { method = 'GET', body, retry = true } = {}) {
  const tokens = getTokens();
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(tokens?.access && { Authorization: `Bearer ${tokens.access}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && retry && tokens?.refresh && (await refreshAccess())) {
    return api(path, { method, body, retry: false });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.errors = data.errors || [];
    if (res.status === 401) window.dispatchEvent(new Event('auth:logout'));
    throw err;
  }
  return data;
}
