// frontend/src/components/MechanisticAlignment.jsx
export default function MechanisticAlignment({ drivers, omics, regimens }) {
  if (!drivers || !regimens || !regimens.pcr_probability_by_regimen) return null;

  const entries = Object.entries(regimens.pcr_probability_by_regimen);
  const sorted = [...entries].sort((a, b) => Number(b[1]) - Number(a[1]));
  const standard = sorted[0] || ["Unknown", 0]; 
  const parp = sorted[1] || standard;
  const pi3k = sorted[2] || standard;

  const stdScore = Math.round(Number(standard[1]) * 100);
  const parpScore = Math.round(Number(parp[1]) * 100);
  const pi3kScore = Math.round(Number(pi3k[1]) * 100);
  const parpDelta = parpScore - stdScore;
  const pi3kDelta = pi3kScore - stdScore;

  // SAFE MATH: Forces value to be a number before toFixed to prevent crashes
  const formatZ = (val) => {
    if (isNaN(Number(val))) return "";
    return Number(val) >= 0 ? `+${Number(val).toFixed(2)}` : Number(val).toFixed(2);
  };
  
  const getZ = (key) => omics?.mrna?.[key] !== undefined ? `(z=${formatZ(omics.mrna[key])})` : "";
  
  const findDriverVal = (substr) => {
    if (!drivers || typeof drivers !== 'object') return "Unknown";
    const match = Object.keys(drivers).find(k => k.toLowerCase().includes(substr));
    return match ? drivers[match] : "Unknown";
  };

  return (
    <div>
      <ul style={{ paddingLeft: 16, margin: "0 0 16px 0", color: "var(--text-main)", fontSize: "14.5px", lineHeight: "1.6" }}>
        <li style={{ marginBottom: 10 }}>
          These notes provide plausibility context for the model's regimen ranking using baseline signature signals. They are heuristic (not causal proof) and are shown to make the pCR bars easier to interpret.
        </li>
        <li>
          <b>Baseline comparator (Standard / trial arm):</b> {standard[0]} → predicted pCR {stdScore}%. Scenario uplifts are reported relative to this baseline.
        </li>
      </ul>

      <details className="st-expander">
        <summary>Show more rationale</summary>
        <div className="st-expander-content">
          <ul style={{ paddingLeft: 16, margin: 0, color: "var(--text-main)", fontSize: "14px", lineHeight: "1.6" }}>
            <li style={{ marginBottom: 12 }}>
              <b>HRD / DNA-repair signal:</b> {findDriverVal("hrd")} {getZ("hrd")} suggests a DNA-repair vulnerability; within the scored regimen library, the best PARP-backed option reaches <b>{parpScore}%</b> (Δ {parpDelta >= 0 ? `+${parpDelta}` : parpDelta}% vs Standard): <i>{parp[0]}</i>.
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>PI3K/AKT pathway signal:</b> {findDriverVal("pi3k")} {getZ("pi3k_akt_mtor")} supports exploring a PI3K/AKT add-on; the best PI3K/AKT-backed option reaches <b>{pi3kScore}%</b> (Δ {pi3kDelta >= 0 ? `+${pi3kDelta}` : pi3kDelta}% vs Standard): <i>{pi3k[0]}</i>.
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>Immune cytotoxic context:</b> {findDriverVal("immune")} {getZ("immune_cytotoxic")} is used as plausibility context for immunotherapy add-ons (e.g., pembrolizumab). Lower immune cytotoxicity can coincide with lower ranking of checkpoint add-ons (heuristic).
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>Proliferation context:</b> {findDriverVal("ki67")} {getZ("proliferation")} can be consistent with stronger chemotherapy responsiveness signals; taxane-based backbones often appear among top-ranked regimens (heuristic).
            </li>
            <li style={{ color: "var(--text-muted)", fontSize: "13.5px" }}>
              Heuristic interpretation only; the model outputs pCR probabilities conditioned on baseline signatures + clinical covariates.
            </li>
          </ul>
        </div>
      </details>
    </div>
  );
}