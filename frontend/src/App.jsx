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
  const [cohortData, setCohortData] = useState([]); // Holds the raw JSON data
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [regimens, setRegimens] = useState(null);
  const [omics, setOmics] = useState(null);
  const [drivers, setDrivers] = useState({});
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeScenario, setActiveScenario] = useState("standard");
  const [theme, setTheme] = useState("light");

  const [appMode, setAppMode] = useState("cohort"); 
  const [hasRunInference, setHasRunInference] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ==========================================
  // STANDALONE MODE: Fetch static JSON from public folder
  // ==========================================
  useEffect(() => {
    // Fetches the JSON file directly from your Vercel public directory
    fetch("/ispy2_top20_v7_optionB_fullcohort_with_modelA.json")
      .then((r) => r.json())
      .then((data) => {
        // Handle both Array and Object wrap formats
        const patientsArray = data.patients || data; 
        setCohortData(patientsArray);
        
        // Extract Patient IDs
        const pids = patientsArray.map(p => p.patient_key || p.patient_id || p.id).filter(Boolean);
        const stringPids = pids.map(String);
        
        setPatients(stringPids);
        if (stringPids.length > 0) {
          setSelectedPatient(stringPids[0]);
        }
      })
      .catch(err => console.error("Could not load static JSON:", err));
  }, []);

  // ==========================================
  // STANDALONE MODE: Filter data locally in browser
  // ==========================================
  useEffect(() => {
    if (!selectedPatient || cohortData.length === 0) return;

    // Find the currently selected patient in our local JSON array
    const p = cohortData.find(patient => 
      String(patient.patient_key || patient.patient_id || patient.id) === selectedPatient
    );

    if (p) {
      // Replicate the backend mappings
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

  const showDashboard = appMode === "cohort" || (appMode === "single" && hasRunInference);

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
          
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", marginBottom: "8px" }}>Mode</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14.5px", color: "var(--text-main)" }}>
                <input 
                  type="radio" 
                  name="mode" 
                  checked={appMode === "cohort"} 
                  onChange={() => { setAppMode("cohort"); setHasRunInference(false); }} 
                  style={{ accentColor: "#ff4b4b", width: "16px", height: "16px", cursor: "pointer" }} 
                /> 
                Load cohort JSON
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14.5px", color: "var(--text-main)" }}>
                <input 
                  type="radio" 
                  name="mode" 
                  checked={appMode === "single"} 
                  onChange={() => { setAppMode("single"); setHasRunInference(false); }} 
                  style={{ accentColor: "#ff4b4b", width: "16px", height: "16px", cursor: "pointer" }} 
                /> 
                Load single patient JSON
              </label>
            </div>
          </div>

          <details className="st-expander" style={{ marginTop: 0, marginBottom: "16px" }}>
            <summary>Path presets (from run steps)</summary>
            <div className="st-expander-content" style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "12px 14px", borderTop: "1px solid var(--border-main)" }}>
              <div>
                <p style={{ fontSize: 13, margin: "0 0 4px 0", color: "var(--text-main)" }}>Expected cohort output (step 4):</p>
                <code style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--input-bg)", padding: "2px 6px", borderRadius: "4px", wordBreak: "break-all" }}>ispy2_top20_v7_optionB_fullcohort_with_modelA.json</code>
              </div>
              <div>
                <p style={{ fontSize: 13, margin: "0 0 4px 0", color: "var(--text-main)" }}>Expected single patient path (step 8):</p>
                <code style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--input-bg)", padding: "2px 6px", borderRadius: "4px", wordBreak: "break-all" }}>./live_patients/patient_records/&lt;patient_id&gt;.json</code>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <button style={{ background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-main)", borderRadius: "6px", padding: "6px", cursor: "pointer", fontSize: "13.5px" }}>Use default cohort</button>
                <button style={{ background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-main)", borderRadius: "6px", padding: "6px", cursor: "pointer", fontSize: "13.5px" }}>Use sample patient</button>
              </div>
            </div>
          </details>

          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", margin: "0 0 6px 0" }}>Cohort JSON path</p>
            <input type="text" defaultValue="ispy2_top20_v7_optionB_fullcohort_with_modelA.json" />
          </div>
          
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", margin: "0 0 6px 0" }}>Single patient JSON path</p>
            <input type="text" defaultValue="./live_patients/patient_records/382853.json" />
          </div>

          <p style={{ fontSize: 13, marginTop: 16, marginBottom: 8, color: "var(--text-main)" }}>Single-patient mode: click Run inference to generate predictions.</p>
          <button 
            onClick={() => setHasRunInference(true)}
            style={{ width: "100%", background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-main)", borderRadius: "6px", padding: "8px", cursor: "pointer", fontWeight: 500 }}
          >
            Run inference
          </button>
          
          <hr />

          <h4>Optional: Live Model-A scoring</h4>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14.5px", color: "var(--text-main)", marginBottom: "12px" }}>
            <input type="checkbox" style={{ accentColor: "#ff4b4b", width: "16px", height: "16px", cursor: "pointer" }} /> 
            Enable Model-A scoring
          </label>
          
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", margin: "0 0 6px 0" }}>Models dir</p>
          <input type="text" defaultValue="./out/models" />
          
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", margin: "0 0 6px 0", marginTop: "8px" }}>Infer script</p>
          <input type="text" defaultValue="./03_infer_modelA.py" />
          
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", margin: "0 0 6px 0", marginTop: "8px" }}>Regimen vocab (optional)</p>
          <input type="text" defaultValue="./regimen_vocab.json" />
          
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", margin: "0 0 6px 0", marginTop: "8px" }}>Use modalities</p>
          <input type="text" defaultValue="mrna,rppa" />
          
          <hr />

          <h4>Display</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14.5px", color: "var(--text-main)" }}>
              <input type="checkbox" style={{ accentColor: "#ff4b4b", width: "16px", height: "16px", cursor: "pointer" }} /> 
              Show regimen leaderboard (table)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14.5px", color: "var(--text-main)" }}>
              <input type="checkbox" style={{ accentColor: "#ff4b4b", width: "16px", height: "16px", cursor: "pointer" }} /> 
              Show debug JSON
            </label>
          </div>

          <details className="st-expander" style={{ marginTop: "16px" }}>
            <summary>Inputs used (demo)</summary>
            <div className="st-expander-content">
              <ul style={{ margin: "0", paddingLeft: "18px", color: "var(--text-main)", fontSize: "14px", lineHeight: "1.6" }}>
                <li>Regimen probabilities</li>
                <li>Baseline omics (mRNA / RPPA)</li>
                <li>Clinical context</li>
              </ul>
            </div>
          </details>
        </aside>
      )}

      <main className="main-content" style={{ paddingLeft: !isSidebarOpen ? "50px" : "32px", paddingTop: "32px" }}>
        
        <h1 style={{ marginTop: "8px", marginBottom: "16px" }}>I-SPY2 Breast Cancer Digital Twin Demo</h1>
        
        <p style={{ fontSize: "14.5px", color: "var(--text-main)", marginBottom: appMode === "single" ? "8px" : "24px", lineHeight: 1.5 }}>
          <b>Core value proposition:</b> rank likely responders and quantify regimen what-ifs in seconds using multimodal baseline data (demo).
        </p>

        {appMode === "single" && !hasRunInference && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "14.5px", color: "var(--text-main)", marginBottom: "16px" }}>
              <b>Single-patient mode:</b> load the patient JSON, then click <b>Run inference</b> to generate predictions.
            </p>
            <button 
              onClick={() => setHasRunInference(true)}
              style={{
                background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-main)",
                borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontWeight: 400, fontSize: "14.5px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}
            >
              Run inference
            </button>
          </div>
        )}

        {showDashboard && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, marginBottom: 6, color: "var(--text-main)" }}>Select patient</div>
              <select 
                value={selectedPatient} 
                onChange={(e) => setSelectedPatient(e.target.value)} 
                style={{ width: "100%", background: "var(--input-bg)", color: "var(--text-main)", border: "1px solid var(--border-main)", borderRadius: "8px", padding: "8px 12px", fontSize: "14.5px" }}
              >
                {patients.map((p) => (<option key={p}>{p}</option>))}
              </select>
            </div>

            <section className="row-3col">
              <div>
                <PanelHeader title="OMICS PROFILE (BASELINE)" type="bright" />
                <div style={{ textAlign: "center", marginBottom: -10 }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Signature fingerprint (scaled from pathway z-scores)</span>
                </div>
                <div className="chart-box">
                  <OmicsRadar omics={omics} theme={theme} />
                </div>
                <DriversPanel drivers={drivers} omics={omics} />
              </div>

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

            <RegimenLeaderboard regimens={regimens} />
            <AuditProvenance />
          </>
        )}
      </main>
    </div>
  );
}

export default App;