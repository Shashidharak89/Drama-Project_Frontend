import React from 'react';
import InsertForms from './components/InsertForms';
import QueryPanel from './components/QueryPanel';

export default function App() {
  return (
    <div className="tf-app">
      <header className="tf-header">
        <h1 className="tf-title">Drama Festival Admin</h1>
        <p className="tf-sub">Frontend for inserting data & running queries (Karnataka themed)</p>
      </header>

      <main className="tf-main">
        <section className="tf-left-column">
          <h2 className="tf-section-title">Insert Data</h2>
          <InsertForms />
        </section>

        <section className="tf-right-column">
          <h2 className="tf-section-title">Queries</h2>
          <QueryPanel />
        </section>
      </main>

      <footer className="tf-footer">Built for your Express backend • Local development</footer>
    </div>
  );
}
