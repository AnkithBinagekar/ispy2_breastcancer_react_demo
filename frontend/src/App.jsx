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
import PatientData from "./components/PatientData";
import LongitudinalMRI from "./components/LongitudinalMRI";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [regimens, setRegimens] = useState(null);
  const [omics, setOmics] = useState(null);
  const [drivers, setDrivers] = useState({});
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // SHARED STATE: Keeps ResponseCard and RegimenBuilder synced
  const [activeScenario, setActiveScenario] = useState("standard");

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
      
    // Reset scenario on patient change
    setActiveScenario("standard");
  }, [selectedPatient]);

  return (
    <div className="app-root">
      
      <button 
        className="sidebar-toggle-floating" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "☰ Close" : "☰ Menu"}
      </button>

      {/* ========== SIDEBAR ========== */}
      {isSidebarOpen && (
        <aside className="sidebar">
          <h3 style={{ marginTop: "24px" }}>Data</h3>
          <label><input type="radio" name="mode" defaultChecked /> Load cohort JSON</label>
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
          <label><input type="checkbox" /> Show regimen leaderboard (table)</label>
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

      {/* ========== MAIN ========== */}
      <main className="main-content" style={{ paddingLeft: !isSidebarOpen ? "60px" : "32px" }}>
        <h1>I-SPY2 Breast Cancer Digital Twin</h1>

        {/* ROW 1: Omics | Patient | Response */}
        <section className="row-3col">
          <div className="card">
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Select patient</div>
              <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ width: "100%" }}>
                {patients.map((p) => (<option key={p}>{p}</option>))}
              </select>
            </div>
            <h3>Signature Fingerprint (mRNA)</h3>
            <div className="chart-box">
              <OmicsRadar omics={omics} />
            </div>
            <DriversPanel drivers={drivers} />
          </div>

          <div className="card">
            <PatientData patientId={selectedPatient} subtype={omics?.subtype} arm={omics?.arm} />
            <MechanisticAlignment drivers={drivers} />
            <MechanisticEvidence />
          </div>

          <ResponseCard 
            regimens={regimens} 
            activeScenario={activeScenario} 
            setActiveScenario={setActiveScenario} 
          />
        </section>

        {/* ROW 2: MRI | Regimen Builder */}
        <section className="row-2col">
          <LongitudinalMRI />
          <div className="card">
            <RegimenBuilder 
              regimens={regimens} 
              activeScenario={activeScenario} 
              setActiveScenario={setActiveScenario} 
            />
          </div>
        </section>

        {/* ROW 3: Leaderboard */}
        <div className="card" style={{ marginBottom: 24 }}>
          <RegimenBars regimens={regimens} />
        </div>

        {/* ROW 4: Audit */}
        <div className="card">
          <AuditProvenance />
        </div>

      </main>
    </div>
  );
}

export default App;