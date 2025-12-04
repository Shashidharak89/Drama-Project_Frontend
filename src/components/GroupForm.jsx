// src/components/GroupForm.jsx
import React, { useState } from 'react';
import './styles/InsertForms.css';

export default function GroupForm() {
  const [name, setName] = useState('');
  const [playsText, setPlaysText] = useState(''); // comma separated play IDs
  const [awardsText, setAwardsText] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const parse = txt => txt.split(',').map(s => s.trim()).filter(Boolean);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const body = { name, plays: parse(playsText), awards: parse(awardsText) };

    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }

      if (!res.ok) {
        const msg = (data && data.error) ? data.error : (typeof data === 'string' ? data : res.statusText);
        throw new Error(msg || `Request failed with status ${res.status}`);
      }

      setStatus({ ok: true, msg: 'Group inserted', data });
      setName('');
      setPlaysText('');
      setAwardsText('');
    } catch (err) {
      setStatus({ ok: false, msg: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="tf-form" onSubmit={handleSubmit}>
      <h3 className="tf-form-title">Insert Theatre Group</h3>

      <label className="tf-label">Name</label>
      <input
        className="tf-input"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="Group name"
      />

      <label className="tf-label">Plays (IDs, comma separated)</label>
      <input
        className="tf-input"
        value={playsText}
        onChange={e => setPlaysText(e.target.value)}
        placeholder="playId1,playId2"
      />

      <label className="tf-label">Awards (comma separated)</label>
      <input
        className="tf-input"
        value={awardsText}
        onChange={e => setAwardsText(e.target.value)}
        placeholder="Best Play,Best Script"
      />

      <div className="tf-actions">
        <button className="tf-button" type="submit" disabled={loading}>
          {loading ? 'Inserting...' : 'Insert Group'}
        </button>
      </div>

      {status && (
        <div className={`tf-status ${status.ok ? 'tf-ok' : 'tf-err'}`} role="status">
          <strong>{status.ok ? 'Success' : 'Error'}:</strong> {status.msg}
          {status.data && <pre className="tf-data">{JSON.stringify(status.data, null, 2)}</pre>}
        </div>
      )}
    </form>
  );
}
