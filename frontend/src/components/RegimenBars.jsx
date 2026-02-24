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
          <div key={name} style={{ marginBottom: 12 }}>

            <div style={{ fontSize: 13, marginBottom: 4 }}>
              {idx === 0 && "★ "} {name}
            </div>

            <div className="scenario-bar-bg">
              <div
                className="scenario-bar-fill"
                style={{
                  width: `${Math.round(value * 100)}%`
                }}
              />
            </div>

            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
              {(value * 100).toFixed(1)}%
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}