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
  const standard = sorted[0];
  const parp = sorted[1] || sorted[0];
  const pi3k = sorted[2] || sorted[0];

  const stdScore = Math.round(standard[1] * 100);
  const parpDelta = Math.round(parp[1] * 100) - stdScore;
  const pi3kDelta = Math.round(pi3k[1] * 100) - stdScore;

  const Bar = ({ id, label, value }) => {
    const isActive = activeScenario === id;
    return (
      <div className="scenario-row">
        <span>{label}</span>
        <div 
          className="scenario-bar-bg" 
          style={{ 
            boxShadow: isActive ? "0 0 0 2px #60a5fa" : "none",
            border: isActive ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.3)" 
          }}
        >
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
    <div className="response-card">
      <h3>Predicted pCR (best ranked)</h3>
      <div className="pcr-score">{bestScore}%</div>
      <div className="pcr-sub">
        Conditioned on baseline mRNA/RPPA signatures + clinical context (demo).
      </div>
      
      <div style={{ marginTop: 14, padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13 }}>
        <span style={{ opacity: 0.8 }}>Top regimen:</span> <b>{topRegimen}</b>
      </div>

      <div className="whatif-row">
        <button className={`whatif ${activeScenario === "standard" ? "active" : ""}`} onClick={() => setActiveScenario("standard")}>Standard</button>
        <button className={`whatif ${activeScenario === "parp" ? "active" : ""}`} onClick={() => setActiveScenario("parp")}>+ PARP</button>
        <button className={`whatif ${activeScenario === "pi3k" ? "active" : ""}`} onClick={() => setActiveScenario("pi3k")}>+ PI3K</button>
      </div>

      <div className="scenario-bars" style={{ marginTop: 16 }}>
        <Bar id="standard" label="Standard" value={standard[1]} />
        <Bar id="parp" label="+ PARP" value={parp[1]} />
        <Bar id="pi3k" label="+ PI3K/AKT" value={pi3k[1]} />
      </div>

      <div style={{ marginTop: 24, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, border: "1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
          What-if uplift vs Standard
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: activeScenario === "parp" ? "rgba(96, 165, 250, 0.2)" : "rgba(0,0,0,0.15)", padding: "8px 10px", borderRadius: 8, border: activeScenario === "parp" ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Add PARP inhibitor</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{parpDelta > 0 ? `+${parpDelta}` : parpDelta}%</div>
          </div>
          <div style={{ flex: 1, background: activeScenario === "pi3k" ? "rgba(96, 165, 250, 0.2)" : "rgba(0,0,0,0.15)", padding: "8px 10px", borderRadius: 8, border: activeScenario === "pi3k" ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Add PI3K/AKT inhibitor</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{pi3kDelta > 0 ? `+${pi3kDelta}` : pi3kDelta}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}