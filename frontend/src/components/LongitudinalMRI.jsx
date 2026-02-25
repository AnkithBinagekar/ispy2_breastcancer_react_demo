// frontend/src/components/LongitudinalMRI.jsx
export default function LongitudinalMRI() {
  return (
    <div className="card">
      <h3>Longitudinal MRI (Timepoints)</h3>
      <p style={{ fontSize: 13, color: "#334155" }}>
        <b>Timepoints:</b> T0 (placeholder)
      </p>
      <div style={{ 
        background: "#f8fafc", padding: "12px 14px", borderRadius: 8, 
        border: "1px solid #e2e8f0", marginTop: 16, fontSize: 12, 
        color: "#64748b", lineHeight: 1.5
      }}>
        Tip: connect TCIA download + NIfTI rendering later. For now we display provenance IDs for auditability.
      </div>
    </div>
  );
}