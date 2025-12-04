// src/components/queries/renderers/WorkshopsRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/WorkshopsRenderer.css';

export default function WorkshopsRenderer() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({}); // id -> bool

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      setItems(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/workshops/big`;
        const res = await fetch(url, { method: 'GET' });

        const text = await res.text();
        let payload;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

        if (!res.ok) {
          const message = (payload && payload.error) ? payload.error : (typeof payload === 'string' ? payload : res.statusText);
          throw new Error(message || `Request failed ${res.status}`);
        }

        if (!cancelled) setItems(Array.isArray(payload) ? payload : (payload ? [payload] : []));
      } catch (e) {
        if (!cancelled) setErr(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  function toggleExpand(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function fmtDate(val) {
    // try to format ISO date-like strings or timestamps
    if (!val) return '—';
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString(); // user locale
    }
    return String(val);
  }

  if (loading) return <div className="wrk-wrapper"><div className="wrk-loading">Loading workshops…</div></div>;
  if (err) return <div className="wrk-wrapper"><div className="wrk-error">Error: {err}</div></div>;
  if (!items || items.length === 0) return <div className="wrk-wrapper"><div className="wrk-empty">No large workshops found.</div></div>;

  return (
    <div className="wrk-root">
      <div className="wrk-table-wrap">
        <table className="wrk-table" role="table" aria-label="Workshops with >50 participants">
          <thead>
            <tr>
              <th>Workshop</th>
              <th className="wrk-center">Participants</th>
              <th>When</th>
              <th>Notes</th>
              <th className="wrk-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((w, idx) => {
              const id = w._id || w.id || `workshop-${idx}`;
              const name = w.name || w.title || 'Untitled Workshop';
              const participants = (typeof w.participantCount !== 'undefined') ? w.participantCount : (w.participants ? (Array.isArray(w.participants) ? w.participants.length : w.participants) : '—');
              const when = w.date || w.datetime || w.scheduledAt || w.when || null;
              const notes = w.description || w.notes || '';

              return (
                <React.Fragment key={id}>
                  <tr className="wrk-row">
                    <td className="wrk-workshop-cell">
                      <div className="wrk-name">{name}</div>
                      <div className="wrk-id">{id}</div>
                    </td>

                    <td className="wrk-center">{typeof participants === 'number' ? participants : String(participants)}</td>

                    <td>{fmtDate(when)}</td>

                    <td className="wrk-notes">
                      {notes ? (notes.length > 120 ? `${notes.slice(0, 120)}…` : notes) : <span className="wrk-empty-val">—</span>}
                    </td>

                    <td className="wrk-actions">
                      <button className="wrk-btn" onClick={() => toggleExpand(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="wrk-expanded">
                      <td colSpan={5}>
                        <div className="wrk-raw">
                          <pre>{JSON.stringify(w, null, 2)}</pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
