// frontend/src/components/PatientData.jsx

export default function PatientData({ patientId, subtype, arm }) {
  return (
    <div>
      <h3>Patient Data</h3>
      <p><b>Patient ID:</b> {patientId || "—"}</p>
      <p><b>Subtype:</b> {subtype || "—"}</p>
      <p><b>Trial Arm:</b> {arm || "—"}</p>
      
      <div style={{ 
        background: "#f0fdf4", 
        border: "1px solid #bbf7d0", 
        padding: "8px 10px", 
        borderRadius: 8, 
        marginTop: 12, 
        fontSize: 12, 
        color: "#166534" 
      }}>
        Standard baseline derived via trial arm exact.
      </div>
    </div>
  );
}