// frontend/src/components/DriversPanel.jsx
export default function DriversPanel({ drivers, omics }) {
  if (!drivers || Object.keys(drivers).length === 0) return null;

  const getChipClass = (value) => {
    if (typeof value === "string") {
      const valLower = value.toLowerCase();
      if (valLower.includes("high") || valLower.includes("activated")) return "chip-high";
      if (valLower.includes("low")) return "chip-low";
    }
    return "chip-mid";
  };

  // SAFE MATH: Forces Number wrapper
  const formatZ = (val) => {
    if (val === undefined || val === null || isNaN(Number(val))) return "";
    return Number(val) >= 0 ? `+${Number(val).toFixed(2)}` : Number(val).toFixed(2);
  };

  const getLabel = (key) => {
    const k = key.toLowerCase();
    if (k.includes("hrd")) return "HRD / DNA repair";
    if (k.includes("proliferation") || k.includes("ki67")) return "Proliferation";
    if (k.includes("emt")) return "EMT";
    if (k.includes("immune")) return "Immune cytotoxic";
    if (k.includes("pi3k")) return "PI3K axis";
    if (k.includes("pdl1")) return "PD-L1";
    return key.replace(/_/g, " ");
  };

  const getOmicsKey = (key) => {
    const k = key.toLowerCase();
    if (k.includes("hrd")) return "hrd";
    if (k.includes("proliferation") || k.includes("ki67")) return "proliferation";
    if (k.includes("emt")) return "emt";
    if (k.includes("immune")) return "immune_cytotoxic";
    if (k.includes("pi3k")) return "pi3k_akt_mtor";
    if (k.includes("pdl1")) return "pdl1";
    return key.toLowerCase();
  };

  return (
    <div style={{ marginTop: 14 }}>
      <strong style={{ fontSize: "14.5px", color: "var(--text-main)" }}>Top Molecular Drivers (signature-level)</strong>
      
      <div style={{ marginTop: 10 }}>
        {Object.entries(drivers).map(([key, value]) => {
          const label = getLabel(key);
          const omicsKey = getOmicsKey(key);
          const rawZ = omics?.mrna?.[omicsKey];
          const zScore = rawZ !== undefined ? formatZ(rawZ) : "";
          
          return (
            <div key={key} className="driver-row">
              <span>{label}</span>
              <div className="driver-meta" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className={`chip ${getChipClass(value)}`}>{value}</span>
                <span style={{ fontFamily: "monospace", fontSize: "13.5px", color: "var(--text-main)", width: "65px", textAlign: "right", fontWeight: 700 }}>
                  {zScore ? `z=${zScore}` : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <details className="st-expander" style={{ marginTop: 16 }}>
        <summary>Key calls (optional)</summary>
        <div className="st-expander-content" style={{ paddingBottom: 14 }}>
          <ul style={{ paddingLeft: 16, margin: "0 0 14px 0", color: "var(--text-main)", fontSize: "14px", lineHeight: "1.8" }}>
            {Object.entries(drivers).map(([key, value]) => {
              const label = getLabel(key);
              const omicsKey = getOmicsKey(key);
              const rawZ = omics?.mrna?.[omicsKey];
              const zScore = rawZ !== undefined ? `z=${formatZ(rawZ)}` : "";
              return (
                <li key={key} style={{ marginBottom: 4 }}>
                  • {label}: {value} {zScore ? `(${zScore})` : ""}
                </li>
              );
            })}
          </ul>
          <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
            Signature-level signals (not per-gene/protein).
          </div>
        </div>
      </details>
    </div>
  );
}