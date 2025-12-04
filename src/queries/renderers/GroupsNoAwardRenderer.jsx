// src/components/queries/renderers/GroupsNoAwardRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function GroupsNoAwardRenderer({ groups }) {
  if (!Array.isArray(groups) || groups.length === 0) return <div className="renderer-empty">No groups found.</div>;
  return (
    <div className="list-col">
      {groups.map(g => (
        <div className="card" key={g._id || g.name}>
          <div className="card-header">{g.name}</div>
          <div className="card-body">
            <div><strong>Plays:</strong> {Array.isArray(g.plays) ? g.plays.join(', ') : (g.plays || '—')}</div>
            <div><strong>Awards:</strong> {Array.isArray(g.awards) && g.awards.length ? g.awards.join(', ') : '—'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
