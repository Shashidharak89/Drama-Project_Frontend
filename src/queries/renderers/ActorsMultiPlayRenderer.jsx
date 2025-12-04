// ActorsMultiPlayRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/ActorsMultiPlayRenderer.css';

export default function ActorsMultiPlayRenderer() {
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
        const url = `${base}/api/actors/multi-play`;
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

  if (loading) return <div className="amp-wrapper"><div className="amp-loading">Loading actors…</div></div>;
  if (err) return <div className="amp-wrapper"><div className="amp-error">Error: {err}</div></div>;
  if (!items || items.length === 0) return <div className="amp-wrapper"><div className="amp-empty">No actors found.</div></div>;

  return (
    <div className="amp-root">
      <div className="amp-table-wrap">
        <table className="amp-table" role="table" aria-label="Actors in multiple plays">
          <thead>
            <tr>
              <th>Actor</th>
              <th className="amp-center">Play Count</th>
              <th>Plays</th>
              <th className="amp-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((a, idx) => {
              const id = a._id || a.id || `actor-${idx}`;
              const name = a.name || 'Unnamed Actor';
              const plays = Array.isArray(a.plays) ? a.plays : (a.playList || []);
              // produce display list: if play objects -> name else string/id
              const playLabels = Array.isArray(plays) ? plays.map(p => (typeof p === 'string' ? p : (p.name || p.title || p._id || p.id || '—'))) : [];

              return (
                <React.Fragment key={id}>
                  <tr className="amp-row">
                    <td className="amp-actor-cell">
                      <div className="amp-actor-name">{name}</div>
                      <div className="amp-actor-id">{id}</div>
                    </td>

                    <td className="amp-center">{playLabels.length}</td>

                    <td>
                      {playLabels.length ? (
                        <ul className="amp-play-list">
                          {playLabels.map((pl, i) => <li key={i}>{pl}</li>)}
                        </ul>
                      ) : <span className="amp-empty-val">—</span>}
                    </td>

                    <td className="amp-actions">
                      <button className="amp-btn" onClick={() => toggleJson(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="amp-expanded">
                      <td colSpan={4}>
                        <div className="amp-raw"><pre>{JSON.stringify(a, null, 2)}</pre></div>
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
