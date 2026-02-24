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
        <span style={{ fontSize: 14 }}>{open ? "▾" : "▸"}</span>
      </div>

      {open && (
        <div style={{ marginTop: 10, fontSize: 13 }}>
          <p><b>Modalities used:</b></p>
          <ul>
            <li>mrna</li>
            <li>rppa</li>
          </ul>

          <p><b>Ensemble method:</b> —</p>
          <p><b>Feature provenance:</b> — (can be filled later)</p>
        </div>
      )}
    </div>
  );
}