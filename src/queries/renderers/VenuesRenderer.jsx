// src/components/queries/renderers/VenuesRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/VenuesRenderer.css';

export default function VenuesRenderer() {
  const [data, setData] = useState(null);     // array or null
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({}); // map of id -> bool

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      setData(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/venues/popular`;
        const res = await fetch(url, { method: 'GET' });

        const text = await res.text();
        let payload;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

        if (!res.ok) {
          const message = (payload && payload.error) ? payload.error : (typeof payload === 'string' ? payload : res.statusText);
          throw new Error(message || `Request failed ${res.status}`);
        }

        if (!cancelled) setData(payload);
      } catch (e) {
        if (!cancelled) setErr(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  function toggleRaw(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  if (loading) return <div className="vr-wrapper"><div className="vr-loading">Loading venues…</div></div>;
  if (err) return <div className="vr-wrapper"><div className="vr-error">Error: {err}</div></div>;
  if (!data || (Array.isArray(data) && data.length === 0)) return <div className="vr-wrapper"><div className="vr-empty">No popular venues found.</div></div>;

  const list = Array.isArray(data) ? data : [data];

  return (
    <div className="vr-root">
      <div className="vr-grid">
        {list.map((v) => {
          const id = v._id || v.id || (v.name ? v.name.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).slice(2,8));
          const name = v.name || 'Unnamed Venue';
          const location = v.location || '—';
          // playCount might be provided, or we infer from plays array
          const playCount = (typeof v.playCount !== 'undefined') ? v.playCount : (Array.isArray(v.plays) ? v.plays.length : '—');
          const plays = Array.isArray(v.plays) ? v.plays : [];

          return (
            <article className="vr-card" key={id}>
              <header className="vr-header">
                <div className="vr-title-block">
                  <h3 className="vr-title">{name}</h3>
                  <div className="vr-sub">
                    <span className="vr-loc">{location}</span>
                    <span className="vr-count">{playCount} plays</span>
                  </div>
                </div>

                <div className="vr-actions">
                  <button className="vr-btn" onClick={() => toggleRaw(id)}>
                    {expanded[id] ? 'Hide JSON' : 'Show raw JSON'}
                  </button>
                </div>
              </header>

              <div className="vr-body">
                <div className="vr-section">
                  <div className="vr-label">Play count</div>
                  <div className="vr-value">{playCount}</div>
                </div>

                <div className="vr-section">
                  <div className="vr-label">Plays</div>
                  <div className="vr-value">
                    {plays.length ? (
                      <ul className="vr-play-list">
                        {plays.map((p, i) => {
                          // p might be object or id
                          if (typeof p === 'string') return <li key={i}>{p}</li>;
                          return <li key={p._id || p.id || i}>{p.name || p}</li>;
                        })}
                      </ul>
                    ) : <span className="vr-empty-val">No plays listed</span>}
                  </div>
                </div>
              </div>

              {expanded[id] && (
                <div className="vr-raw">
                  <pre>{JSON.stringify(v, null, 2)}</pre>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
