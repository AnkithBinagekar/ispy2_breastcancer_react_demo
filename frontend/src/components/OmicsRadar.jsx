import Plot from "react-plotly.js";

export default function OmicsRadar({ omics }) {
  if (!omics || !omics.mrna) return null;

  const labelMap = {
    proliferation: "Proliferation",
    immune_cytotoxic: "Immune cytotoxic",
    hrd: "HRD / DNA repair",
    pi3k_akt_mtor: "PI3K axis",
    emt: "EMT",
    pdl1: "PD-L1"
  };

  const order = [
    "proliferation",
    "immune_cytotoxic",
    "hrd",
    "pi3k_akt_mtor",
    "emt",
    "pdl1"
  ];

  const theta = order.map(k => labelMap[k]);
  const r = order.map(k => omics.mrna[k] ?? 0);

  return (
    <Plot
      data={[
        {
          type: "scatterpolar",
          r: [...r, r[0]],
          theta: [...theta, theta[0]],
          fill: "toself",
          fillcolor: "rgba(59,130,246,0.28)",
          line: {
            color: "#3b82f6",
            width: 3
          },
          marker: {
            size: 4,
            color: "#3b82f6"
          }
        }
      ]}
      layout={{
        margin: { t: 20, b: 20, l: 20, r: 20 },
        showlegend: false,
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        polar: {
          bgcolor: "transparent",
          radialaxis: {
            range: [0, 1],
            tick0: 0,
            dtick: 0.2,
            gridcolor: "rgba(255,255,255,0.18)",
            gridwidth: 1.5,
            tickfont: {
              color: "rgba(255,255,255,0.75)",
              size: 11
            }
          },
          angularaxis: {
            gridcolor: "rgba(255,255,255,0.15)",
            gridwidth: 1.5,
            tickfont: {
              color: "#e5e7eb",
              size: 13
            }
          }
        }
      }}
      config={{ displayModeBar: false }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
