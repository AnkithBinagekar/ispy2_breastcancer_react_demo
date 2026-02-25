// frontend/src/components/PatientData.jsx

export default function PatientData({ patientId, subtype, arm }) {
  return (
    <div>
      <p style={{ color: "var(--text-main)", fontSize: 14.5, marginBottom: 8 }}><b>Patient ID:</b> {patientId || "—"}</p>
      <p style={{ color: "var(--text-main)", fontSize: 14.5, marginBottom: 8 }}><b>Subtype:</b> {subtype || "—"}</p>
      <p style={{ color: "var(--text-main)", fontSize: 14.5, marginBottom: 8 }}><b>Trial Arm:</b> {arm || "—"}</p>

      {/* Streamlit Green Success Box Replica */}
      <div style={{
        marginTop: 16,
        padding: "14px 16px",
        background: "rgba(16, 185, 129, 0.12)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: 8,
        color: "var(--text-main)",
        fontSize: 14.5,
        lineHeight: 1.5
      }}>
        Standard baseline: {arm || "—"} (34%), derived via trial arm exact.
      </div>
    </div>
  );
}