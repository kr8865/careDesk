import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import AuthCard from '../components/AuthCard.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError(null);
    try { await register(form.name, form.email, form.password); } catch (err) { setError(err); } finally { setBusy(false); }
  };

  return (
    <AuthCard title="Create account" subtitle="It takes less than a minute." footer={{ text: 'Already registered?', link: 'Log in', to: '/login' }}>
      <form onSubmit={submit} className="stack">
        <ErrorBox error={error} />
        <label>Name<input id="reg-name" required value={form.name} onChange={set('name')} /></label>
        <label>Email<input id="reg-email" type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Password<input id="reg-password" type="password" required minLength={8} value={form.password} onChange={set('password')} />
          <span className="hint">At least 8 characters, with a letter and a number.</span></label>
        <button disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      </form>
    </AuthCard>
  );
}
