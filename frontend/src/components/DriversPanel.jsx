export default function DriversPanel({ drivers }) {
  if (!drivers || Object.keys(drivers).length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3>Top Molecular Drivers (signature-level)</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(drivers).map(([key, value]) => (
          <li
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>{key.replace("_", " ")}</span>
            <span className="badge">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
