// src/components/ResponseCard.jsx
import { useState } from "react";

export default function ResponseCard({ regimens }) {
  const [scenario, setScenario] = useState("standard");

  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const preds = Object.entries(regimens.pcr_probability_by_regimen);
  if (preds.length === 0) return null;

  let best = preds[0];
  preds.forEach((e) => {
    if (e[1] > best[1]) best = e;
  });

  const bestRegimen = best[0];
  const bestScore = Math.round(best[1] * 100);

  // TEMP static values (will connect later)
  const scenarioScores = {
    standard: bestScore,
    parp: Math.max(bestScore - 2, 0),
    pi3k: Math.min(bestScore + 2, 100)
  };

  return (
    <div className="response-card">
      <h3>Predicted pCR (best ranked)</h3>
      <div className="pcr-score">{bestScore}%</div>
      <p className="pcr-sub">Top regimen: {bestRegimen}</p>

      {/* WHAT-IF BUTTONS */}
      <div className="whatif-row">
        <button
          className={scenario === "standard" ? "whatif active" : "whatif"}
          onClick={() => setScenario("standard")}
        >
          Standard
        </button>

        <button
          className={scenario === "parp" ? "whatif active" : "whatif"}
          onClick={() => setScenario("parp")}
        >
          + PARP
        </button>

        <button
          className={scenario === "pi3k" ? "whatif active" : "whatif"}
          onClick={() => setScenario("pi3k")}
        >
          + PI3K
        </button>
      </div>

      {/* SCENARIO BARS */}
      <div className="scenario-bars">
        {Object.entries(scenarioScores).map(([key, val]) => (
          <div key={key} className="scenario-row">
            <span className="scenario-label">
              {key === "standard" ? "Standard" : key === "parp" ? "+ PARP" : "+ PI3K"}
            </span>

            <div className="scenario-bar-bg">
              <div
                className="scenario-bar-fill"
                style={{
                  width: `${val}%`,
                  opacity: scenario === key ? 1 : 0.4
                }}
              />
            </div>

            <span className="scenario-val">{val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}