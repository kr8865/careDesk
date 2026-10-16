import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ErrorBox from './ErrorBox.jsx';
import { shortId } from '../utils.js';

// Generic list + create/edit form for a REST resource (used by Patients and Doctors)
export default function ResourcePage({ title, intro, endpoint, listKey, itemKey, fields, columns, canEdit = () => true }) {
  const empty = Object.fromEntries(fields.map((f) => [f.name, f.default ?? '']));
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = () => api(`${endpoint}/`).then((d) => setItems(d[listKey])).catch(setError).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(''), 2500); };
  const reset = () => { setForm(empty); setEditingId(null); setError(null); };

  const submit = async (e) => {
    e.preventDefault(); setError(null);
    const body = Object.fromEntries(fields.map((f) => [f.name, f.type === 'number' && form[f.name] !== '' ? Number(form[f.name]) : form[f.name]]));
    try {
      if (editingId) await api(`${endpoint}/${editingId}/`, { method: 'PUT', body });
      else await api(`${endpoint}/`, { method: 'POST', body });
      flash(editingId ? 'Changes saved' : `${itemKey} added`);
      reset(); load();
    } catch (err) { setError(err); }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm(Object.fromEntries(fields.map((f) => [f.name, item[f.name] ?? ''])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (item) => {
    // The confirm step lives in the UI: a second click within 3s deletes
    if (item.id !== pendingDelete) { setPendingDelete(item.id); setTimeout(() => setPendingDelete(null), 3000); return; }
    try { await api(`${endpoint}/${item.id}/`, { method: 'DELETE' }); flash(`${itemKey} deleted`); load(); } catch (err) { setError(err); }
    setPendingDelete(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div><h1>{title}</h1><p className="muted">{intro}</p></div>
        {notice && <span className="toast">{notice}</span>}
      </div>

      <form className="panel form-grid" onSubmit={submit}>
        <h2>{editingId ? `Edit ${itemKey.toLowerCase()} #${shortId(editingId)}` : `Add ${itemKey.toLowerCase()}`}</h2>
        <ErrorBox error={error} />
        {fields.map((f) => (
          <label key={f.name} className={f.wide ? 'wide' : ''}>
            {f.label}{f.required && ' *'}
            {f.type === 'select' ? (
              <select id={`${itemKey}-${f.name}`} required={f.required} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                <option value="">Select…</option>
                {f.options.map((o) => <option key={o} value={o}>{o[0].toUpperCase() + o.slice(1)}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea id={`${itemKey}-${f.name}`} rows={2} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            ) : (
              <input id={`${itemKey}-${f.name}`} type={f.type || 'text'} required={f.required} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            )}
          </label>
        ))}
        <div className="actions wide">
          <button>{editingId ? 'Save changes' : `Add ${itemKey.toLowerCase()}`}</button>
          {editingId && <button type="button" className="ghost" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div className="panel">
        <h2>{items.length} {items.length === 1 ? itemKey.toLowerCase() : title.toLowerCase()}</h2>
        {loading ? <p className="muted">Loading…</p> : items.length === 0 ? <p className="muted">Nothing here yet. Add one above.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th /></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((c) => <td key={c.key}>{c.render ? c.render(item) : item[c.key] ?? '—'}</td>)}
                    <td className="row-actions">
                      {canEdit(item) ? (<>
                        <button className="ghost small" onClick={() => edit(item)}>Edit</button>
                        <button className={`small ${pendingDelete === item.id ? 'danger' : 'ghost'}`} onClick={() => remove(item)}>
                          {pendingDelete === item.id ? 'Confirm delete' : 'Delete'}
                        </button>
                      </>) : <span className="muted small">Added by another user</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
