export default function PatientInfo({ patient }) {
  if (!patient) return null;

  return (
    <div className="card">
      <h3>Patient Data</h3>
      <p><b>Patient ID:</b> {patient.patient_key}</p>
      <p><b>Subtype:</b> {patient.omics_identifiers?.subtype}</p>
      <p><b>Trial Arm:</b> {patient.omics_identifiers?.Arm}</p>
    </div>
  );
}
