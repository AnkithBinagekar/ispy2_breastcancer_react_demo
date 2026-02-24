// frontend/src/components/PatientData.jsx

export default function PatientData({ patientId, subtype, arm }) {
  return (
    <div>

      <h3>Patient Data</h3>

      <p><b>Patient ID:</b> {patientId || "—"}</p>
      <p><b>Subtype:</b> {subtype || "—"}</p>
      <p><b>Trial Arm:</b> {arm || "—"}</p>

      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
        Standard baseline is derived from trial arm when available.
      </p>

    </div>
  );
}