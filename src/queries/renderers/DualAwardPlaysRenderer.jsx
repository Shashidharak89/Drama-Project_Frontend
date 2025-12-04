// DualAwardPlaysRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/DualAwardPlaysRenderer.css';

export default function DualAwardPlaysRenderer() {
  const [items, setItems] = useState(null); // array or null
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
        const url = `${base}/api/plays/dual-award`;
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

  function toggleJson(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function computeAvgRating(ratings) {
    if (!Array.isArray(ratings) || ratings.length === 0) return '—';
    const vals = ratings.map(r => (typeof r.score === 'number' ? r.score : (r && r.score != null ? Number(r.score) : NaN))).filter(n => !Number.isNaN(n));
    if (vals.length === 0) return '—';
    const sum = vals.reduce((a,b)=>a+b,0);
    return (sum / vals.length).toFixed(2);
  }

  function extractVenueNames(venues) {
    if (!venues) return '—';
    if (!Array.isArray(venues)) return String(venues);
    const names = venues.map(v => (v && (v.name || v)) || '').filter(Boolean);
    return names.length ? names.join(', ') : '—';
  }

  function extractGroupName(g) {
    if (!g) return '—';
    if (typeof g === 'string') return g;
    if (g.name) return g.name;
    return g._id || '—';
  }

  if (loading) return <div className="dap-wrapper"><div className="dap-loading">Loading plays with dual awards…</div></div>;
  if (err) return <div className="dap-wrapper"><div className="dap-error">Error: {err}</div></div>;
  if (!items || items.length === 0) return <div className="dap-wrapper"><div className="dap-empty">No plays found that won both awards.</div></div>;

  return (
    <div className="dap-root">
      <div className="dap-table-wrap">
        <table className="dap-table" role="table" aria-label="Plays that won Best Play and Best Script">
          <thead>
            <tr>
              <th>Play</th>
              <th>Theatre Group</th>
              <th>Genre</th>
              <th>Venues</th>
              <th>Awards</th>
              <th className="dap-center">Avg Rating</th>
              <th className="dap-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p, idx) => {
              const id = p._id || p.id || `play-${idx}`;
              const name = p.name || 'Untitled';
              const group = extractGroupName(p.theatreGroup);
              const genre = p.genre || '—';
              const venues = extractVenueNames(p.venues);
              const awards = Array.isArray(p.awards) ? p.awards.join(' • ') : (p.awards ? String(p.awards) : '—');
              const avg = computeAvgRating(p.ratings);

              return (
                <React.Fragment key={id}>
                  <tr className="dap-row">
                    <td className="dap-play-cell">
                      <div className="dap-play-name">{name}</div>
                      <div className="dap-play-id">{id}</div>
                    </td>

                    <td>{group}</td>
                    <td>{genre}</td>
                    <td>{venues}</td>
                    <td>{awards}</td>
                    <td className="dap-center">{avg}</td>
                    <td className="dap-actions">
                      <button className="dap-btn" onClick={() => toggleJson(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="dap-expanded">
                      <td colSpan={7}>
                        <div className="dap-raw">
                          <pre>{JSON.stringify(p, null, 2)}</pre>
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
