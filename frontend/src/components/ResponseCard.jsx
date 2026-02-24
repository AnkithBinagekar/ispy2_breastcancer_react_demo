// frontend/src/components/ResponseCard.jsx

export default function ResponseCard({ regimens }) {
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(regimens.pcr_probability_by_regimen);

  if (!entries.length) return null;

  // best ranked
  let best = entries[0];
  entries.forEach((e) => {
    if (e[1] > best[1]) best = e;
  });

  const bestScore = Math.round(best[1] * 100);
  const topRegimen = best[0];

  // For now: derive simple what-if from top 3
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const standard = sorted[0];
  const parp = sorted[1] || sorted[0];
  const pi3k = sorted[2] || sorted[0];

  const Bar = ({ label, value }) => (
    <div className="scenario-row">
      <span>{label}</span>

      <div className="scenario-bar-bg">
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

  return (
    <div className="response-card">

      <h3>Predicted pCR (best ranked)</h3>

      <div className="pcr-score">{bestScore}%</div>

      <div className="pcr-sub">
        Conditioned on baseline mRNA signatures + clinical context
      </div>

      <div className="pcr-sub" style={{ marginTop: 6 }}>
        Top regimen: <b>{topRegimen}</b>
      </div>

      {/* What-if buttons (visual only for now) */}
      <div className="whatif-row">
        <button className="whatif active">Standard</button>
        <button className="whatif">+ PARP</button>
        <button className="whatif">+ PI3K</button>
      </div>

      {/* Scenario Bars */}
      <div className="scenario-bars">
        <Bar label="Standard" value={standard[1]} />
        <Bar label="+ PARP" value={parp[1]} />
        <Bar label="+ PI3K" value={pi3k[1]} />
      </div>

    </div>
  );
}