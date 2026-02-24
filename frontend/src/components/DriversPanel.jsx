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
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              marginBottom: 8,
              background: "#f8fafc"
            }}
          >
            <span style={{ fontWeight: 500 }}>
              {key.replace(/_/g, " ")}
            </span>

            <span className={getChipClass(value)}
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 999,
                fontWeight: 600
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}