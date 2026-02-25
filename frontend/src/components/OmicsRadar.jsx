// frontend/src/components/OmicsRadar.jsx

import Plot from "react-plotly.js";

export default function OmicsRadar({ omics }) {
  if (!omics || !omics.mrna) return null;

  // Reduced to the 5 exact axes shown in the Streamlit UI PDF
  const ORDER = [
    "proliferation",
    "immune_cytotoxic",
    "hrd",
    "pi3k_akt_mtor",
    "emt"
  ];

  const LABELS = {
    proliferation: "Proliferation",
    immune_cytotoxic: "Immune cytotoxic",
    hrd: "HRD / DNA repair",
    pi3k_akt_mtor: "PI3K axis",
    emt: "EMT"
  };

  const theta = ORDER.map(k => LABELS[k]);
  
  // Streamlit Logic Application: vclip = np.clip(v, -2.5, 2.5); vnorm = (vclip + 2.5) / 5.0
  const r = ORDER.map(k => {
    const v = omics.mrna[k];
    if (v === undefined || v === null) return 0.5; // Default to neutral middle if missing
    const vclip = Math.min(Math.max(v, -2.5), 2.5);
    return (vclip + 2.5) / 5.0; 
  });

  // close loop
  const thetaClosed = [...theta, theta[0]];
  const rClosed = [...r, r[0]];

  return (
    <Plot
      data={[
        {
          type: "scatterpolar",
          r: rClosed,
          theta: thetaClosed,
          fill: "toself",
          fillcolor: "rgba(59,130,246,0.28)", // React Light Theme Blue
          line: { color: "#3b82f6", width: 2.5 },
          hoverinfo: "theta+r"
        }
      ]}
      layout={{
        autosize: true,
        margin: { l: 40, r: 40, t: 40, b: 40 }, // Breathing room
        polar: {
          radialaxis: {
            range: [0, 1],
            tickfont: { color: "#475569" },
            gridcolor: "#e5e7eb",
            tickvals: [0.25, 0.5, 0.75], // Exact tick marks from Streamlit code
            ticktext: ["", "", ""] // Hides numbers inside the rings
          },
          angularaxis: {
            direction: "clockwise",
            rotation: 90,
            tickfont: { color: "#475569", size: 11 },
            gridcolor: "#e5e7eb",
            tickpadding: 8
          }
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        showlegend: false,
        font: { color: "#0f172a" }
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}