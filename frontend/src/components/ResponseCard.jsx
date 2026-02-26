// frontend/src/components/ResponseCard.jsx

export default function ResponseCard({ regimens, activeScenario }) {
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(regimens.pcr_probability_by_regimen);
  if (entries.length === 0) return null;

  // Replicating the Streamlit sorting/fallback logic
  const sorted = [...entries].sort((a, b) => Number(b[1]) - Number(a[1]));
  const standard = sorted[0] || ["Unknown", 0];
  const parp = sorted[1] || standard; 
  const pi3k = sorted[2] || standard; 

  const scenarioMap = {
    standard: standard,
    parp: parp,
    pi3k: pi3k
  };

  const activeData = scenarioMap[activeScenario] || standard;
  const activeScore = Math.round(Number(activeData[1]) * 100);
  const activeName = activeData[0];

  const stdScore = Math.round(Number(standard[1]) * 100);
  const parpScore = Math.round(Number(parp[1]) * 100);
  const pi3kScore = Math.round(Number(pi3k[1]) * 100);

  const parpDelta = parpScore - stdScore;
  const pi3kDelta = pi3kScore - stdScore;

  return (
    <div>
      {/* 1. HERO TILE */}
      <div className="hero">
        <div className="hero-badge">Predicted pCR (best ranked)</div>
        <div className="hero-kpi">{activeScore}%</div>
        <div className="hero-sub">Conditioned on baseline mRNA/RPPA signatures + clinical context (demo).</div>
        <div className="hero-reg">Top regimen: {activeName}</div>
      </div>

      {/* 2. SCENARIO BARS (Phantom buttons removed from here!) */}
      <div className="scenario-bars" style={{ marginTop: "24px" }}>
        
        <div className="scenario-row">
          <span style={{ width: "100px", fontWeight: 700, fontSize: "14px" }}>Standard</span>
          <div className={`scenario-bar-bg ${activeScenario === "standard" ? "active-bar" : ""}`}>
            <div className="scenario-bar-fill" style={{ width: `${stdScore}%` }}></div>
          </div>
          <span className="scenario-val">{stdScore}%</span>
        </div>

        <div className="scenario-row">
          <span style={{ width: "100px", fontWeight: 700, fontSize: "14px" }}>+ PARP</span>
          <div className={`scenario-bar-bg ${activeScenario === "parp" ? "active-bar" : ""}`}>
            <div className="scenario-bar-fill" style={{ width: `${parpScore}%` }}></div>
          </div>
          <span className="scenario-val">{parpScore}%</span>
        </div>

        <div className="scenario-row">
          <span style={{ width: "100px", fontWeight: 700, fontSize: "14px" }}>+ PI3K/AKT</span>
          <div className={`scenario-bar-bg ${activeScenario === "pi3k" ? "active-bar" : ""}`}>
            <div className="scenario-bar-fill" style={{ width: `${pi3kScore}%` }}></div>
          </div>
          <span className="scenario-val">{pi3kScore}%</span>
        </div>

      </div>

      {/* 3. WHAT-IF UPLIFT SECTION */}
      <div style={{ marginTop: "24px", borderTop: "1px solid var(--border-main)", paddingTop: "16px" }}>
        <p style={{ fontSize: "14.5px", fontWeight: 700, margin: "0 0 12px 0", color: "var(--text-main)" }}>What-if uplift vs Standard</p>
        
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "4px" }}>Add PARP inhibitor</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>{parpDelta >= 0 ? `+${parpDelta}` : parpDelta}%</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "4px" }}>Add PI3K/AKT inhibitor</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>{pi3kDelta >= 0 ? `+${pi3kDelta}` : pi3kDelta}%</div>
          </div>
        </div>
        
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginTop: "16px", lineHeight: "1.5" }}>
          Selected scenario: <b style={{ color: "var(--text-main)", textTransform: "uppercase" }}>{activeScenario}</b>. Bars show best regimen per scenario (demo).
        </p>
      </div>

    </div>
  );
}