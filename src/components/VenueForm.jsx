// src/components/VenueForm.jsx
import React, { useState } from 'react';
import './styles/InsertForms.css';

export default function VenueForm() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [playsText, setPlaysText] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const parse = txt => txt.split(',').map(s => s.trim()).filter(Boolean);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const body = { name, location, plays: parse(playsText) };

    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/venues`, {
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

      setStatus({ ok: true, msg: 'Venue inserted', data });
      setName('');
      setLocation('');
      setPlaysText('');
    } catch (err) {
      setStatus({ ok: false, msg: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="tf-form" onSubmit={handleSubmit}>
      <h3 className="tf-form-title">Insert Venue</h3>

      <label className="tf-label">Name</label>
      <input
        className="tf-input"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="Venue name"
      />

      <label className="tf-label">Location (City)</label>
      <input
        className="tf-input"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Bengaluru"
      />

      <label className="tf-label">Plays (IDs, comma separated)</label>
      <input
        className="tf-input"
        value={playsText}
        onChange={e => setPlaysText(e.target.value)}
        placeholder="playId1,playId2"
      />

      <div className="tf-actions">
        <button className="tf-button" type="submit" disabled={loading}>
          {loading ? 'Inserting...' : 'Insert Venue'}
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
