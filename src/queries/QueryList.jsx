// src/components/queries/QueryList.jsx
import React from 'react';
import './styles/QueryPanel.css';

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

export default function QueryList({ active, onSelect }) {
  return (
    <ul className="ql-list">
      {QUERIES.map(q => (
        <li
          key={q.id}
          className={`ql-item ${active && active.id === q.id ? 'ql-active' : ''}`}
          onClick={() => onSelect(q)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelect(q); }}
        >
          <div className="ql-title">{q.title}</div>
        </li>
      ))}
    </ul>
  );
}
