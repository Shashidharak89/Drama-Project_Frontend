// src/components/queries/renderers/VenuesRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function VenuesRenderer({ venues }) {
  if (!Array.isArray(venues) || venues.length === 0) return <div className="renderer-empty">No venues found.</div>;
  return (
    <div className="list-col">
      {venues.map(v => (
        <div key={v._id || v.name} className="card">
          <div className="card-header">{v.name}</div>
          <div className="card-body">
            <div><strong>Location:</strong> {v.location || '—'}</div>
            <div><strong>Play count:</strong> {v.playCount ?? (Array.isArray(v.plays) ? v.plays.length : '—')}</div>
            {Array.isArray(v.plays) && v.plays.length > 0 && <div><strong>Plays:</strong> {v.plays.join(', ')}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
