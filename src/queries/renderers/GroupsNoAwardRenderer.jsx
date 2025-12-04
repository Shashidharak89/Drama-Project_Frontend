// GroupsNoAwardRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/GroupsNoAwardRenderer.css';

export default function GroupsNoAwardRenderer() {
  const [items, setItems] = useState(null); // array
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      setItems(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/groups/no-award`;
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

  function getPlayLabels(plays) {
    if (!plays) return [];
    if (!Array.isArray(plays)) return [String(plays)];
    return plays.map(p => (typeof p === 'string' ? p : (p.name || p.title || p._id || p.id || '—')));
  }

  if (loading) return <div className="gna-wrapper"><div className="gna-loading">Loading groups with no awards…</div></div>;
  if (err) return <div className="gna-wrapper"><div className="gna-error">Error: {err}</div></div>;
  if (!items || items.length === 0) return <div className="gna-wrapper"><div className="gna-empty">No groups found (without awards).</div></div>;

  return (
    <div className="gna-root">
      <div className="gna-table-wrap">
        <table className="gna-table" role="table" aria-label="Theatre groups without awards">
          <thead>
            <tr>
              <th>Group</th>
              <th className="gna-center">Play Count</th>
              <th>Plays</th>
              <th className="gna-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((g, idx) => {
              const id = g._id || g.id || `group-${idx}`;
              const name = g.name || 'Unnamed Group';
              const plays = Array.isArray(g.plays) ? g.plays : (g.playList || []);
              const playLabels = getPlayLabels(plays);
              const playCount = (typeof g.playCount !== 'undefined') ? g.playCount : playLabels.length;

              return (
                <React.Fragment key={id}>
                  <tr className="gna-row">
                    <td className="gna-group-cell">
                      <div className="gna-name">{name}</div>
                      <div className="gna-id">{id}</div>
                    </td>

                    <td className="gna-center">{playCount}</td>

                    <td>
                      {playLabels.length ? (
                        <ul className="gna-play-list">
                          {playLabels.map((pl, i) => <li key={i}>{pl}</li>)}
                        </ul>
                      ) : <span className="gna-empty-val">—</span>}
                    </td>

                    <td className="gna-actions">
                      <button className="gna-btn" onClick={() => toggleJson(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="gna-expanded">
                      <td colSpan={4}>
                        <div className="gna-raw"><pre>{JSON.stringify(g, null, 2)}</pre></div>
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
