// frontend/src/components/AuditProvenance.jsx
import { useState } from "react";

export default function AuditProvenance() {
  const [open, setOpen] = useState(false);

  return (
    <div className="audit-provenance">
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 10 }}
      >
        <h3 style={{ borderBottom: "none", margin: 0, padding: 0 }}>Audit & Provenance</h3>
        <span style={{ fontSize: 12, color: "#64748b" }}>{open ? "▼" : "▶"}</span>
      </div>

      <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px 0" }}>
        This section surfaces data lineage fields (IDs, modalities used, model metadata) for auditability. Hidden by default in pitch; keep for credibility.
      </p>

      {open && (
        <div style={{ fontSize: 13, color: "#334155", background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
          <p style={{ margin: "0 0 4px 0" }}><b>Modalities used:</b> mrna, rppa</p>
          <p style={{ margin: "0 0 4px 0" }}><b>Ensemble method:</b> —</p>
          <p style={{ margin: 0 }}><b>Feature provenance:</b> — (can be filled by builder patch later).</p>
        </div>
      )}
    </div>
  );
}