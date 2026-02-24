// src/App.jsx
import { useEffect, useState } from "react";

import OmicsRadar from "./components/OmicsRadar";
import DriversPanel from "./components/DriversPanel";
import MechanisticAlignment from "./components/MechanisticAlignment";
import MechanisticEvidence from "./components/MechanisticEvidence";
import ResponseCard from "./components/ResponseCard";
import RegimenBars from "./components/RegimenBars";
import RegimenBuilder from "./components/RegimenBuilder";
import AuditProvenance from "./components/AuditProvenance";

import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [regimens, setRegimens] = useState(null);
  const [omics, setOmics] = useState(null);
  const [drivers, setDrivers] = useState({});

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
      <aside className="sidebar">
        <h3>Data</h3>

        <label>
          <input type="radio" defaultChecked /> Load cohort JSON
        </label>

        <label>
          <input type="radio" /> Load single patient JSON
        </label>

        <p style={{ marginTop: 12 }}>Select patient</p>

        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          {patients.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label>
          <input type="checkbox" /> Enable Model-A scoring
        </label>

        <label>
          <input type="checkbox" /> Show regimen leaderboard
        </label>

        <label>
          <input type="checkbox" /> Show debug JSON
        </label>
      </aside>

      {/* ========== MAIN ========== */}
      <main className="main-content">
        <h1>I-SPY2 Breast Cancer Digital Twin</h1>

        {/* ================================================= */}
        {/* ROW 1 : Omics | Patient+Mechanistic | Response  */}
        {/* ================================================= */}

        <section className="row-3col">
          {/* LEFT */}
          <div className="card">
            <h3>Signature Fingerprint (mRNA)</h3>
            <div className="chart-box">
              <OmicsRadar omics={omics} />
            </div>

            <DriversPanel drivers={drivers} />
          </div>

          {/* MIDDLE */}
          <div className="card">
            <h3>Patient Data</h3>

            <p><b>Patient ID:</b> {selectedPatient}</p>

            <MechanisticAlignment drivers={drivers} />

            <MechanisticEvidence />
          </div>

          {/* RIGHT */}
          <ResponseCard regimens={regimens} />
        </section>

        {/* ================================================= */}
        {/* ROW 2 : Regimen Builder | Regimen Leaderboard   */}
        {/* ================================================= */}

        <section className="row-2col">
          <div className="card">
            <RegimenBuilder regimens={regimens} />
          </div>

          <div className="card">
            <RegimenBars regimens={regimens} />
          </div>
        </section>

        {/* ================================================= */}
        {/* ROW 3 : AUDIT                                   */}
        {/* ================================================= */}

        <div className="card">
          <AuditProvenance />
        </div>

      </main>
    </div>
  );
}

export default App;