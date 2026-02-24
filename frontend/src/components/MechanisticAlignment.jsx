// frontend/src/components/MechanisticAlignment.jsx

export default function MechanisticAlignment({ drivers }) {
  if (!drivers || Object.keys(drivers).length === 0) return null;

  const entries = Object.entries(drivers);

  return (
    <div>

      <h3>Mechanistic Alignment (Heuristic)</h3>

      <p style={{ fontSize: 13, opacity: 0.75 }}>
        Plausibility context connecting baseline signature signals
        to scenario what-if deltas. Heuristic only (not causal).
      </p>

      {/* Show first 2 bullets */}
      <ul style={{ marginTop: 10 }}>
        {entries.slice(0, 2).map(([k, v]) => (
          <li key={k}>
            <b>{k.replace(/_/g, " ")}:</b> {v}
          </li>
        ))}
      </ul>

      {/* Expandable remainder */}
      {entries.length > 2 && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: "pointer", fontSize: 13 }}>
            Show more rationale
          </summary>

          <ul style={{ marginTop: 8 }}>
            {entries.slice(2).map(([k, v]) => (
              <li key={k}>
                <b>{k.replace(/_/g, " ")}:</b> {v}
              </li>
            ))}
          </ul>
        </details>
      )}

    </div>
  );
}