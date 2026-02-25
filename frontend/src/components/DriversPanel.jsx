// frontend/src/components/DriversPanel.jsx

export default function DriversPanel({ drivers }) {
  if (!drivers || Object.keys(drivers).length === 0) return null;

  const getChipClass = (value) => {
    if (typeof value === "string") {
      if (value.toLowerCase().includes("high")) return "chip-high";
      if (value.toLowerCase().includes("low")) return "chip-low";
    }
    return "chip-mid";
  };

  return (
    <div style={{ marginTop: 14 }}>
      <h3>Top Molecular Drivers (signature-level)</h3>
      <div style={{ marginTop: 10 }}>
        {Object.entries(drivers).map(([key, value]) => (
          <div key={key} className="driver-row">
            <span style={{ fontWeight: 600, color: "#334155" }}>
              {key.replace(/_/g, " ")}
            </span>
            <span className={`chip ${getChipClass(value)}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}