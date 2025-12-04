// src/components/queries/renderers/PlaysRenderer.jsx
import React, { useEffect, useState } from 'react';
import './styles/PlaysRenderer.css';

export default function PlaysRenderer() {
  const [data, setData] = useState(null);      // array or null
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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

        if (!cancelled) setData(payload);
      } catch (e) {
        if (!cancelled) setErr(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []); // run once on mount

  // render states
  if (loading) return <div className="pr-wrapper"><div className="pr-loading">Loading plays…</div></div>;
  if (err) return <div className="pr-wrapper"><div className="pr-error">Error: {err}</div></div>;
  if (!data || (Array.isArray(data) && data.length === 0)) return <div className="pr-wrapper"><div className="pr-empty">No Kannada plays found.</div></div>;

  const list = Array.isArray(data) ? data : [data];

  return (
    <div className="pr-root">
      <div className="pr-grid">
        {list.map((p) => {
          const id = p._id || p.id || Math.random().toString(36).slice(2, 9);
          const name = p.name || 'Untitled Play';
          const language = p.language || '—';
          const genre = p.genre || '—';
          const theatreGroup = (p.theatreGroup && (p.theatreGroup.name || p.theatreGroup)) || '—';
          const awards = Array.isArray(p.awards) ? p.awards : (p.awards ? [p.awards] : []);
          const venues = Array.isArray(p.venues) ? p.venues : [];
          const actors = Array.isArray(p.actors) ? p.actors : [];
          const ratings = Array.isArray(p.ratings) ? p.ratings : [];

          return (
            <article className="pr-card" key={id}>
              <header className="pr-header">
                <div className="pr-title-block">
                  <h3 className="pr-title">{name}</h3>
                  <div className="pr-sub">
                    <span className="pr-lang">{language}</span>
                    <span className="pr-genre">{genre}</span>
                  </div>
                </div>

                <div className="pr-awards">
                  {awards.length
                    ? awards.map((a, i) => <span className="pr-award" key={i}>{a}</span>)
                    : <span className="pr-award pr-award-empty">No awards</span>}
                </div>
              </header>

              <div className="pr-body">
                <div className="pr-left">
                  <div className="pr-section">
                    <div className="pr-label">Theatre Group</div>
                    <div className="pr-value">{theatreGroup}</div>
                  </div>

                  <div className="pr-section">
                    <div className="pr-label">Actors</div>
                    <div className="pr-value">
                      {actors.length ? (
                        <ul className="pr-inline-list">
                          {actors.map(a => (
                            <li key={a._id || a} className="pr-pill">{a.name || a}</li>
                          ))}
                        </ul>
                      ) : <span className="pr-empty-val">—</span>}
                    </div>
                  </div>

                  <div className="pr-section">
                    <div className="pr-label">Venues</div>
                    <div className="pr-value pr-venues">
                      {venues.length ? (
                        venues.map(v => (
                          <div key={v._id || v} className="pr-venue">
                            <div className="pr-venue-name">{v.name || v}</div>
                            {v.location && <div className="pr-venue-loc">{v.location}</div>}
                          </div>
                        ))
                      ) : <span className="pr-empty-val">—</span>}
                    </div>
                  </div>
                </div>

                <div className="pr-right">
                  <div className="pr-section">
                    <div className="pr-label">Ratings</div>
                    <div className="pr-value">
                      {ratings.length ? (
                        <div className="pr-ratings">
                          {ratings.map(r => {
                            const critic = (r.critic && (r.critic.name || r.critic)) || (r.critic || 'critic');
                            return (
                              <div key={r._id || critic} className="pr-rating-item">
                                <div className="pr-rating-critic">{critic}</div>
                                <div className="pr-rating-score">{typeof r.score !== 'undefined' ? r.score : '—'}</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : <span className="pr-empty-val">No ratings</span>}
                    </div>
                  </div>

                  <div className="pr-section">
                    <div className="pr-label">Meta</div>
                    <div className="pr-value">
                      <div className="pr-meta-row"><strong>ID:</strong> <code className="pr-code">{id}</code></div>
                      <div className="pr-meta-row"><strong>Version:</strong> {typeof p.__v !== 'undefined' ? p.__v : '—'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="pr-footer">
                <button
                  className="pr-btn"
                  onClick={() => setExpandedId(expandedId === id ? null : id)}
                  aria-expanded={expandedId === id}
                >
                  {expandedId === id ? 'Hide JSON' : 'Show raw JSON'}
                </button>
              </footer>

              {expandedId === id && (
                <div className="pr-raw">
                  <pre>{JSON.stringify(p, null, 2)}</pre>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
