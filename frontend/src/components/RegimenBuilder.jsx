// frontend/src/components/RegimenBuilder.jsx

import { useState } from "react";

export default function RegimenBuilder({ regimens }) {
  const [scenario, setScenario] = useState("standard");

  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(regimens.pcr_probability_by_regimen);

  if (!entries.length) return null;

  // sort by pCR descending
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const standard = sorted[0];
  const parp = sorted[1] || sorted[0];
  const pi3k = sorted[2] || sorted[0];

  const scenarioMap = {
    standard: standard,
    parp: parp,
    pi3k: pi3k
  };

  const selected = scenarioMap[scenario];

  const baseScore = Math.round(standard[1] * 100);
  const selectedScore = Math.round(selected[1] * 100);
  const delta = selectedScore - baseScore;

  return (
    <div className="regimen-builder">

      <h3>Regimen Builder (What-If)</h3>

      {/* Scenario selector */}
      <div className="rb-scenario-row">

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

      {/* Selected regimen summary */}
      <div style={{ marginTop: 14 }}>

        <p><b>Selected regimen:</b> {selected[0]}</p>

        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>

          <div>
            <p><b>Selected pCR</b></p>
            <p>{selectedScore}%</p>
          </div>

          <div>
            <p><b>Δ vs Standard</b></p>
            <p>{delta >= 0 ? `+${delta}` : delta}%</p>
          </div>

          <div>
            <p><b>Standard pCR</b></p>
            <p>{baseScore}%</p>
          </div>

        </div>

      </div>

    </div>
  );
}