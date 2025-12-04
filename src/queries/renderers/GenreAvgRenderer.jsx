// src/components/queries/renderers/GenreAvgRenderer.jsx
import React from 'react';
import '../../styles/QueryPanel.css';

export default function GenreAvgRenderer({ items }) {
  if (!Array.isArray(items) || items.length === 0) return <div className="renderer-empty">No genre ratings found.</div>;
  return (
    <table className="qp-table">
      <thead><tr><th>Genre</th><th>Avg Rating</th><th>Rating Count</th></tr></thead>
      <tbody>
        {items.map(it => (
          <tr key={it.genre || it._id}>
            <td>{it.genre ?? it._id}</td>
            <td>{it.avgRating ?? it.avg ?? '—'}</td>
            <td>{it.ratingCount ?? it.count ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
