// src/components/queries/renderers/CriticsRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function CriticsRenderer({ critics }) {
  if (!Array.isArray(critics) || critics.length === 0)
    return <div className="renderer-empty">No critics found.</div>;

  return (
    <div className="list-col">
      {critics.map(c => (
        <div key={c._id || c.name} className="card">
          <div className="card-header">{c.name}</div>

          <div className="card-body">
            <div><strong>Reviews:</strong> {c.reviewCount ?? (c.reviews ? c.reviews.length : '—')}</div>

            {c.reviews && c.reviews.length > 0 && (
              <div className="mono">
                {c.reviews
                  .map(r => `${(r.play ?? r.playId) || '—'}: ${r.score}`)
                  .join(' • ')
                }
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
