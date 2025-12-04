// src/components/InsertForms.jsx
import React, { useState } from 'react';
import api from '../api';

export default function InsertForms() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // small helper to POST and show result
  async function handlePost(endpoint, body) {
    setLoading(true);
    setStatus(null);
    try {
      const data = await api.post(endpoint, body);
      setStatus({ ok: true, msg: 'Inserted successfully', data });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  // default sample bodies you can edit in the UI
  const [playBody, setPlayBody] = useState(JSON.stringify({
    name: "Bannada Chitte",
    language: "Kannada",
    genre: "Drama",
    venues: [],           // add venue IDs here
    ratings: [],
    awards: ["Best Play","Best Script"],
    theatreGroup: "",     // add group id
    actors: []            // add actor ids
  }, null, 2));

  const [groupBody, setGroupBody] = useState(JSON.stringify({
    name: "Nayana Kala Sangha",
    plays: [],
    awards: []
  }, null, 2));

  const [venueBody, setVenueBody] = useState(JSON.stringify({
    name: "Ranga Shankara",
    location: "Bengaluru",
    plays: []
  }, null, 2));

  const [criticBody, setCriticBody] = useState(JSON.stringify({
    name: "Sathish Kulkarni",
    reviews: []
  }, null, 2));

  const [actorBody, setActorBody] = useState(JSON.stringify({
    name: "Rakshith Gowda",
    plays: []
  }, null, 2));

  const [workshopBody, setWorkshopBody] = useState(JSON.stringify({
    name: "Karnataka Rangabhoomi Workshop",
    participantCount: 72
  }, null, 2));

  return (
    <div className="tf-insert-forms">
      <div className="tf-form-block">
        <label className="tf-form-label">Play (POST /api/plays)</label>
        <textarea className="tf-textarea" value={playBody} onChange={e => setPlayBody(e.target.value)} />
        <div className="tf-controls">
          <button className="tf-btn" onClick={() => {
            try {
              handlePost('/plays', JSON.parse(playBody));
            } catch (e) { setStatus({ ok: false, msg: 'Invalid JSON in play body' }); }
          }} disabled={loading}>Insert Play</button>
        </div>
      </div>

      <div className="tf-form-block">
        <label className="tf-form-label">Group (POST /api/groups)</label>
        <textarea className="tf-textarea" value={groupBody} onChange={e => setGroupBody(e.target.value)} />
        <div className="tf-controls">
          <button className="tf-btn" onClick={() => {
            try { handlePost('/groups', JSON.parse(groupBody)); } catch (e) { setStatus({ ok: false, msg: 'Invalid JSON in group body' }); }
          }} disabled={loading}>Insert Group</button>
        </div>
      </div>

      <div className="tf-form-block">
        <label className="tf-form-label">Venue (POST /api/venues)</label>
        <textarea className="tf-textarea" value={venueBody} onChange={e => setVenueBody(e.target.value)} />
        <div className="tf-controls">
          <button className="tf-btn" onClick={() => {
            try { handlePost('/venues', JSON.parse(venueBody)); } catch (e) { setStatus({ ok: false, msg: 'Invalid JSON in venue body' }); }
          }} disabled={loading}>Insert Venue</button>
        </div>
      </div>

      <div className="tf-form-block">
        <label className="tf-form-label">Critic (POST /api/critics)</label>
        <textarea className="tf-textarea" value={criticBody} onChange={e => setCriticBody(e.target.value)} />
        <div className="tf-controls">
          <button className="tf-btn" onClick={() => {
            try { handlePost('/critics', JSON.parse(criticBody)); } catch (e) { setStatus({ ok: false, msg: 'Invalid JSON in critic body' }); }
          }} disabled={loading}>Insert Critic</button>
        </div>
      </div>

      <div className="tf-form-block">
        <label className="tf-form-label">Actor (POST /api/actors)</label>
        <textarea className="tf-textarea" value={actorBody} onChange={e => setActorBody(e.target.value)} />
        <div className="tf-controls">
          <button className="tf-btn" onClick={() => {
            try { handlePost('/actors', JSON.parse(actorBody)); } catch (e) { setStatus({ ok: false, msg: 'Invalid JSON in actor body' }); }
          }} disabled={loading}>Insert Actor</button>
        </div>
      </div>

      <div className="tf-form-block">
        <label className="tf-form-label">Workshop (POST /api/workshops)</label>
        <textarea className="tf-textarea" value={workshopBody} onChange={e => setWorkshopBody(e.target.value)} />
        <div className="tf-controls">
          <button className="tf-btn" onClick={() => {
            try { handlePost('/workshops', JSON.parse(workshopBody)); } catch (e) { setStatus({ ok: false, msg: 'Invalid JSON in workshop body' }); }
          }} disabled={loading}>Insert Workshop</button>
        </div>
      </div>

      <div className="tf-status">
        {loading && <div className="tf-loading">Processing...</div>}
        {status && (
          <div className={`tf-status-msg ${status.ok ? 'tf-ok' : 'tf-err'}`}>
            <strong>{status.ok ? 'Success' : 'Error'}:</strong> {status.msg}
            {status.data && (
              <pre className="tf-pre">{JSON.stringify(status.data, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
