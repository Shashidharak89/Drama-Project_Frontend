// src/components/queries/renderers/GenresRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/GenresRenderer.css';

export default function GenresRenderer() {
  const [items, setItems] = useState(null); // array
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({}); // id -> bool
  const [sortKey, setSortKey] = useState('playCount'); // 'playCount' | 'genre'
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      setItems(null);
      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/genres/top`;
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

  function sortItems(list) {
    if (!Array.isArray(list)) return list;
    const copy = [...list];
    copy.sort((a, b) => {
      if (sortKey === 'genre') {
        const A = String(a.genre ?? a._id ?? '').toLowerCase();
        const B = String(b.genre ?? b._id ?? '').toLowerCase();
        return sortDir === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
      } else { // playCount
        const A = Number(a.playCount ?? a.count ?? (Array.isArray(a.plays) ? a.plays.length : 0));
        const B = Number(b.playCount ?? b.count ?? (Array.isArray(b.plays) ? b.plays.length : 0));
        return sortDir === 'asc' ? A - B : B - A;
      }
    });
    return copy;
  }

  if (loading) return <div className="gr-wrapper">Loading genres…</div>;
  if (err) return <div className="gr-wrapper gr-error">Error: {err}</div>;
  if (!items || items.length === 0) return <div className="gr-wrapper gr-empty">No genre data found.</div>;

  const list = sortItems(items);

  return (
    <div className="gr-root">
      <div className="gr-header">
        <div className="gr-title">Genres — most plays</div>

        <div className="gr-controls">
          <label className="gr-label">Sort</label>
          <select className="gr-select" value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="playCount">Play Count</option>
            <option value="genre">Genre</option>
          </select>

          <button
            className="gr-sort-btn"
            onClick={() => setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            title="Toggle sort direction"
          >
            {sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="gr-table-wrap">
        <table className="gr-table" role="table" aria-label="Genres with most plays">
          <thead>
            <tr>
              <th>Genre</th>
              <th className="gr-center">Play Count</th>
              <th>Top Plays (examples)</th>
              <th className="gr-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((g, idx) => {
              const id = g.genre ?? g._id ?? `genre-${idx}`;
              const genreName = g.genre ?? g._id ?? `Genre ${idx + 1}`;
              const playCount = Number(g.playCount ?? g.count ?? (Array.isArray(g.plays) ? g.plays.length : 0));
              const plays = Array.isArray(g.plays) ? g.plays.slice(0, 4).map(p => (typeof p === 'string' ? p : (p.name || p.title || p._id || p.id))) : [];

              return (
                <React.Fragment key={id}>
                  <tr className="gr-row">
                    <td className="gr-genre-cell">{genreName}</td>
                    <td className="gr-center">{Number.isFinite(playCount) ? playCount : '—'}</td>
                    <td>
                      {plays.length ? (
                        <ul className="gr-play-list">
                          {plays.map((pl, i) => <li key={i}>{pl}</li>)}
                        </ul>
                      ) : <span className="gr-empty-val">No example plays</span>}
                    </td>
                    <td className="gr-actions">
                      <button className="gr-btn" onClick={() => toggleJson(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="gr-expanded">
                      <td colSpan={4}>
                        <div className="gr-raw"><pre>{JSON.stringify(g, null, 2)}</pre></div>
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
