// frontend/src/components/AuditProvenance.jsx

import { useState } from "react";

export default function AuditProvenance() {
  const [open, setOpen] = useState(false);

  return (
    <div className="audit-provenance">

      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <h3>Audit & Provenance</h3>
        <span style={{ fontSize: 13 }}>{open ? "▼" : "▶"}</span>
      </div>

      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Data lineage & model metadata for auditability.
      </p>

      {open && (
        <div style={{ marginTop: 10, fontSize: 13 }}>

          <p><b>Modalities used:</b> mrna, rppa</p>
          <p><b>Ensemble method:</b> —</p>
          <p><b>Feature provenance:</b> — (can be filled later)</p>

        </div>
      )}

    </div>
  );
}