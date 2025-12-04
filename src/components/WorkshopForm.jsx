// src/components/WorkshopForm.jsx
import React, { useState } from 'react';
import './styles/InsertForms.css';

export default function WorkshopForm() {
  const [name, setName] = useState('');
  const [participantCount, setParticipantCount] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const body = {
      name,
      participantCount: Number(participantCount) || 0
    };

    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const res = await fetch(`${base}/api/workshops`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : null; }
      catch { data = text; }

      if (!res.ok) {
        const msg =
          (data && data.error)
            ? data.error
            : (typeof data === "string" ? data : res.statusText);

        throw new Error(msg || `Request failed with status ${res.status}`);
      }

      setStatus({ ok: true, msg: "Workshop inserted", data });
      setName('');
      setParticipantCount(0);
    } catch (err) {
      setStatus({ ok: false, msg: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="tf-form" onSubmit={handleSubmit}>
      <h3 className="tf-form-title">Insert Workshop</h3>

      <label className="tf-label">Name</label>
      <input
        className="tf-input"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="Workshop title"
      />

      <label className="tf-label">Participant Count</label>
      <input
        type="number"
        className="tf-input"
        value={participantCount}
        onChange={e => setParticipantCount(e.target.value)}
        placeholder="e.g. 50"
      />

      <div className="tf-actions">
        <button className="tf-button" type="submit" disabled={loading}>
          {loading ? "Inserting..." : "Insert Workshop"}
        </button>
      </div>

      {status && (
        <div className={`tf-status ${status.ok ? "tf-ok" : "tf-err"}`}>
          <strong>{status.ok ? "Success" : "Error"}:</strong> {status.msg}
          {status.data && (
            <pre className="tf-data">{JSON.stringify(status.data, null, 2)}</pre>
          )}
        </div>
      )}
    </form>
  );
}
