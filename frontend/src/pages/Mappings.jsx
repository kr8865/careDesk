import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ErrorBox from '../components/ErrorBox.jsx';
import { shortId } from '../utils.js';

export default function Mappings() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', notes: '' });
  const [filter, setFilter] = useState('');
  const [patientDoctors, setPatientDoctors] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [p, d, m] = await Promise.all([api('/patients/'), api('/doctors/'), api('/mappings/')]);
      setPatients(p.patients); setDoctors(d.doctors); setMappings(m.mappings);
    } catch (err) { setError(err); }
  };
  useEffect(() => { load(); }, []);

  // Uses GET /api/mappings/:patientId/ to show one patient's doctors
  useEffect(() => {
    if (!filter) { setPatientDoctors(null); return; }
    api(`/mappings/${filter}/`).then((d) => setPatientDoctors(d.doctors)).catch(setError);
  }, [filter, mappings]);

  const assign = async (e) => {
    e.preventDefault(); setError(null);
    try {
      await api('/mappings/', { method: 'POST', body: { patientId: form.patientId, doctorId: form.doctorId, notes: form.notes } });
      setForm({ patientId: '', doctorId: '', notes: '' }); load();
    } catch (err) { setError(err); }
  };

  const unassign = async (id) => {
    try { await api(`/mappings/${id}/`, { method: 'DELETE' }); load(); } catch (err) { setError(err); }
  };

  return (
    <div className="page">
      <div className="page-head"><div><h1>Assignments</h1><p className="muted">Assign doctors to your patients. A patient can have several doctors.</p></div></div>

      <form className="panel form-grid" onSubmit={assign}>
        <h2>Assign a doctor</h2>
        <ErrorBox error={error} />
        <label>Patient *
          <select id="map-patient" required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
            <option value="">Select patient…</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name} (#{shortId(p.id)})</option>)}
          </select>
        </label>
        <label>Doctor *
          <select id="map-doctor" required value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
            <option value="">Select doctor…</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.specialization}</option>)}
          </select>
        </label>
        <label className="wide">Notes<input id="map-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Monthly follow-up" /></label>
        <div className="actions wide"><button disabled={!patients.length || !doctors.length}>Assign doctor</button>
          {(!patients.length || !doctors.length) && <span className="muted small">Add at least one patient and one doctor first.</span>}</div>
      </form>

      <div className="panel">
        <div className="panel-head">
          <h2>{filter ? 'Doctors for this patient' : `All assignments (${mappings.length})`}</h2>
          <select id="map-filter" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by patient">
            <option value="">All patients</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {filter ? (
          patientDoctors?.length ? (
            <ul className="chips">{patientDoctors.map((d) => <li key={d.id}><strong>{d.name}</strong> <span className="muted">{d.specialization}</span></li>)}</ul>
          ) : <p className="muted">No doctors assigned yet.</p>
        ) : mappings.length === 0 ? <p className="muted">No assignments yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Doctor</th><th>Specialization</th><th>Notes</th><th>Assigned</th><th /></tr></thead>
              <tbody>
                {mappings.map((m) => (
                  <tr key={m.id}>
                    <td>{m.patientId.name}</td><td>{m.doctorId.name}</td><td>{m.doctorId.specialization}</td>
                    <td>{m.notes || '—'}</td><td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="row-actions"><button className="ghost small" onClick={() => unassign(m.id)}>Remove</button></td>
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
