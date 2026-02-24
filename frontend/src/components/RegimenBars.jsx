export default function RegimenBars({ regimens }) {
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(
    regimens.pcr_probability_by_regimen
  );

  return (
    <div className="card">
      <h3>Regimen Leaderboard</h3>

      {/* SCROLL CONTAINER */}
      <div className="regimen-list">
        {entries.map(([name, value]) => (
          <div key={name} style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "13px", marginBottom: "4px" }}>
              {name}
            </div>

            <div
              style={{
                background: "#e5e7eb",
                height: "8px",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${value * 100}%`,
                  background:
                    name === regimens.top_regimen
                      ? "#2563eb"
                      : "#64748b",
                  height: "100%",
                }}
              />
            </div>

            <div style={{ fontSize: "12px", opacity: 0.7 }}>
              {(value * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}