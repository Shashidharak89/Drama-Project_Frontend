// CriticsStrictRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/CriticsStrictRenderer.css';

export default function CriticsStrictRenderer() {
  const [items, setItems] = useState(null); // array
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({}); // id -> bool
  const [showAllFor, setShowAllFor] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      setItems(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/critics/strict`;
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

  function computeAvg(reviews) {
    if (!Array.isArray(reviews) || reviews.length === 0) return '—';
    const nums = reviews.map(r => (typeof r.score === 'number' ? r.score : (r && r.score != null ? Number(r.score) : NaN))).filter(n => !Number.isNaN(n));
    if (nums.length === 0) return '—';
    const sum = nums.reduce((a,b) => a + b, 0);
    return (sum / nums.length).toFixed(2);
  }

  if (loading) return <div className="csr-wrapper"><div className="csr-loading">Loading strict critics…</div></div>;
  if (err) return <div className="csr-wrapper"><div className="csr-error">Error: {err}</div></div>;
  if (!items || items.length === 0) return <div className="csr-wrapper"><div className="csr-empty">No critics matched the criteria.</div></div>;

  return (
    <div className="csr-root">
      <div className="csr-table-wrap">
        <table className="csr-table" role="table" aria-label="Critics who rate below 5 consistently">
          <thead>
            <tr>
              <th>Critic</th>
              <th className="csr-center">Avg Score</th>
              <th className="csr-center">Review Count</th>
              <th>Example Reviews</th>
              <th className="csr-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((c, idx) => {
              const id = c._id || c.id || c.name || `critic-${idx}`;
              const name = c.name || 'Unnamed Critic';
              const reviews = Array.isArray(c.reviews) ? c.reviews : (c.reviewsList ? c.reviewsList : []);
              const avg = computeAvg(reviews);
              const rc = reviews.length;

              const examples = reviews.slice(0, 3).map((r, i) => {
                const playLabel = r.play || r.playId || (r.play && (r.play.name || r.play.title)) || '—';
                const score = (typeof r.score !== 'undefined') ? r.score : '—';
                return `${playLabel}: ${score}`;
              });

              return (
                <React.Fragment key={id}>
                  <tr className="csr-row">
                    <td className="csr-critic-cell">
                      <div className="csr-critic-name">{name}</div>
                      <div className="csr-critic-id">{id}</div>
                    </td>

                    <td className="csr-center">{avg}</td>

                    <td className="csr-center">{rc}</td>

                    <td>
                      {rc === 0 ? (
                        <span className="csr-empty-val">—</span>
                      ) : (
                        <div className="csr-examples">
                          {examples.map((ex, i) => <span key={i} className="csr-pill">{ex}</span>)}
                          {rc > 3 && (
                            <button
                              className="csr-link-btn"
                              onClick={() => setShowAllFor(showAllFor === id ? null : id)}
                            >
                              {showAllFor === id ? 'Hide' : `+${rc - 3} more`}
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="csr-actions">
                      <button className="csr-raw-btn" onClick={() => toggleExpand(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="csr-expanded-row">
                      <td colSpan={5}>
                        <div className="csr-raw-block"><pre>{JSON.stringify(c, null, 2)}</pre></div>
                      </td>
                    </tr>
                  )}

                  {showAllFor === id && reviews.length > 3 && (
                    <tr className="csr-expanded-row">
                      <td colSpan={5}>
                        <div className="csr-all-reviews">
                          <strong>All reviews:</strong>
                          <div className="csr-reviews-list">
                            {reviews.map((r, i) => (
                              <div key={i} className="csr-review-row">
                                <div className="csr-review-play">{r.play || r.playId || (r.play && (r.play.name || r.play.title)) || '—'}</div>
                                <div className="csr-review-score">{typeof r.score === 'number' ? r.score : '—'}</div>
                              </div>
                            ))}
                          </div>
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
