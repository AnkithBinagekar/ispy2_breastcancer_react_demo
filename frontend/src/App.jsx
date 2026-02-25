// src/App.jsx
import { useEffect, useState } from "react";

import OmicsRadar from "./components/OmicsRadar";
import DriversPanel from "./components/DriversPanel";
import MechanisticAlignment from "./components/MechanisticAlignment";
import MechanisticEvidence from "./components/MechanisticEvidence";
import ResponseCard from "./components/ResponseCard";
import RegimenBuilder from "./components/RegimenBuilder";
import AuditProvenance from "./components/AuditProvenance";
import PatientData from "./components/PatientData";
import LongitudinalMRI from "./components/LongitudinalMRI";
import RegimenLeaderboard from "./components/RegimenLeaderboard";
import "./App.css";

// EXACT Streamlit Pill Header Component
const PanelHeader = ({ title, type = "normal" }) => (
  <div className={`panel-header panel-${type}`}>
    <h3 className="panel-title">{title}</h3>
  </div>
);

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [regimens, setRegimens] = useState(null);
  const [omics, setOmics] = useState(null);
  const [drivers, setDrivers] = useState({});
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeScenario, setActiveScenario] = useState("standard");
  
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
      
    setActiveScenario("standard");
  }, [selectedPatient]);

  return (
    <div className="app-root">
      
      {/* SIDEBAR TOGGLE BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ 
          position: "fixed", top: "16px", left: "16px", zIndex: 9999,
          background: "var(--bg-card)", color: "var(--text-main)",
          border: "1px solid var(--border-main)", borderRadius: "8px",
          padding: "8px 12px", cursor: "pointer", fontWeight: 600,
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
        }}
      >
        {isSidebarOpen ? "✕ Close Data" : "☰ Data Settings"}
      </button>

      {/* THEME TOGGLE BUTTON */}
      <button 
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{ 
          position: "fixed", top: "16px", right: "24px", zIndex: 9999,
          width: "46px", height: "46px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--bg-card)", color: "var(--text-main)",
          border: "1px solid var(--border-main)", cursor: "pointer",
          fontSize: "22px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease"
        }}
        title="Toggle Theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {isSidebarOpen && (
        <aside className="sidebar">
          <h3 style={{ marginTop: "40px" }}>Data</h3>
          <label><input type="radio" name="mode" defaultChecked /> Load cohort JSON</label><br/>
          <label><input type="radio" name="mode" /> Load single patient JSON</label>

          <details style={{ marginTop: 12 }}>
            <summary>Path presets (from run steps)</summary>
            <p style={{ fontSize: 12 }}>Expected cohort output (step 4):<br /><code>ispy2_top20_v7_optionB_fullcohort_with_modelA.json</code></p>
            <p style={{ fontSize: 12 }}>Expected single patient path (step 8):<br /><code>./live_patients/patient_records/&lt;patient_id&gt;.json</code></p>
            <div style={{ display: "flex", gap: 8 }}>
              <button>Use default cohort</button>
              <button>Use sample patient</button>
            </div>
          </details>

          <p style={{ marginTop: 12 }}>Cohort JSON path</p>
          <input type="text" defaultValue="ispy2_top20_v7_optionB_fullcohort_with_modelA.json" />
          <p style={{ marginTop: 12 }}>Single patient JSON path</p>
          <input type="text" defaultValue="./live_patients/patient_records/382853.json" />

          <p style={{ fontSize: 12, marginTop: 12 }}>Single-patient mode: click Run inference to generate predictions.</p>
          <button>Run inference</button>
          <hr />

          <h4>Optional: Live Model-A scoring</h4>
          <label><input type="checkbox" /> Enable Model-A scoring</label>
          <p>Models dir</p><input type="text" defaultValue="./out/models" />
          <p>Infer script</p><input type="text" defaultValue="./03_infer_modelA.py" />
          <p>Regimen vocab (optional)</p><input type="text" defaultValue="./regimen_vocab.json" />
          <p>Use modalities</p><input type="text" defaultValue="mrna,rppa" />
          <hr />

          <h4>Display</h4>
          <label><input type="checkbox" /> Show regimen leaderboard (table)</label><br/>
          <label><input type="checkbox" /> Show debug JSON</label>

          <details style={{ marginTop: 12 }}>
            <summary>Inputs used (demo)</summary>
            <ul>
              <li>Regimen probabilities</li>
              <li>Baseline omics (mRNA / RPPA)</li>
              <li>Clinical context</li>
            </ul>
          </details>
        </aside>
      )}

      <main className="main-content" style={{ paddingLeft: !isSidebarOpen ? "50px" : "32px", paddingTop: "32px" }}>
        <h1 style={{ marginTop: "8px" }}>I-SPY2 Breast Cancer Digital Twin Demo</h1>

        <section className="row-3col">
          {/* LEFT: Omics */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, marginBottom: 6, fontWeight: 600, color: "var(--text-main)" }}>Select patient</div>
              <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: "100%" }}>
                {patients.map((p) => (<option key={p}>{p}</option>))}
              </select>
            </div>
            
            <PanelHeader title="OMICS PROFILE (BASELINE)" type="bright" />
            <div style={{ textAlign: "center", marginBottom: -10 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Signature fingerprint (scaled from pathway z-scores)</span>
            </div>
            <div className="chart-box">
              <OmicsRadar omics={omics} theme={theme} />
            </div>
            <DriversPanel drivers={drivers} omics={omics} />
          </div>

          {/* MIDDLE: Data & Alignment (DUPLICATION REMOVED) */}
          <div>
            <PanelHeader title="PATIENT DATA" type="top" />
            <PatientData patientId={selectedPatient} subtype={omics?.subtype} arm={omics?.arm} />
            
            <div style={{ marginTop: 32 }}></div>
            <PanelHeader title="MECHANISTIC ALIGNMENT (HEURISTIC)" />
            <MechanisticAlignment drivers={drivers} omics={omics} regimens={regimens} />
            
            <div style={{ marginTop: 16 }}></div>
            <PanelHeader title="MECHANISTIC EVIDENCE LAYER" />
            <MechanisticEvidence drivers={drivers} omics={omics} regimens={regimens} />
          </div>

          {/* RIGHT: Response Prediction */}
          <div>
            <PanelHeader title="RESPONSE PREDICTION" type="top" />
            <ResponseCard 
              regimens={regimens} 
              activeScenario={activeScenario} 
              setActiveScenario={setActiveScenario} 
            />
          </div>
        </section>

        <section className="row-2col">
          <div>
            <PanelHeader title="LONGITUDINAL MRI (TIMEPOINTS)" />
            <LongitudinalMRI />
          </div>
          <div>
            <PanelHeader title="REGIMEN BUILDER (WHAT-IF)" />
            <RegimenBuilder 
              regimens={regimens} 
              activeScenario={activeScenario} 
              setActiveScenario={setActiveScenario} 
            />
          </div>
        </section>

        {/* Data Table Leaderboard (Interactive) */}
        <RegimenLeaderboard regimens={regimens} />

        {/* Audit Provenance Expander */}
        <AuditProvenance />

      </main>
    </div>
  );
}

export default App;