// frontend/src/components/MechanisticEvidence.jsx

import { useState } from "react";

export default function MechanisticEvidence() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 16 }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => setOpen(!open)}
      >
        <h3 className="me-header">Mechanistic Evidence Layer</h3>
        <span style={{ fontSize: 13 }}>{open ? "▼" : "▶"}</span>
      </div>

      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
        Investor-friendly bridge between evidence and scenario deltas.
      </p>

      {open && (
        <div style={{ marginTop: 10, fontSize: 13 }}>

          <ul>
            <li><b>HRD / DNA repair ↑</b> → PARP inhibitor plausibility</li>
            <li><b>PI3K axis ↑</b> → PI3K/AKT inhibitor plausibility</li>
            <li><b>Immune cytotoxic ↓</b> → limited IO benefit</li>
            <li><b>Proliferation ↑</b> → chemo sensitivity context</li>
          </ul>

          <p style={{ fontSize: 12, opacity: 0.7 }}>
            Heuristic interpretation only; not causal proof.
          </p>

        </div>
      )}

    </div>
  );
}