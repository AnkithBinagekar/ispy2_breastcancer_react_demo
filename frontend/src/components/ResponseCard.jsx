export default function ResponseCard({ regimens }) {
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  const preds = Object.entries(regimens.pcr_probability_by_regimen);

  if (preds.length === 0) return null;

  let best = preds[0];
  preds.forEach(e => {
    if (e[1] > best[1]) best = e;
  });

  const bestRegimen = best[0];
  const bestScore = Math.round(best[1] * 100);

  return (
    <div style={{
      background: "#1f1f1f",
      padding: 20,
      borderRadius: 8,
      width: 260,
      marginTop: 20,
      color: "white"
    }}>
      <h3>Predicted pCR (best ranked)</h3>
      <h1>{bestScore}%</h1>
      <p>Top regimen: {bestRegimen}</p>
    </div>
  );
}
