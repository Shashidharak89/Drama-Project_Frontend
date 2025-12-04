// src/components/CriticForm.jsx
import React, { useState } from 'react';
import './styles/InsertForms.css';

export default function CriticForm() {
  const [name, setName] = useState('');
  const [reviewsText, setReviewsText] = useState(''); // format: playId:score,playId2:score2
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function parseReviews(text) {
    if (!text.trim()) return [];
    return text.split(',').map(item => {
      const [play, score] = item.split(':').map(s => s && s.trim());
      return { play: play || null, score: score ? Number(score) : null };
    }).filter(r => r.play);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const body = { name, reviews: parseReviews(reviewsText) };

    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/critics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : null; }
      catch { data = text; }

      if (!res.ok) {
        const msg = (data && data.error) ? data.error : (typeof data === 'string' ? data : res.statusText);
        throw new Error(msg || `Request failed with status ${res.status}`);
      }

      setStatus({ ok: true, msg: 'Critic inserted', data });
      setName('');
      setReviewsText('');
    } catch (err) {
      setStatus({ ok: false, msg: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="tf-form" onSubmit={handleSubmit}>
      <h3 className="tf-form-title">Insert Critic</h3>

      <label className="tf-label">Name</label>
      <input
        className="tf-input"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="Critic name"
      />

      <label className="tf-label">Reviews (playId:score, ...)</label>
      <input
        className="tf-input"
        value={reviewsText}
        onChange={e => setReviewsText(e.target.value)}
        placeholder="playId1:8,playId2:6"
      />

      <div className="tf-actions">
        <button className="tf-button" disabled={loading}>
          {loading ? 'Inserting...' : 'Insert Critic'}
        </button>
      </div>

      {status && (
        <div className={`tf-status ${status.ok ? 'tf-ok' : 'tf-err'}`} role="status">
          <strong>{status.ok ? 'Success' : 'Error'}:</strong> {status.msg}
          {status.data && (
            <pre className="tf-data">{JSON.stringify(status.data, null, 2)}</pre>
          )}
        </div>
      )}
    </form>
  );
}
