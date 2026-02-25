// frontend/src/components/OmicsRadar.jsx

import Plot from "react-plotly.js";

export default function OmicsRadar({ omics, theme }) {
  if (!omics || !omics.mrna) return null;

  // Exact 5 axes required to match Streamlit shape
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
  
  const r = ORDER.map(k => {
    const v = omics.mrna[k];
    if (v === undefined || v === null) return 0.5;
    const vclip = Math.min(Math.max(v, -2.5), 2.5);
    return (vclip + 2.5) / 5.0; 
  });

  const thetaClosed = [...theta, theta[0]];
  const rClosed = [...r, r[0]];

  // Exact Streamlit Theme Colors
  const fontColor = theme === "dark" ? "rgba(255, 255, 255, 0.85)" : "#31333F";
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(49, 51, 63, 0.15)";
  const fillColor = theme === "dark" ? "rgba(77,182,255,0.22)" : "rgba(37,99,235,0.22)";
  const lineColor = theme === "dark" ? "#4db6ff" : "#2563eb";

  return (
    <Plot
      data={[
        {
          type: "scatterpolar",
          r: rClosed,
          theta: thetaClosed,
          fill: "toself",
          fillcolor: fillColor,
          line: { color: lineColor, width: 2.2 },
          hoverinfo: "theta+r",
          cliponaxis: false // Lets text overflow the SVG bounds without getting cut
        }
      ]}
      layout={{
        autosize: true,
        // Balanced margins give text room to breathe without shrinking the web
        margin: { l: 80, r: 80, t: 40, b: 40 }, 
        polar: {
          bgcolor: "rgba(0,0,0,0)", 
          radialaxis: {
            visible: true,
            range: [0, 1],
            tickvals: [0.25, 0.5, 0.75, 1], 
            showticklabels: false,
            gridcolor: gridColor,
            linecolor: gridColor,
            gridwidth: 1
          },
          angularaxis: {
            tickfont: { color: fontColor, size: 12, weight: 600 },
            gridcolor: gridColor,
            linecolor: gridColor,
            gridwidth: 1,
            tickpadding: 12
          }
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        showlegend: false
      }}
      config={{ displayModeBar: false, responsive: true }}
      // FIX: Rely on CSS min-height to allow scaling without cutting off edges
      style={{ width: "100%", height: "100%", overflow: "visible" }} 
    />
  );
}