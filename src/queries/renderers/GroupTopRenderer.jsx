// src/components/queries/renderers/GroupTopRenderer.jsx
import React, { useEffect, useState } from "react";
import "./styles/GroupTopRenderer.css";

export default function GroupTopRenderer() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({}); // id -> bool

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

        if (!cancelled) setData(Array.isArray(payload) ? payload : (payload ? [payload] : []));
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

  function toggle(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function getPlayLabels(plays) {
    if (!plays) return [];
    if (!Array.isArray(plays)) return [String(plays)];
    return plays.map(p => (typeof p === 'string' ? p : (p.name || p.title || p._id || p.id || '—')));
  }

  // UI States
  if (loading) return <div className="gtt-wrapper">Loading top group…</div>;
  if (err) return <div className="gtt-wrapper gtt-error">Error: {err}</div>;
  if (!data || data.length === 0) return <div className="gtt-wrapper gtt-empty">No data found.</div>;

  return (
    <div className="gtt-root">
      <div className="gtt-table-wrap">
        <table className="gtt-table" role="table" aria-label="Top theatre groups">
          <thead>
            <tr>
              <th>Group</th>
              <th className="gtt-center">Play Count</th>
              <th>Plays (examples)</th>
              <th className="gtt-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, idx) => {
              const id = d._id || d.id || `group-${idx}`;
              const name = d.name || 'Unknown Group';
              const plays = Array.isArray(d.plays) ? d.plays : [];
              const playCount = d.playCount ?? (Array.isArray(d.plays) ? d.plays.length : (d.count ?? '—'));
              const examples = getPlayLabels(plays).slice(0, 4);

              return (
                <React.Fragment key={id}>
                  <tr className="gtt-row">
                    <td className="gtt-group-cell">
                      <div className="gtt-name">{name}</div>
                      <div className="gtt-id">{id}</div>
                    </td>

                    <td className="gtt-center">{Number.isFinite(playCount) ? playCount : playCount}</td>

                    <td>
                      {examples.length ? (
                        <ul className="gtt-play-list">
                          {examples.map((pname, i) => <li key={i}>{pname}</li>)}
                        </ul>
                      ) : <span className="gtt-empty-val">No plays listed</span>}
                    </td>

                    <td className="gtt-actions">
                      <button className="gtt-btn" onClick={() => toggle(id)}>
                        {expanded[id] ? 'Hide JSON' : 'Show raw JSON'}
                      </button>
                    </td>
                  </tr>

                  {expanded[id] && (
                    <tr className="gtt-expanded">
                      <td colSpan={4}>
                        <div className="gtt-raw"><pre>{JSON.stringify(d, null, 2)}</pre></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
