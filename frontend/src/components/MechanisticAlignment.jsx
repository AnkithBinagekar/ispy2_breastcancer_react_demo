export default function MechanisticAlignment({ drivers }) {
  if (!drivers) return null;

  return (
    <div className="card">
      <h3>Mechanistic Alignment (Heuristic)</h3>

      <p style={{ fontSize: "14px", opacity: 0.7 }}>
        These notes provide plausibility context for the model's
        regimen ranking using baseline omics signals.
      </p>

      <ul style={{ marginTop: "10px" }}>
        {Object.entries(drivers).map(([key, value]) => (
          <li key={key}>
            <strong>{key.replace("_", " ")}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
