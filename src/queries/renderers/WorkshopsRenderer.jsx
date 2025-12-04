// src/components/queries/renderers/WorkshopsRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function WorkshopsRenderer({ items }) {
  if (!Array.isArray(items) || items.length === 0) return <div className="renderer-empty">No workshops found.</div>;
  return (
    <div className="list-col">
      {items.map(w => (
        <div key={w._id || w.name} className="card">
          <div className="card-header">{w.name}</div>
          <div className="card-body">
            <div><strong>Participants:</strong> {w.participantCount ?? w.participants ?? '—'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
