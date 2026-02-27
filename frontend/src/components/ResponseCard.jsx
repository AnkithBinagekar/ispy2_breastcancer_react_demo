// frontend/src/components/ResponseCard.jsx

export default function ResponseCard({ regimens, activeScenario }) {
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;
  const entries = Object.entries(regimens.pcr_probability_by_regimen);
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => Number(b[1]) - Number(a[1]));
  const standard = sorted[0] || ["Unknown", 0];
  const parp = sorted[1] || standard;
  const pi3k = sorted[2] || standard;

  const scenarioMap = { standard, parp, pi3k };
  const activeData = scenarioMap[activeScenario] || standard;
  const activeScore = Math.round(Number(activeData[1]) * 100);
  const activeName = activeData[0];

  return (
    <div style={{
      background: "var(--hero-bg)",
      borderRadius: "12px",
      height: "100%",
      minHeight: "260px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px 24px",
      color: "white",
      boxShadow: "0 10px 40px rgba(37, 99, 235, 0.35)"
    }}>
      <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: "16px" }}>
        Highest Predicted pCR
      </div>
      
      <div style={{ fontSize: "84px", fontWeight: 900, lineHeight: 1, marginBottom: "24px", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        {activeScore}%
      </div>
      
      <div style={{ fontSize: "15px", fontWeight: 700, background: "rgba(0,0,0,0.25)", padding: "12px 24px", borderRadius: "999px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
        {activeName}
      </div>
    </div>
  );
}