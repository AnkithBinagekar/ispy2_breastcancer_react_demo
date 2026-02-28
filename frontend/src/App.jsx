// src/App.jsx
import { useEffect, useState } from "react";

import OmicsRadar from "./components/OmicsRadar";
import DriversPanel from "./components/DriversPanel";
import MechanisticAlignment from "./components/MechanisticAlignment";
import MechanisticEvidence from "./components/MechanisticEvidence";
import RegimenBuilder from "./components/RegimenBuilder";
import RegimenLeaderboard from "./components/RegimenLeaderboard";
import "./App.css";

function App() {
  const [cohortData, setCohortData] = useState([]); 
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [regimens, setRegimens] = useState(null);
  const [omics, setOmics] = useState(null);
  const [drivers, setDrivers] = useState({});
  const [activeScenario, setActiveScenario] = useState("standard");
  const [theme] = useState("dark"); 

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch static JSON for standalone mode
  useEffect(() => {
    fetch("/ispy2_top20_v7_optionB_fullcohort_with_modelA.json")
      .then((r) => r.json())
      .then((data) => {
        const patientsArray = data.patients || data; 
        setCohortData(patientsArray);
        
        const pids = patientsArray.map(p => p.patient_key || p.patient_id || p.id).filter(Boolean);
        const stringPids = pids.map(String);
        
        setPatients(stringPids);
        if (stringPids.length > 0) {
          setSelectedPatient(stringPids[0]);
        }
      })
      .catch(err => console.error("Could not load static JSON:", err));
  }, []);

  // Filter local data based on selection
  useEffect(() => {
    if (!selectedPatient || cohortData.length === 0) return;

    const p = cohortData.find(patient => 
      String(patient.patient_key || patient.patient_id || patient.id) === selectedPatient
    );

    if (p) {
      setRegimens(p.trial_regimen_prediction || {});
      setOmics({
        mrna: p.omics?.mRNA?.z_scores || {},
        rppa: p.omics?.RPPA?.z_scores || {},
        subtype: p.labels?.subtype || "—",
        arm: p.labels?.trial_arm || "—"
      });
      setDrivers(p.evidence_triage?.omics_driver_support || {});
    }
      
    setActiveScenario("standard");
  }, [selectedPatient, cohortData]);

  // Calculate Best pCR for the Hero Tile
  let bestScore = 0;
  let bestName = "Unknown";
  if (regimens && regimens.pcr_probability_by_regimen) {
    const sorted = Object.entries(regimens.pcr_probability_by_regimen).sort((a, b) => Number(b[1]) - Number(a[1]));
    if (sorted.length > 0) {
      bestName = sorted[0][0];
      bestScore = Math.round(Number(sorted[0][1]) * 100);
    }
  }

  return (
    <div className="app-root">
      
      {/* 1. TOP NAV BAR */}
      <nav className="top-nav">
        <h1 className="nav-title">I-SPY2 Digital Twin Dashboard</h1>
        <div className="nav-controls">
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Select Patient:</span>
          <select 
            className="patient-select"
            value={selectedPatient} 
            onChange={(e) => setSelectedPatient(e.target.value)} 
          >
            {patients.map((p) => (<option key={p}>{p}</option>))}
          </select>
        </div>
      </nav>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="dashboard-container">
        
        {/* ROW 1: Patient Details & HERO KPI */}
        <div className="row-hero">
          <div className="exec-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="card-title">Patient Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontSize: '15px' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0', fontSize: '12px', textTransform: 'uppercase' }}>Patient ID</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedPatient || "—"}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0', fontSize: '12px', textTransform: 'uppercase' }}>Subtype</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{omics?.subtype || "—"}</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0', fontSize: '12px', textTransform: 'uppercase' }}>Trial Arm Baseline</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{omics?.arm || "—"}</p>
              </div>
            </div>
          </div>

          <div className="hero-kpi-card">
            <div className="kpi-label">Highest Predicted pCR</div>
            <div className="kpi-value">{bestScore}%</div>
            <div className="kpi-regimen">{bestName}</div>
          </div>
        </div>

        {/* ROW 2: Radar & Simulation */}
        <div className="row-visuals">
          <div className="exec-card">
            <h2 className="card-title">Omics Fingerprint (Baseline)</h2>
            <div className="chart-box">
              <OmicsRadar omics={omics} theme={theme} />
            </div>
          </div>

          <div className="exec-card">
            <h2 className="card-title">Regimen Builder (What-If)</h2>
            <RegimenBuilder 
              regimens={regimens} 
              activeScenario={activeScenario} 
              setActiveScenario={setActiveScenario} 
            />
          </div>
        </div>

        {/* ROW 3: Accordions */}
        <div className="accordion-wrapper">
          <details className="exec-accordion">
            <summary>Mechanistic Evidence & Plausibility</summary>
            <div className="exec-accordion-content">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-main)' }}>Mechanistic Alignment</h4>
                  <MechanisticAlignment drivers={drivers} omics={omics} regimens={regimens} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-main)' }}>Evidence Layer</h4>
                  <MechanisticEvidence drivers={drivers} omics={omics} regimens={regimens} />
                </div>
              </div>
            </div>
          </details>

          <details className="exec-accordion">
            <summary>Top Molecular Drivers (Signature-Level)</summary>
            <div className="exec-accordion-content">
              <DriversPanel drivers={drivers} omics={omics} />
            </div>
          </details>

          <details className="exec-accordion">
            <summary>Full Regimen Leaderboard</summary>
            <div className="exec-accordion-content">
              <RegimenLeaderboard regimens={regimens} />
            </div>
          </details>
        </div>

        {/* ROW 4: Placeholders */}
        <div className="row-placeholders">
          <div className="exec-card placeholder-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.5 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>Longitudinal MRI Progression</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Tumor Burden Index (T0-T3) visualizations coming in Phase 2.</p>
          </div>

          <div className="exec-card placeholder-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.5 }}>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>AlphaFold 3D Structures</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Protein binding docking simulations currently in development.</p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;