// src/api.js
const BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  try { return res.ok ? JSON.parse(text) : Promise.reject(new Error(text || res.statusText)); }
  catch (e) { return res.ok ? text : Promise.reject(new Error(text || res.statusText)); }
}

export default { post };
