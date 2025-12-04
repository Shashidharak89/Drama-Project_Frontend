// src/components/queries/renderers/GenreAvgRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/GenreAvgRenderer.css';

export default function GenreAvgRenderer() {
  const [items, setItems] = useState(null); // array
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [sortKey, setSortKey] = useState('avgRating'); // default sort

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      setItems(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/ratings/genre-average`;
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

  function sortItems(list) {
    if (!Array.isArray(list)) return list;
    const copy = [...list];
    if (sortKey === 'genre') {
      copy.sort((a,b) => String((a.genre||'')).localeCompare(String((b.genre||''))));
    } else if (sortKey === 'avgRating') {
      copy.sort((a,b) => (b.avgRating ?? b.avg ?? 0) - (a.avgRating ?? a.avg ?? 0));
    } else if (sortKey === 'ratingCount') {
      copy.sort((a,b) => (b.ratingCount ?? b.count ?? 0) - (a.ratingCount ?? a.count ?? 0));
    }
    return copy;
  }

  if (loading) return <div className="gar-wrapper"><div className="gar-loading">Loading genre averages…</div></div>;
  if (err) return <div className="gar-wrapper"><div className="gar-error">Error: {err}</div></div>;
  if (!items || items.length === 0) return <div className="gar-wrapper"><div className="gar-empty">No genre rating data found.</div></div>;

  const list = sortItems(items);

  return (
    <div className="gar-root">
      <div className="gar-header">
        <div className="gar-title">Average Audience Rating — by Genre</div>

        <div className="gar-controls">
          <label className="gar-sort-label">Sort by</label>
          <select className="gar-select" value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="avgRating">Avg Rating (high → low)</option>
            <option value="ratingCount">Rating Count (high → low)</option>
            <option value="genre">Genre (A → Z)</option>
          </select>
        </div>
      </div>

      <div className="gar-table-wrap">
        <table className="gar-table" role="table" aria-label="Average rating per genre">
          <thead>
            <tr>
              <th>Genre</th>
              <th className="gar-center">Avg Rating</th>
              <th className="gar-center">Rating Count</th>
            </tr>
          </thead>

          <tbody>
            {list.map((it, idx) => {
              const genre = it.genre ?? it._id ?? `Genre ${idx+1}`;
              const avg = (typeof it.avgRating !== 'undefined') ? it.avgRating : (typeof it.avg !== 'undefined' ? it.avg : '—');
              const count = (typeof it.ratingCount !== 'undefined') ? it.ratingCount : (typeof it.count !== 'undefined' ? it.count : '—');

              // format number if numeric
              const avgDisplay = (typeof avg === 'number') ? Number(avg).toFixed(2) : avg;

              return (
                <tr key={genre + idx}>
                  <td className="gar-genre-cell">{genre}</td>
                  <td className="gar-center">{avgDisplay}</td>
                  <td className="gar-center">{count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
