// frontend/src/components/LongitudinalMRI.jsx

export default function LongitudinalMRI() {
  return (
    <div>
      <p style={{ color: "var(--text-main)", margin: "0 0 10px 0", fontSize: 14.5 }}>
        <strong>Timepoints:</strong> T0 (placeholder)
      </p>
      <p style={{ color: "var(--text-main)", fontSize: 14.5, lineHeight: 1.5, margin: 0 }}>
        Tip: connect TCIA download + NIFTI rendering later. For now we display provenance IDs for auditability.
      </p>
    </div>
  );
}