// src/components/queries/renderers/CriticsStrictRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function CriticsStrictRenderer({ critics }) {
  if (!Array.isArray(critics) || critics.length === 0) return <div className="renderer-empty">No strict critics found.</div>;
  return (
    <div className="list-col">
      {critics.map(c => (
        <div key={c._id || c.name} className="card">
          <div className="card-header">{c.name}</div>
          <div className="card-body">
            <div><strong>Reviews:</strong></div>
            <ul>
              {(c.reviews || []).map((r, idx) => <li key={idx}>{r.play ?? r.playId ?? '—'} : {r.score}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
