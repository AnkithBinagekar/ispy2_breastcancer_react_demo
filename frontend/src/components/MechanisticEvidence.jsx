import { useState } from "react";

export default function MechanisticEvidence() {
  const [open, setOpen] = useState(false);

  return (
    <div>
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
        <span style={{ fontSize: 14 }}>{open ? "▼" : "▶"}</span>
      </div>

      {open && (
        <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>
          <p>
            Compact bridge between baseline molecular signals and scenario what-if
            deltas. Heuristic only (not causal proof).
          </p>

          <ul>
            <li>HRD ↑ → PARP sensitivity</li>
            <li>PI3K axis ↑ → AKT/PI3K inhibitor benefit</li>
            <li>Immune cytotoxic ↓ → limited IO benefit</li>
          </ul>
        </div>
      )}
    </div>
  );
}