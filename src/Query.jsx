// src/components/queries/QueryPanelMain.jsx
import React, { useMemo, useState } from "react";

/* ----- renderer imports (your existing components) ----- */
import PlaysRenderer from "./queries/renderers/PlaysRenderer";
import GroupTopRenderer from "./queries/renderers/GroupTopRenderer";
import VenuesRenderer from "./queries/renderers/VenuesRenderer";
import CriticsActiveRenderer from "./queries/renderers/CriticsActiveRenderer";
import GenreAvgRenderer from "./queries/renderers/GenreAvgRenderer";
import DualAwardPlaysRenderer from "./queries/renderers/DualAwardPlaysRenderer";
import ActorsMultiPlayRenderer from "./queries/renderers/ActorsMultiPlayRenderer";
import GenresRenderer from "./queries/renderers/GenresRenderer";
import WorkshopsRenderer from "./queries/renderers/WorkshopsRenderer";
import CriticsStrictRenderer from "./queries/renderers/CriticsStrictRenderer";
import MultiVenuePlaysRenderer from "./queries/renderers/MultiVenuePlaysRenderer";
import GroupsNoAwardRenderer from "./queries/renderers/GroupsNoAwardRenderer";
/* ------------------------------------------------------ */

export default function QueryPanelMain() {
  // list of queries (left column). id maps to components below.
  const queries = useMemo(() => ([
    { id: 'q1',  title: 'Plays (Kannada)', hint: 'List all plays performed in Kannada' },
    { id: 'q2',  title: 'Top Group', hint: 'Group that performed maximum plays' },
    { id: 'q3',  title: 'Popular Venues', hint: 'Venues where more than 3 plays were staged' },
    { id: 'q4',  title: 'Active Critics', hint: 'Critics who reviewed more than 5 plays' },
    { id: 'q5',  title: 'Avg Rating by Genre', hint: 'Average audience rating per genre' },
    { id: 'q6',  title: 'Dual Award Plays', hint: 'Plays that won Best Play AND Best Script' },
    { id: 'q7',  title: 'Actors (multi-play)', hint: 'Actors who performed in more than one play' },
    { id: 'q8',  title: 'Top Genres', hint: 'Genres with the most plays staged' },
    { id: 'q9',  title: 'Big Workshops', hint: 'Workshops attended by more than 50 participants' },
    { id: 'q10', title: 'Strict Critics', hint: 'Critics who gave ratings below 5 consistently' },
    { id: 'q11', title: 'Multi-Venue Plays', hint: 'Plays performed in multiple venues' },
    { id: 'q12', title: 'Groups with No Awards', hint: 'Theatre groups that never won awards' },
  ]), []);

  // map id to actual component
  const componentMap = useMemo(() => ({
    q1: PlaysRenderer,
    q2: GroupTopRenderer,
    q3: VenuesRenderer,
    q4: CriticsActiveRenderer,
    q5: GenreAvgRenderer,
    q6: DualAwardPlaysRenderer,
    q7: ActorsMultiPlayRenderer,
    q8: GenresRenderer,
    q9: WorkshopsRenderer,
    q10: CriticsStrictRenderer,
    q11: MultiVenuePlaysRenderer,
    q12: GroupsNoAwardRenderer,
  }), []);

  // active selection state
  const [activeId, setActiveId] = useState(null); // start with no selection; change to 'q1' to auto-select first

  const ActiveComponent = activeId ? (componentMap[activeId] || null) : null;

  return (
    <div className="qpanel-root" role="region" aria-label="Queries panel">
      {/* inject local CSS */}
      <style>{`
        /* QueryPanelMain local styles (prefix qp-) */
        .qpanel-root {
          height: calc(100vh - 32px);
          display: flex;
          gap: 16px;
          padding: 16px;
          box-sizing: border-box;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
          color: #0f1720;
          background: linear-gradient(180deg,#fbfdff,#ffffff);
        }

        /* Left column */
        .qp-left {
          width: 280px;
          min-width: 200px;
          max-width: 360px;
          background: #ffffff;
          border: 1px solid #eef6ff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(12,22,40,0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .qp-left-header {
          padding: 14px;
          border-bottom: 1px solid #f3f7fb;
          background: linear-gradient(180deg,#fff,#fbfdff);
        }
        .qp-left-header h3 { margin:0; font-size:16px; font-weight:800; }
        .qp-left-body { overflow:auto; padding:8px; }

        .qp-list { list-style:none; margin:0; padding:8px; display:flex; flex-direction:column; gap:6px; }
        .qp-item {
          display:flex;
          gap:10px;
          align-items:center;
          padding:10px;
          border-radius:8px;
          cursor:pointer;
          transition: background .12s, transform .06s;
          user-select: none;
        }
        .qp-item:hover { background:#f8fbff; transform: translateY(-1px); }
        .qp-item.active {
          background: linear-gradient(90deg,#eef7ff,#f8fbff);
          box-shadow: inset 0 0 0 1px rgba(37,99,235,0.06);
        }
        .qp-item .qp-index {
          width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;
          font-weight:800;color:#2563eb;background:#eef6ff;border:1px solid #e6eef8;
          font-size:13px;
        }
        .qp-item .qp-titles { display:flex; flex-direction:column; gap:2px; }
        .qp-item .qp-title { font-weight:700; font-size:13px; }
        .qp-item .qp-hint { font-size:12px; color:#64748b; }

        /* Right column */
        .qp-right {
          flex:1;
          display:flex;
          flex-direction:column;
          min-width: 0; /* allow shrinking for overflow */
        }
        .qp-right-header {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:12px;
        }
        .qp-right .qp-crumb {
          font-size:15px;
          font-weight:800;
          padding:6px 10px;
          border-radius:8px;
          color:#0b1220;
          background:transparent;
        }
        .qp-right .qp-actions {
          display:flex; gap:8px; align-items:center;
        }
        .qp-btn {
          background:#2563eb;color:#fff;border:none;padding:8px 10px;border-radius:8px;font-weight:700;cursor:pointer;
        }
        .qp-btn.ghost { background:transparent;color:#2563eb;border:1px solid #eef6ff; font-weight:700; }
        .qp-right-body {
          flex:1;
          overflow:auto;
          background: #fff;
          border: 1px solid #eef6ff;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 6px 18px rgba(12,22,40,0.02);
        }

        /* empty state when nothing selected */
        .qp-empty {
          display:flex; align-items:center; justify-content:center; height:100%;
          color:#64748b; font-size:16px; font-weight:700;
        }

        /* responsiveness: stack on small screens */
        @media (max-width: 920px) {
          .qpanel-root { flex-direction: column; padding: 12px; height: auto; }
          .qp-left { width: 100%; max-width:none; display:flex; flex-direction:row; align-items:center; overflow-x:auto; padding:8px; gap:8px; border-radius:10px; }
          .qp-left-header { display:none; }
          .qp-list { flex-direction:row; gap:8px; padding:0; }
          .qp-item { min-width: 200px; flex: 0 0 auto; }
          .qp-right-body { margin-top: 12px; }
        }
      `}</style>

      <aside className="qp-left" aria-label="Queries list">
        <div className="qp-left-header">
          <h3>Queries</h3>
        </div>

        <div className="qp-left-body">
          <ul className="qp-list" role="list">
            {queries.map((q, idx) => {
              const active = q.id === activeId;
              return (
                <li
                  key={q.id}
                  role="listitem"
                  className={`qp-item ${active ? 'active' : ''}`}
                  tabIndex={0}
                  onClick={() => setActiveId(q.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(q.id); } }}
                  aria-pressed={active}
                >
                  <div className="qp-index">{idx + 1}</div>
                  <div className="qp-titles">
                    <div className="qp-title">{q.title}</div>
                    <div className="qp-hint">{q.hint}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <main className="qp-right" aria-live="polite">
        <div className="qp-right-header">
          <div className="qp-crumb">{activeId ? (queries.find(q => q.id === activeId)?.title || 'Result') : 'Select a query'}</div>

          <div className="qp-actions">
            <button
              className="qp-btn ghost"
              onClick={() => setActiveId(null)}
              title="Clear selection"
            >
              Clear
            </button>
            <button
              className="qp-btn"
              onClick={() => {
                // quick refresh: reset active to rerender child (they fetch on mount)
                if (!activeId) return;
                setActiveId(null);
                // small delay to remount
                setTimeout(() => setActiveId(activeId), 50);
              }}
              title="Refresh selected query"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="qp-right-body">
          {ActiveComponent ? (
            // render only the selected component
            <div style={{ minHeight: 200 }}>
              <ActiveComponent />
            </div>
          ) : (
            <div className="qp-empty">Click a query on the left to run it</div>
          )}
        </div>
      </main>
    </div>
  );
}
