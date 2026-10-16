import { createContext, useContext, useEffect, useState } from 'react';
import { api, setTokens } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('tokens')) { setLoading(false); return; }
    api('/auth/me/').then((d) => setUser(d.user)).catch(() => setTokens(null)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onLogout = () => { setTokens(null); setUser(null); };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const handleAuth = (data) => { setTokens(data.tokens); setUser(data.user); };
  const login = async (email, password) => handleAuth(await api('/auth/login/', { method: 'POST', body: { email, password } }));
  const register = async (name, email, password) => handleAuth(await api('/auth/register/', { method: 'POST', body: { name, email, password } }));
  const logout = () => { setTokens(null); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
