// frontend/src/components/OmicsRadar.jsx

import Plot from "react-plotly.js";

export default function OmicsRadar({ omics }) {
  if (!omics || !omics.mrna) return null;

  const ORDER = [
    "proliferation",
    "immune_cytotoxic",
    "hrd",
    "pi3k_akt_mtor",
    "emt",
    "pdl1",
    "angiogenesis"
  ];

  const LABELS = {
    proliferation: "Proliferation",
    immune_cytotoxic: "Immune cytotoxic",
    hrd: "HRD / DNA repair",
    pi3k_akt_mtor: "PI3K axis",
    emt: "EMT",
    pdl1: "PD-L1",
    angiogenesis: "Angiogenesis"
  };

  const theta = ORDER.map(k => LABELS[k]);
  const r = ORDER.map(k => {
    const v = omics.mrna[k];
    if (v === undefined || v === null) return 0;
    return Math.min(Math.max(v, 0), 1);
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
          fillcolor: "rgba(59,130,246,0.28)",
          line: { color: "#3b82f6", width: 2.5 },
          hoverinfo: "theta+r"
        }
      ]}
      layout={{
        autosize: true,
        margin: { l: 20, r: 20, t: 20, b: 20 },
        polar: {
          radialaxis: {
            range: [0, 1],
            tickfont: { color: "#475569" },
            gridcolor: "#e5e7eb"
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
      config={{ displayModeBar: false }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}