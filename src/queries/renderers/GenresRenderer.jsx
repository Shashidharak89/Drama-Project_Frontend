// src/components/queries/renderers/GenresRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function GenresRenderer({ items }) {
  if (!Array.isArray(items) || items.length === 0) return <div className="renderer-empty">No genres found.</div>;
  return (
    <table className="qp-table">
      <thead><tr><th>Genre</th><th>Play Count</th></tr></thead>
      <tbody>
        {items.map(it => (
          <tr key={it.genre ?? it._id}>
            <td>{it.genre ?? it._id}</td>
            <td>{it.playCount ?? it.count ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
