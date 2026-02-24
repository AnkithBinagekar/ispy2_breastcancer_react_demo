import { useState } from "react";

export default function RegimenBuilder({ regimens }) {
  const [scenario, setScenario] = useState("standard");

  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(regimens.pcr_probability_by_regimen);

  // pick top as selected (for now)
  let best = entries[0];
  entries.forEach(e => {
    if (e[1] > best[1]) best = e;
  });

  const selectedName = best[0];
  const base = Math.round(best[1] * 100);

  const scenarioScore = {
    standard: base,
    parp: Math.max(base - 2, 0),
    pi3k: Math.min(base + 2, 100)
  };

  return (
    <div>
      <h3>Regimen Builder (What-If)</h3>

      {/* Scenario selector */}
<div className="regimen-builder">
  <button
    className={scenario === "standard" ? "rb-btn active" : "rb-btn"}
    onClick={() => setScenario("standard")}
  >
    Standard (trial arm baseline)
  </button>

  <button
    className={scenario === "parp" ? "rb-btn active" : "rb-btn"}
    onClick={() => setScenario("parp")}
  >
    Add PARP inhibitor
  </button>

  <button
    className={scenario === "pi3k" ? "rb-btn active" : "rb-btn"}
    onClick={() => setScenario("pi3k")}
  >
    Add PI3K/AKT inhibitor
  </button>
</div>

      {/* Selected regimen */}
      <div style={{ marginTop: 14, fontSize: 13 }}>
        <p><b>Selected regimen:</b> {selectedName}</p>
        <p><b>Selected regimen pCR:</b> {scenarioScore[scenario]}%</p>
        <p><b>Δ pCR vs Standard:</b> {scenarioScore[scenario] - base}%</p>
      </div>
    </div>
  );
}