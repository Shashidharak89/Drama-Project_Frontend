// src/components/queries/QueryOutput.jsx
import React, { useEffect, useState } from 'react';
import PlaysRenderer from './renderers/PlaysRenderer';
import GroupTopRenderer from './renderers/GroupTopRenderer';
import VenuesRenderer from './renderers/VenuesRenderer';
import CriticsRenderer from './renderers/CriticsRenderer';
import GenreAvgRenderer from './renderers/GenreAvgRenderer';
import ActorsRenderer from './renderers/ActorsRenderer';
import GenresRenderer from './renderers/GenresRenderer';
import WorkshopsRenderer from './renderers/WorkshopsRenderer';
import CriticsStrictRenderer from './renderers/CriticsStrictRenderer';
import GroupsNoAwardRenderer from './renderers/GroupsNoAwardRenderer';
import DualAwardPlaysRenderer from './renderers/DualAwardPlaysRenderer';
import MultiVenuePlaysRenderer from './renderers/MultiVenuePlaysRenderer';
import './styles/QueryPanel.css';

export default function QueryOutput({ active }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!active) {
      setData(null);
      setErr(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr(null);
      setData(null);

      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        // active.path already includes leading slash like '/plays/kannada'
        const url = `${base}/api${active.path}`;
        const res = await fetch(url, { method: 'GET' });

        const text = await res.text();
        let payload;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

        if (!res.ok) {
          const message = (payload && payload.error) ? payload.error : (typeof payload === 'string' ? payload : res.statusText);
          throw new Error(message || `Request failed ${res.status}`);
        }

        if (!cancelled) setData(payload);
      } catch (e) {
        if (!cancelled) setErr(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => { cancelled = true; };
  }, [active]);

  function renderOutput() {
    if (!active) return <div className="qo-empty">Select a query from the left to run it.</div>;
    if (loading) return <div className="qo-loading">Loading…</div>;
    if (err) return <div className="qo-error">Error: {err}</div>;
    if (data === null) return <div className="qo-empty">No data.</div>;

    switch (active.id) {
      case 'q1': return <PlaysRenderer/>;
      case 'q2': return <GroupTopRenderer data={data} />;
      case 'q3': return <VenuesRenderer venues={data} />;
      case 'q4': return <CriticsRenderer critics={data} />;
      case 'q5': return <GenreAvgRenderer items={data} />;
      case 'q6': return <DualAwardPlaysRenderer plays={data} />;
      case 'q7': return <ActorsRenderer actors={data} />;
      case 'q8': return <GenresRenderer items={data} />;
      case 'q9': return <WorkshopsRenderer items={data} />;
      case 'q10': return <CriticsStrictRenderer critics={data} />;
      case 'q11': return <MultiVenuePlaysRenderer plays={data} />;
      case 'q12': return <GroupsNoAwardRenderer groups={data} />;
      default: return <pre className="qo-pre">{JSON.stringify(data, null, 2)}</pre>;
    }
  }

  return (
    <div className="qo-root">
      <div className="qo-toolbar">
        <div className="qo-active">{active ? active.title : 'No query selected'}</div>
      </div>

      <div className="qo-body">
        {renderOutput()}
      </div>
    </div>
  );
}
