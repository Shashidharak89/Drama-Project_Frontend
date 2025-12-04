// src/components/queries/renderers/CriticsActiveRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/CriticsActiveRenderer.css';

export default function CriticsActiveRenderer() {
  const [data, setData] = useState(null); // array
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expandedIds, setExpandedIds] = useState({});
  const [showAllReviewsFor, setShowAllReviewsFor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      setData(null);
      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const url = `${base}/api/critics/active`;
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
  }, []);

  function toggleExpand(id) {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function avgScore(reviews = []) {
    if (!Array.isArray(reviews) || reviews.length === 0) return '—';
    const nums = reviews.map(r => (typeof r.score === 'number' ? r.score : NaN)).filter(n => !Number.isNaN(n));
    if (nums.length === 0) return '—';
    const sum = nums.reduce((a,b)=>a+b,0);
    return (sum / nums.length).toFixed(2);
  }

  if (loading) return <div className="car-wrapper"><div className="car-loading">Loading critics…</div></div>;
  if (err) return <div className="car-wrapper"><div className="car-error">Error: {err}</div></div>;
  if (!data || data.length === 0) return <div className="car-wrapper"><div className="car-empty">No active critics found.</div></div>;

  return (
    <div className="car-root">
      <div className="car-table-wrap">
        <table className="car-table" role="table" aria-label="Active critics">
          <thead>
            <tr>
              <th>Critic</th>
              <th>Review Count</th>
              <th>Avg Score</th>
              <th>Recent Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((c) => {
              const id = c._id || c.id || c.name;
              const reviews = Array.isArray(c.reviews) ? c.reviews : [];
              const firstThree = reviews.slice(0, 3);
              return (
                <React.Fragment key={id}>
                  <tr className="car-row">
                    <td className="car-critic-cell">
                      <div className="car-critic-name">{c.name || '—'}</div>
                      <div className="car-critic-id">{id}</div>
                    </td>

                    <td className="car-center">{reviews.length}</td>

                    <td className="car-center">{avgScore(reviews)}</td>

                    <td>
                      {reviews.length === 0 ? (
                        <span className="car-empty-val">—</span>
                      ) : (
                        <div className="car-reviews-inline">
                          {firstThree.map((r, i) => {
                            const playLabel = r.play || r.playId || '—';
                            return (
                              <div className="car-review-pill" key={i}>
                                <span className="car-review-play">{playLabel}</span>
                                <span className="car-review-score">{typeof r.score === 'number' ? r.score : '—'}</span>
                              </div>
                            );
                          })}

                          {reviews.length > 3 && (
                            <button
                              className="car-link-btn"
                              onClick={() => setShowAllReviewsFor(showAllReviewsFor === id ? null : id)}
                            >
                              {showAllReviewsFor === id ? 'Hide' : `+${reviews.length - 3} more`}
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="car-actions-cell">
                      <button className="car-raw-btn" onClick={() => toggleExpand(id)}>
                        {expandedIds[id] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </td>
                  </tr>

                  {/* optional expanded JSON */}
                  {expandedIds[id] && (
                    <tr className="car-expanded-row">
                      <td colSpan={5}>
                        <div className="car-raw-block">
                          <pre>{JSON.stringify(c, null, 2)}</pre>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* optional all reviews expanded inline */}
                  {showAllReviewsFor === id && reviews.length > 3 && (
                    <tr className="car-expanded-row">
                      <td colSpan={5}>
                        <div className="car-all-reviews">
                          <strong>All reviews:</strong>
                          <div className="car-reviews-list">
                            {reviews.map((r, idx) => (
                              <div key={idx} className="car-review-row">
                                <div className="car-review-play">{r.play || r.playId || '—'}</div>
                                <div className="car-review-score">{typeof r.score === 'number' ? r.score : '—'}</div>
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
