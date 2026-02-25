// frontend/src/components/MechanisticEvidence.jsx
import { useState } from "react";

export default function MechanisticEvidence() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 10 }}
        onClick={() => setOpen(!open)}
      >
        <h3 style={{ borderBottom: "none", margin: 0, padding: 0 }}>Mechanistic Evidence Layer</h3>
        <span style={{ fontSize: 12, color: "#64748b" }}>{open ? "▼" : "▶"}</span>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px 0" }}>
        A compact, investor-friendly bridge between baseline evidence signals and the scenario what-if deltas. Heuristic only (not causal proof).
      </p>

      {open && (
        <div style={{ fontSize: 13, color: "#334155", background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
          <ul style={{ paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
            <li><b>HRD / DNA repair ↑</b> → PARP inhibitor plausibility</li>
            <li><b>PI3K axis ↑</b> → PI3K/AKT inhibitor plausibility</li>
            <li><b>Immune cytotoxic ↓</b> → limited IO benefit</li>
            <li><b>Proliferation ↑</b> → chemo sensitivity context</li>
          </ul>
        </div>
      )}
    </div>
  );
}