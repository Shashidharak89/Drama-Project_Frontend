// src/components/PlayForm.jsx
import React, { useState } from 'react';
import './styles/InsertForms.css';

export default function PlayForm() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('Kannada');
  const [genre, setGenre] = useState('');
  const [venues, setVenues] = useState(''); // comma separated ids
  const [actors, setActors] = useState(''); // comma separated ids
  const [theatreGroup, setTheatreGroup] = useState('');
  const [awards, setAwards] = useState(''); // comma separated strings
  const [ratingsText, setRatingsText] = useState(''); // format: criticId:score,criticId2:score2
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function parseIds(text) {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  function parseAwards(text) {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  function parseRatings(text) {
    // expected: criticId:score,criticId2:score2
    if (!text.trim()) return [];
    return text.split(',').map(item => {
      const [critic, score] = item.split(':').map(s => s && s.trim());
      return { critic, score: score ? Number(score) : null };
    }).filter(r => r.critic);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const body = {
      name,
      language,
      genre,
      venues: parseIds(venues),
      actors: parseIds(actors),
      theatreGroup: theatreGroup || undefined,
      awards: parseAwards(awards),
      ratings: parseRatings(ratingsText)
    };

    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/plays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }

      if (!res.ok) {
        const msg = (data && data.error) ? data.error : (typeof data === 'string' ? data : res.statusText);
        throw new Error(msg || `Request failed with status ${res.status}`);
      }

      setStatus({ ok: true, msg: 'Play inserted', data });
      // reset form partially
      setName('');
      setGenre('');
      setVenues('');
      setActors('');
      setTheatreGroup('');
      setAwards('');
      setRatingsText('');
      setLanguage('Kannada');
    } catch (err) {
      setStatus({ ok: false, msg: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="tf-form" onSubmit={handleSubmit}>
      <h3 className="tf-form-title">Insert Play</h3>

      <label className="tf-label">Name</label>
      <input
        className="tf-input"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="Play title"
      />

      <label className="tf-label">Language</label>
      <input
        className="tf-input"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        placeholder="Kannada"
      />

      <label className="tf-label">Genre</label>
      <input
        className="tf-input"
        value={genre}
        onChange={e => setGenre(e.target.value)}
        placeholder="Drama"
      />

      <label className="tf-label">Venue IDs (comma separated)</label>
      <input
        className="tf-input"
        value={venues}
        onChange={e => setVenues(e.target.value)}
        placeholder="venueId1,venueId2"
      />

      <label className="tf-label">Actor IDs (comma separated)</label>
      <input
        className="tf-input"
        value={actors}
        onChange={e => setActors(e.target.value)}
        placeholder="actorId1,actorId2"
      />

      <label className="tf-label">Theatre Group ID</label>
      <input
        className="tf-input"
        value={theatreGroup}
        onChange={e => setTheatreGroup(e.target.value)}
        placeholder="groupId"
      />

      <label className="tf-label">Awards (comma separated)</label>
      <input
        className="tf-input"
        value={awards}
        onChange={e => setAwards(e.target.value)}
        placeholder="Best Play,Best Script"
      />

      <label className="tf-label">Ratings (criticId:score, ...)</label>
      <input
        className="tf-input"
        value={ratingsText}
        onChange={e => setRatingsText(e.target.value)}
        placeholder="criticId1:8,criticId2:6"
      />

      <div className="tf-actions">
        <button className="tf-button" type="submit" disabled={loading}>
          {loading ? 'Inserting...' : 'Insert Play'}
        </button>
      </div>

      {status && (
        <div className={`tf-status ${status.ok ? 'tf-ok' : 'tf-err'}`} role="status">
          <strong>{status.ok ? 'Success' : 'Error'}:</strong> {status.msg}
          {status.data && <pre className="tf-data">{JSON.stringify(status.data, null, 2)}</pre>}
        </div>
      )}
    </form>
  );
}
