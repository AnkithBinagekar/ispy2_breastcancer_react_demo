// frontend/src/components/RegimenBars.jsx

export default function RegimenBars({ regimens }) {
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(regimens.pcr_probability_by_regimen)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h3>Regimen Leaderboard</h3>
      <div className="regimen-list">
        {entries.map(([name, value], idx) => (
          <div key={name} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, marginBottom: 6, fontWeight: 600, color: "#334155" }}>
              {idx === 0 && "★ "} {name}
            </div>
            {/* Custom light-theme bars */}
            <div style={{ background: "#e2e8f0", height: 8, borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  background: "#3b82f6",
                  height: "100%",
                  width: `${Math.round(value * 100)}%`,
                  borderRadius: 999
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, textAlign: "right", fontWeight: 600 }}>
              {(value * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}