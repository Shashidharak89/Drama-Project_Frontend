// MultiVenuePlaysRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/MultiVenuePlaysRenderer.css';

export default function MultiVenuePlaysRenderer() {
  const [items, setItems] = useState(null); // array
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
        const url = `${base}/api/plays/multi-venue`;
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

  function getVenueNames(venues) {
    if (!venues) return [];
    if (!Array.isArray(venues)) return [String(venues)];
    return venues.map(v => (v && (v.name || v)) || '').filter(Boolean);
  }

  if (loading) return <div className="mvp-wrapper"><div className="mvp-loading">Loading plays in multiple venues…</div></div>;
  if (err) return <div className="mvp-wrapper"><div className="mvp-error">Error: {err}</div></div>;
  if (!items || items.length === 0) return <div className="mvp-wrapper"><div className="mvp-empty">No plays found that were staged in multiple venues.</div></div>;

  return (
    <div className="mvp-root">
      <div className="mvp-table-wrap">
        <table className="mvp-table" role="table" aria-label="Plays performed in multiple venues">
          <thead>
            <tr>
              <th>Play</th>
              <th className="mvp-center">Venue Count</th>
              <th>Venues</th>
              <th>Theatre Group</th>
              <th className="mvp-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p, idx) => {
              const id = p._id || p.id || `play-${idx}`;
              const name = p.name || p.title || 'Untitled Play';
              const venueNames = getVenueNames(p.venues);
              const venueCount = venueNames.length || (Array.isArray(p.venues) ? p.venues.length : (p.venueCount ?? '—'));
              const group = (p.theatreGroup && (p.theatreGroup.name || p.theatreGroup)) || (p.theatreGroup ?? '—');

              return (
                <React.Fragment key={id}>
                  <tr className="mvp-row">
                    <td className="mvp-play-cell">
                      <div className="mvp-play-name">{name}</div>
                      <div className="mvp-play-id">{id}</div>
                    </td>

                    <td className="mvp-center">{venueCount}</td>

                    <td>
                      {venueNames.length ? (
                        <ul className="mvp-venue-list">
                          {venueNames.map((vn, i) => <li key={i}>{vn}</li>)}
                        </ul>
                      ) : <span className="mvp-empty-val">No venue details</span>}
                    </td>

                    <td>{group}</td>

                    <td className="mvp-actions">
                      <button className="mvp-btn" onClick={() => toggleJson(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="mvp-expanded">
                      <td colSpan={5}>
                        <div className="mvp-raw"><pre>{JSON.stringify(p, null, 2)}</pre></div>
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
