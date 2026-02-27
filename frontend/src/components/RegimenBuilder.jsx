// frontend/src/components/RegimenBuilder.jsx
import { useState, useEffect } from "react";

export default function RegimenBuilder({ regimens, activeScenario = "standard", setActiveScenario }) {
  const [backboneFilter, setBackboneFilter] = useState("Any");
  const [addonFilter, setAddonFilter] = useState("Any");
  const [selectedRegimen, setSelectedRegimen] = useState("");

  const [showBlend, setShowBlend] = useState(false);
  const [blendWeight, setBlendWeight] = useState(0.45);

  useEffect(() => {
    setBackboneFilter("Any");
    setAddonFilter("Any");
    setSelectedRegimen("");
  }, [activeScenario]);

  if (!regimens || !regimens.pcr_probability_by_regimen) return null;
  const entries = Object.entries(regimens.pcr_probability_by_regimen);
  if (!entries.length) return null;

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const standard = sorted[0] || ["Unknown", 0];
  const parp = sorted[1] || standard;
  const pi3k = sorted[2] || standard;

  const bbSet = new Set();
  const adSet = new Set();

  entries.forEach(([regimenName]) => {
    const toks = regimenName.split('+').map(t => t.trim()).filter(Boolean);
    if (toks.length > 0) bbSet.add(toks[0]);
    for (let i = 1; i < toks.length; i++) adSet.add(toks[i]);
  });

  const backbones = ["Any", ...Array.from(bbSet).sort()];
  const addons = ["Any", ...Array.from(adSet).sort()];

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

  const scenarioMap = { standard, parp, pi3k };
  const defaultForScenario = scenarioMap[activeScenario] || standard;

  let currentSelection;
  if (backboneFilter === "Any" && addonFilter === "Any") {
    currentSelection = defaultForScenario;
  } else {
    currentSelection = filteredEntries.length > 0 ? filteredEntries[0] : ["None Found", 0];
  }

  const manualMatch = filteredEntries.find(e => e[0] === selectedRegimen);
  const displayedRegimen = manualMatch || currentSelection || ["Unknown", 0];

  const baseScore = Math.round((standard[1] || 0) * 100);
  const selectedScore = Math.round((displayedRegimen[1] || 0) * 100);
  const delta = selectedScore - baseScore;
  const blendedScore = ((1 - blendWeight) * baseScore) + (blendWeight * selectedScore);

  const handleScenarioChange = (scenario) => {
    if (setActiveScenario) setActiveScenario(scenario);
  };

  return (
    <div className="regimen-builder">
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: 10, textTransform: "uppercase" }}>
          THERAPY WHAT-IF
        </label>
        
        {/* The new Segmented Control Toggle */}
        <div className="segmented-control">
          <label>
            <input type="radio" name="scenario" checked={activeScenario === "standard"} onChange={() => handleScenarioChange("standard")} />
            Standard Baseline
          </label>
          <label>
            <input type="radio" name="scenario" checked={activeScenario === "parp"} onChange={() => handleScenarioChange("parp")} />
            + PARP Inhibitor
          </label>
          <label>
            <input type="radio" name="scenario" checked={activeScenario === "pi3k"} onChange={() => handleScenarioChange("pi3k")} />
            + PI3K/AKT Inhibitor
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase" }}>Chemo backbone</label>
          <select style={{ width: "100%" }} value={backboneFilter} onChange={(e) => setBackboneFilter(e.target.value)}>
            {backbones.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase" }}>Targeted add-on</label>
          <select style={{ width: "100%" }} value={addonFilter} onChange={(e) => setAddonFilter(e.target.value)}>
            {addons.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block", textTransform: "uppercase" }}>Regimen Library</label>
        <select style={{ width: "100%" }} value={displayedRegimen[0]} onChange={(e) => setSelectedRegimen(e.target.value)}>
          {filteredEntries.map(e => <option key={e[0]} value={e[0]}>{e[0]}</option>)}
          {filteredEntries.length === 0 && <option value="None Found">None Found</option>}
        </select>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: 14, borderRadius: 8, border: "1px solid var(--border-main)" }}>
        <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "var(--text-main)" }}><b>Selected regimen:</b> <span style={{ color: "var(--accent-blue)" }}>{displayedRegimen[0]}</span></p>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Selected pCR</p>
            <p style={{ margin: "4px 0 0 0", fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>{selectedScore}%</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Δ vs Standard</p>
            <p style={{ margin: "4px 0 0 0", fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>{delta >= 0 ? `+${delta}` : delta}%</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Standard pCR</p>
            <p style={{ margin: "4px 0 0 0", fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>{baseScore}%</p>
          </div>
        </div>
      </div>

    </div>
  );
}