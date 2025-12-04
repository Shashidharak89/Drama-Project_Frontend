// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InsertAllForms from "./components/InsertAllForms";
import QueryPanelMain from "./Query";

export default function App() {
  return (
    <Router>
      {/* Nav Bar */}
      <nav
        style={{
          padding: "12px 20px",
          background: "#2563eb",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "16px",
          }}
        >
          Home
        </Link>

        <Link
          to="/insert"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "16px",
          }}
        >
          Insert Data
        </Link>
      </nav>

      {/* Page Content */}
      <Routes>
        {/* Home page – Query panel */}
        <Route path="/" element={<QueryPanelMain />} />

        {/* Insert forms page */}
        <Route path="/insert" element={<InsertAllForms />} />
      </Routes>
    </Router>
  );
}
