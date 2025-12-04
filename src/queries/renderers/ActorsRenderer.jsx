// src/components/queries/renderers/ActorsRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function ActorsRenderer({ actors }) {
  if (!Array.isArray(actors) || actors.length === 0) return <div className="renderer-empty">No actors found.</div>;
  return (
    <div className="list-col">
      {actors.map(a => (
        <div className="card" key={a._id || a.name}>
          <div className="card-header">{a.name}</div>
          <div className="card-body">
            <div><strong>Plays:</strong> {Array.isArray(a.plays) ? a.plays.join(', ') : (a.plays || '—')}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
