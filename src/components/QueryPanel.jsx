// src/components/QueryPanel.jsx
import React, { useState } from 'react';
import api from '../api';

const QUERIES = [
  { id: 'q1', title: '1. List all Kannada plays', path: '/plays/kannada' },
  { id: 'q2', title: '2. Group with maximum plays', path: '/groups/top' },
  { id: 'q3', title: '3. Venues with >3 plays', path: '/venues/popular' },
  { id: 'q4', title: '4. Critics reviewed >5 plays', path: '/critics/active' },
  { id: 'q5', title: '5. Avg audience rating per genre', path: '/ratings/genre-average' },
  { id: 'q6', title: '6. Plays with Best Play & Best Script', path: '/plays/dual-award' },
  { id: 'q7', title: '7. Actors in more than one play', path: '/actors/multi-play' },
  { id: 'q8', title: '8. Genres with most plays', path: '/genres/top' },
  { id: 'q9', title: '9. Workshops > 50 participants', path: '/workshops/big' },
  { id: 'q10', title: '10. Critics always rated <5', path: '/critics/strict' },
  { id: 'q11', title: '11. Plays in multiple venues', path: '/plays/multi-venue' },
  { id: 'q12', title: '12. Groups that never won awards', path: '/groups/no-award' },
];

export default function QueryPanel() {
  const [active, setActive] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function runQuery(q) {
    setActive(q.id);
    setResult(null);
    setErr(null);
    setLoading(true);
    try {
      const data = await api.get(q.path);
      setResult(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tf-query-panel">
      <div className="tf-query-left">
        <ul className="tf-query-list">
          {QUERIES.map(q => (
            <li
              key={q.id}
              className={`tf-query-item ${active === q.id ? 'tf-active' : ''}`}
              onClick={() => runQuery(q)}
            >
              {q.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="tf-query-right">
        <div className="tf-query-toolbar">
          {active ? <span className="tf-badge">Active: {QUERIES.find(x=>x.id===active)?.title}</span> : <span className="tf-muted">Choose a query</span>}
        </div>

        <div className="tf-query-output">
          {loading && <div className="tf-loading">Loading...</div>}
          {err && <div className="tf-err">Error: {err}</div>}
          {!loading && !err && result && (
            <pre className="tf-pre">{JSON.stringify(result, null, 2)}</pre>
          )}
          {!loading && !err && result === null && <div className="tf-muted">No results yet</div>}
        </div>
      </div>
    </div>
  );
}
