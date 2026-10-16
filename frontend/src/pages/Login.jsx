import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import AuthCard from '../components/AuthCard.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError(null);
    try { await login(form.email, form.password); } catch (err) { setError(err); } finally { setBusy(false); }
  };

  return (
    <AuthCard title="Log in" subtitle="Manage your patients and doctors." footer={{ text: 'New here?', link: 'Create an account', to: '/register' }}>
      <form onSubmit={submit} className="stack">
        <ErrorBox error={error} />
        <label>Email<input id="login-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input id="login-password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
    </AuthCard>
  );
}
