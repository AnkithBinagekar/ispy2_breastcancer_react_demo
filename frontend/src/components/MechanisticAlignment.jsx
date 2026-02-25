// frontend/src/components/MechanisticAlignment.jsx

export default function MechanisticAlignment({ drivers }) {
  if (!drivers || Object.keys(drivers).length === 0) return null;
  const entries = Object.entries(drivers);

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Mechanistic Alignment (Heuristic)</h3>
      
      <ul style={{ paddingLeft: 16, margin: "10px 0", fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
        <li>These notes provide plausibility context for the model's regimen ranking using baseline signature signals.</li>
        <li>They are heuristic (not causal proof) and are shown to make the pCR bars easier to interpret.</li>
      </ul>

      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#2563eb" }}>
          Show more rationale
        </summary>
        <ul style={{ paddingLeft: 16, marginTop: 8, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
          {entries.map(([k, v]) => (
            <li key={k} style={{ marginBottom: 4 }}>
              <b>{k.replace(/_/g, " ")}:</b> {v}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}