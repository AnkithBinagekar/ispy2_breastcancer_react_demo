// frontend/src/components/ResponseCard.jsx

export default function ResponseCard({ regimens, activeScenario, setActiveScenario }) {
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(regimens.pcr_probability_by_regimen);
  if (!entries.length) return null;

  let best = entries[0];
  entries.forEach((e) => {
    if (e[1] > best[1]) best = e;
  });

  const bestScore = Math.round(best[1] * 100);
  const topRegimen = best[0];

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const standard = sorted[0] || ["Unknown", 0];
  const parp = sorted[1] || standard;
  const pi3k = sorted[2] || standard;

  const stdScore = Math.round(standard[1] * 100);
  const parpDelta = Math.round(parp[1] * 100) - stdScore;
  const pi3kDelta = Math.round(pi3k[1] * 100) - stdScore;

  const handleScenarioChange = (scenario) => {
    if (setActiveScenario) setActiveScenario(scenario);
  };

  const Bar = ({ id, label, value }) => {
    const isActive = activeScenario === id;
    return (
      <div className="scenario-row">
        <span>{label}</span>
        <div className={`scenario-bar-bg ${isActive ? "active-bar" : ""}`}>
          <div
            className="scenario-bar-fill"
            style={{ width: `${Math.round(value * 100)}%` }}
          />
        </div>
        <span className="scenario-val">
          {Math.round(value * 100)}%
        </span>
      </div>
    );
  };

  return (
    <div>
      {/* Streamlit Hero Box */}
      <div className="hero">
        <div className="hero-badge">Predicted pCR (best ranked)</div>
        <div className="hero-kpi">{bestScore}%</div>
        <div className="hero-sub">
          Conditioned on baseline mRNA/RPPA signatures + clinical context (demo).
        </div>
        <div className="hero-reg">
          <span style={{ opacity: 0.8, fontWeight: 500 }}>Top regimen:</span> {topRegimen}
        </div>
      </div>

      <div className="whatif-row">
        <button className={`whatif ${activeScenario === "standard" ? "active" : ""}`} onClick={() => handleScenarioChange("standard")}>Standard</button>
        <button className={`whatif ${activeScenario === "parp" ? "active" : ""}`} onClick={() => handleScenarioChange("parp")}>+ PARP</button>
        <button className={`whatif ${activeScenario === "pi3k" ? "active" : ""}`} onClick={() => handleScenarioChange("pi3k")}>+ PI3K</button>
      </div>

      <div className="scenario-bars">
        <Bar id="standard" label="Standard" value={standard[1]} />
        <Bar id="parp" label="+ PARP" value={parp[1]} />
        <Bar id="pi3k" label="+ PI3K/AKT" value={pi3k[1]} />
      </div>

      {/* Streamlit Impact Box */}
      <div className="impactBox">
        <div className="impactTitle">What-if uplift vs Standard</div>
        <div className="impactRow">
          <div className={`impactItem ${activeScenario === "parp" ? "active" : ""}`}>
            <span className="impactLabel">Add PARP inhibitor</span>
            <span className="impactVal">{parpDelta > 0 ? `+${parpDelta}` : parpDelta}%</span>
          </div>
          <div className={`impactItem ${activeScenario === "pi3k" ? "active" : ""}`}>
            <span className="impactLabel">Add PI3K/AKT inhibitor</span>
            <span className="impactVal">{pi3kDelta > 0 ? `+${pi3kDelta}` : pi3kDelta}%</span>
          </div>
        </div>
        <div className="impactFoot">
          Selected scenario: <b>{activeScenario.toUpperCase()}</b>. Bars show best regimen per scenario (demo).
        </div>
      </div>
    </div>
  );
}