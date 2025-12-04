// src/components/queries/renderers/PlaysRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/PlaysRenderer.css';

export default function PlaysRenderer() {
  const [data, setData] = useState(null);      // array or null
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({}); // id -> bool

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      setData(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/plays/kannada`;
        const res = await fetch(url, { method: 'GET' });

        const text = await res.text();
        let payload;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

        if (!res.ok) {
          const message = (payload && payload.error) ? payload.error : (typeof payload === 'string' ? payload : res.statusText);
          throw new Error(message || `Request failed ${res.status}`);
        }

        if (!cancelled) setData(Array.isArray(payload) ? payload : (payload ? [payload] : []));
      } catch (e) {
        if (!cancelled) setErr(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []); // run once on mount

  function toggle(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function extractNames(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(x => (x && (x.name || x.title || x)) || '').filter(Boolean);
  }

  function calcAvg(ratings) {
    if (!Array.isArray(ratings) || ratings.length === 0) return '—';
    const nums = ratings.map(r => (typeof r.score === 'number' ? r.score : (r && r.score != null ? Number(r.score) : NaN))).filter(n => !Number.isNaN(n));
    if (nums.length === 0) return '—';
    const sum = nums.reduce((a,b) => a + b, 0);
    return (sum / nums.length).toFixed(2);
  }

  if (loading) return <div className="pr-wrapper"><div className="pr-loading">Loading plays…</div></div>;
  if (err) return <div className="pr-wrapper"><div className="pr-error">Error: {err}</div></div>;
  if (!data || data.length === 0) return <div className="pr-wrapper"><div className="pr-empty">No Kannada plays found.</div></div>;

  return (
    <div className="prt-root">
      <div className="prt-table-wrap">
        <table className="prt-table" role="table" aria-label="Kannada plays">
          <thead>
            <tr>
              <th>Play</th>
              <th>Language</th>
              <th>Genre</th>
              <th>Theatre Group</th>
              <th>Venues</th>
              <th>Actors</th>
              <th>Awards</th>
              <th className="prt-center">Avg Rating</th>
              <th className="prt-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, idx) => {
              const id = p._id || p.id || `play-${idx}`;
              const name = p.name || p.title || 'Untitled Play';
              const language = p.language || p.lang || '—';
              const genre = p.genre || '—';
              const group = (p.theatreGroup && (p.theatreGroup.name || p.theatreGroup)) || (p.theatreGroup ?? '—');
              const venues = extractNames(p.venues);
              const actors = extractNames(p.actors);
              const awards = Array.isArray(p.awards) ? p.awards : (p.awards ? [p.awards] : []);
              const avg = calcAvg(p.ratings);

              return (
                <React.Fragment key={id}>
                  <tr className="prt-row">
                    <td className="prt-play-cell">
                      <div className="prt-play-name">{name}</div>
                      <div className="prt-play-id">{id}</div>
                    </td>

                    <td className="prt-small">{language}</td>
                    <td className="prt-small">{genre}</td>
                    <td>{group}</td>

                    <td>
                      {venues.length ? (
                        <ul className="prt-inline-list">
                          {venues.map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                      ) : <span className="prt-empty-val">—</span>}
                    </td>

                    <td>
                      {actors.length ? (
                        <ul className="prt-inline-list">
                          {actors.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      ) : <span className="prt-empty-val">—</span>}
                    </td>

                    <td>{awards.length ? awards.join(' • ') : '—'}</td>

                    <td className="prt-center">{avg}</td>

                    <td className="prt-actions">
                      <button className="prt-btn" onClick={() => toggle(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="prt-expanded">
                      <td colSpan={9}>
                        <div className="prt-raw"><pre>{JSON.stringify(p, null, 2)}</pre></div>
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
