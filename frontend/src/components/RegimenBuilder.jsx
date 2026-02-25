// frontend/src/components/RegimenBuilder.jsx
import { useState, useEffect } from "react";

export default function RegimenBuilder({ regimens, activeScenario = "standard", setActiveScenario }) {
  const [backboneFilter, setBackboneFilter] = useState("Any");
  const [addonFilter, setAddonFilter] = useState("Any");
  const [selectedRegimen, setSelectedRegimen] = useState("");

  // State for the blending slider
  const [showBlend, setShowBlend] = useState(false);
  const [blendWeight, setBlendWeight] = useState(0.45);

  // Reset local filters whenever the scenario button is clicked
  useEffect(() => {
    setBackboneFilter("Any");
    setAddonFilter("Any");
    setSelectedRegimen("");
  }, [activeScenario]);

  // 1. Safely handle missing data
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;
  const entries = Object.entries(regimens.pcr_probability_by_regimen);
  if (!entries.length) return null;

  // 2. Sort and identify top scenarios safely
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const standard = sorted[0] || ["Unknown", 0];
  const parp = sorted[1] || standard;
  const pi3k = sorted[2] || standard;

  // 3. Dynamic Dropdown Parsing (Safely extracting backbones/add-ons)
  const bbSet = new Set();
  const adSet = new Set();
  
  entries.forEach(([regimenName]) => {
    const toks = regimenName.split('+').map(t => t.trim()).filter(Boolean);
    if (toks.length > 0) bbSet.add(toks[0]);
    for (let i = 1; i < toks.length; i++) adSet.add(toks[i]);
  });

  const backbones = ["Any", ...Array.from(bbSet).sort()];
  const addons = ["Any", ...Array.from(adSet).sort()];

  // 4. Filtering Logic based on dropdowns
  const filteredEntries = sorted.filter(([name]) => {
    let ok = true;
    const cleanName = name.toLowerCase().replace(/\s/g, "");
    if (backboneFilter !== "Any") {
      ok = ok && cleanName.includes(backboneFilter.toLowerCase().replace(/\s/g, ""));
    }
    if (addonFilter !== "Any") {
      ok = ok && cleanName.includes(addonFilter.toLowerCase().replace(/\s/g, ""));
    }
    return ok;
  });

  // 5. Bulletproof Selection Logic
  const scenarioMap = { standard, parp, pi3k };
  // Default to standard if activeScenario is undefined or unmatched
  const defaultForScenario = scenarioMap[activeScenario] || standard; 
  
  let currentSelection;
  if (backboneFilter === "Any" && addonFilter === "Any") {
    currentSelection = defaultForScenario;
  } else {
    currentSelection = filteredEntries.length > 0 ? filteredEntries[0] : ["None Found", 0];
  }

  // If user manually clicked a dropdown regimen, show that; otherwise show the calculated one
  const manualMatch = filteredEntries.find(e => e[0] === selectedRegimen);
  const displayedRegimen = manualMatch || currentSelection || ["Unknown", 0];

  // 6. Safe Math Calculations
  const baseScore = Math.round((standard[1] || 0) * 100);
  const selectedScore = Math.round((displayedRegimen[1] || 0) * 100);
  const delta = selectedScore - baseScore;

  // Calculate the blended score
  const blendedScore = ((1 - blendWeight) * baseScore) + (blendWeight * selectedScore);

  // Helper to change scenario (safeguards against missing setActiveScenario prop)
  const handleScenarioChange = (scenario) => {
    if (setActiveScenario) setActiveScenario(scenario);
  };

  return (
    <div className="regimen-builder">
      <h3>Regimen Builder (What-If)</h3>
      
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>
        <b>How to read:</b> pick a scenario. The regimen list and filters update, and the matching bar in Response Prediction is highlighted.
      </p>

      {/* Scenario selector */}
      <div className="rb-scenario-row">
        <button 
          className={activeScenario === "standard" ? "rb-btn active" : "rb-btn"} 
          onClick={() => handleScenarioChange("standard")}
        >
          Standard (trial arm baseline)
        </button>
        <button 
          className={activeScenario === "parp" ? "rb-btn active" : "rb-btn"} 
          onClick={() => handleScenarioChange("parp")}
        >
          Add PARP inhibitor
        </button>
        <button 
          className={activeScenario === "pi3k" ? "rb-btn active" : "rb-btn"} 
          onClick={() => handleScenarioChange("pi3k")}
        >
          Add PI3K/AKT inhibitor
        </button>
      </div>

      {/* Dynamic Dropdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Chemo backbone (filter)</label>
          <select 
            style={{ width: "100%", marginTop: 4, padding: "6px 8px", fontSize: 13, border: "1px solid #cbd5e1", borderRadius: 6 }}
            value={backboneFilter}
            onChange={(e) => setBackboneFilter(e.target.value)}
          >
            {backbones.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Targeted add-on (filter)</label>
          <select 
            style={{ width: "100%", marginTop: 4, padding: "6px 8px", fontSize: 13, border: "1px solid #cbd5e1", borderRadius: 6 }}
            value={addonFilter}
            onChange={(e) => setAddonFilter(e.target.value)}
          >
            {addons.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Regimen (scored by the model)</label>
        <select 
          style={{ width: "100%", marginTop: 4, padding: "6px 8px", fontSize: 13, border: "1px solid #cbd5e1", borderRadius: 6 }} 
          value={displayedRegimen[0]}
          onChange={(e) => setSelectedRegimen(e.target.value)}
        >
          {filteredEntries.map(e => <option key={e[0]} value={e[0]}>{e[0]}</option>)}
          {filteredEntries.length === 0 && <option value="None Found">None Found</option>}
        </select>
      </div>

      {/* Selected Stats Panel */}
      <div style={{ background: "#f8fafc", padding: 14, borderRadius: 8, border: "1px solid #e2e8f0" }}>
        <p style={{ margin: "0 0 12px 0", fontSize: 13 }}><b>Selected regimen:</b> {displayedRegimen[0]}</p>
        
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Selected pCR</p>
            <p style={{ margin: "4px 0 0 0", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{selectedScore}%</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Δ vs Standard</p>
            <p style={{ margin: "4px 0 0 0", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{delta >= 0 ? `+${delta}` : delta}%</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Standard pCR</p>
            <p style={{ margin: "4px 0 0 0", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{baseScore}%</p>
          </div>
        </div>
        <p style={{ margin: "14px 0 0 0", fontSize: 11, color: "#94a3b8" }}>Using precomputed cohort predictions from the selected JSON.</p>
      </div>

      {/* Evidence-Weighted Blending Demo */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={showBlend} 
            onChange={(e) => setShowBlend(e.target.checked)} 
            style={{ cursor: "pointer" }}
          />
          Show evidence-weighted blending (demo only)
        </label>

        {showBlend && (
          <div style={{ marginTop: 12, padding: 14, background: "#f1f5f9", borderRadius: 8, border: "1px dashed #cbd5e1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, color: "#475569" }}>
              <span>Evidence weight (demo): {blendWeight.toFixed(2)}</span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={blendWeight} 
              onChange={(e) => setBlendWeight(parseFloat(e.target.value))}
              style={{ width: "100%", cursor: "pointer", accentColor: "#2563eb" }}
            />
            
            <p style={{ marginTop: 12, fontSize: 13, color: "#334155" }}>
              <b>Evidence-weighted (demo):</b> <code style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4, color: "#0f172a" }}>{blendedScore.toFixed(1)}%</code>
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#64748b" }}>
              Demo visualization only; not a validated clinical mixing model.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}