export default function DriversList({ drivers }) {
  if (!drivers || Object.keys(drivers).length === 0) return null;

  return (
    <div style={{
      background: "#1f1f1f",
      padding: 20,
      borderRadius: 8,
      marginTop: 20,
      color: "white",
      width: 260
    }}>
      <h3>Mechanistic Alignment</h3>

      <ul>
        {Object.entries(drivers).map(([k, v], i) => (
          <li key={i}>
            {k.replace("_", " ")} : <b>{v}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
