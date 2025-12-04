// src/components/queries/renderers/GroupTopRenderer.jsx
import React, { useEffect, useState } from "react";
import "./styles/GroupTopRenderer.css";

export default function GroupTopRenderer() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      setData(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const url = `${base}/api/groups/top`;
        const res = await fetch(url, { method: "GET" });

        const text = await res.text();
        let payload;
        try {
          payload = text ? JSON.parse(text) : null;
        } catch {
          payload = text;
        }

        if (!res.ok) {
          const message =
            (payload && payload.error) ||
            (typeof payload === "string" ? payload : res.statusText);
          throw new Error(message);
        }

        if (!cancelled) setData(payload);
      } catch (e) {
        if (!cancelled) setErr(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // UI States
  if (loading)
    return <div className="gt-wrapper">Loading top group…</div>;

  if (err)
    return <div className="gt-wrapper gt-error">Error: {err}</div>;

  if (!data)
    return <div className="gt-wrapper gt-empty">No data found.</div>;

  // Assume backend returns object or array
  const d = Array.isArray(data) ? data[0] : data;

  const groupName = d.name || "Unknown Group";
  const playCount = d.playCount ?? (Array.isArray(d.plays) ? d.plays.length : "—");

  return (
    <div className="gt-root">
      <div className="gt-card">
        <header className="gt-header">
          <h2 className="gt-title">{groupName}</h2>
          <div className="gt-subtitle">Top Theatre Group</div>
        </header>

        <section className="gt-body">
          <div className="gt-row">
            <div className="gt-label">Play Count</div>
            <div className="gt-value">{playCount}</div>
          </div>

          {Array.isArray(d.plays) && d.plays.length > 0 && (
            <div className="gt-row">
              <div className="gt-label">Plays</div>
              <div className="gt-value">
                <ul className="gt-list">
                  {d.plays.map((p) => (
                    <li key={p._id || p}>{p.name || p}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <footer className="gt-footer">
          <button
            className="gt-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide JSON" : "Show raw JSON"}
          </button>
        </footer>

        {expanded && (
          <div className="gt-raw">
            <pre>{JSON.stringify(d, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
