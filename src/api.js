// src/api.js
// simple fetch wrapper using VITE_BACKEND_URL
const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export default { post, get };
