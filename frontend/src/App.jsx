// src/App.jsx
import { useEffect, useState } from "react";
import ResponseCard from "./components/ResponseCard";
import OmicsRadar from "./components/OmicsRadar";
import DriversPanel from "./components/DriversPanel";
import MechanisticAlignment from "./components/MechanisticAlignment";
import RegimenBars from "./components/RegimenBars";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [regimens, setRegimens] = useState(null);
  const [omics, setOmics] = useState(null);
  const [drivers, setDrivers] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // -----------------------
  // Fetch patients
  // -----------------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/patients")
      .then((r) => r.json())
      .then((data) => {
        setPatients(data);
        setSelectedPatient(data[0]);
      });
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;

    fetch(`http://127.0.0.1:8000/patient/${selectedPatient}/regimens`)
      .then((r) => r.json())
      .then(setRegimens);

    fetch(`http://127.0.0.1:8000/patient/${selectedPatient}/omics`)
      .then((r) => r.json())
      .then(setOmics);

    fetch(`http://127.0.0.1:8000/patient/${selectedPatient}/drivers`)
      .then((r) => r.json())
      .then(setDrivers);
  }, [selectedPatient]);

  return (
    <div className="app-root">
      {/* ========== SIDEBAR ========== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <span>Data</span>
          <button
            className="collapse-btn"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            {sidebarOpen ? "❮❮" : "❯❯"}
          </button>
        </div>

        <div className="sidebar-section">
          <label>
            <input type="radio" name="mode" defaultChecked />
            Load cohort JSON
          </label>
          <label>
            <input type="radio" name="mode" />
            Load single patient JSON
          </label>
        </div>

        <div className="sidebar-section">
          <p>Select patient</p>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            {patients.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="sidebar-section">
          <label>
            <input type="checkbox" />
            Enable Model-A scoring
          </label>
          <label>
            <input type="checkbox" />
            Show regimen leaderboard
          </label>
          <label>
            <input type="checkbox" />
            Show debug JSON
          </label>
        </div>
      </aside>

      {/* ========== MAIN ========== */}
      <main className="main-content">
        <h1>I-SPY2 Breast Cancer Digital Twin</h1>

        {/* TOP GRID */}
        <section className="dashboard-grid">
          <div className="card">
            <h3>Signature Fingerprint (mRNA)</h3>
            <div className="chart-box">
              <OmicsRadar omics={omics} />
            </div>
          </div>

          <div className="card">
            <MechanisticAlignment drivers={drivers} />
          </div>

          <div className="card">
            <ResponseCard regimens={regimens} />
          </div>
        </section>

        {/* BOTTOM GRID */}
        <section className="bottom-grid">
          <div className="card">
            <DriversPanel drivers={drivers} />
          </div>

          <div className="card">
            <RegimenBars regimens={regimens} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
