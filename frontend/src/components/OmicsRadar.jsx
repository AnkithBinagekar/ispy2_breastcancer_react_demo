// frontend/src/components/OmicsRadar.jsx

import { useState, useRef, useEffect } from "react";
import Plot from "react-plotly.js";

export default function OmicsRadar({ omics, theme }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  if (!omics || !omics.mrna) return null;

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

  const fontColor = theme === "dark" ? "rgba(255, 255, 255, 0.85)" : "#31333F";
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(49, 51, 63, 0.15)";
  const fillColor = theme === "dark" ? "rgba(77,182,255,0.22)" : "rgba(37,99,235,0.22)";
  const lineColor = theme === "dark" ? "#4db6ff" : "#2563eb";

  return (
    <div 
      ref={containerRef} 
      className="radar-container" 
      style={{ 
        width: "100%", height: "100%", position: "relative", 
        background: isFullscreen ? "var(--bg-card)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
    >
      <style>{`
        .fs-btn { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; background: var(--panel-bg); border: 1px solid var(--border-main); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); opacity: 0; transition: opacity 0.2s ease, color 0.2s ease; z-index: 10; }
        .radar-container:hover .fs-btn { opacity: 1; }
        .fs-btn:hover { color: var(--text-main); }
      `}</style>

      <div className="fs-btn" onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isFullscreen ? (
            <><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></>
          ) : (
            <><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></>
          )}
        </svg>
      </div>

      <Plot
        data={[
          {
            type: "scatterpolar",
            r: rClosed,
            theta: thetaClosed,
            fill: "toself",
            fillcolor: fillColor,
            mode: "lines+markers", /* Enables the glowing dots */
            marker: { color: "#60a5fa", size: 6, line: { color: "#ffffff", width: 1 } },
            line: { color: lineColor, width: 2.2 },
            hoverinfo: "theta+r",
            cliponaxis: false 
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 90, r: 90, t: 40, b: 40 }, 
          polar: {
            bgcolor: "rgba(0,0,0,0)", 
            radialaxis: { visible: true, range: [0, 1], tickvals: [0.25, 0.5, 0.75, 1], showticklabels: false, gridcolor: gridColor, linecolor: gridColor, gridwidth: 1 },
            angularaxis: { tickfont: { color: fontColor, size: 11, weight: "normal" }, gridcolor: gridColor, linecolor: gridColor, gridwidth: 1, tickpadding: 10 }
          },
          paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)", showlegend: false
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%", height: "100%", overflow: "visible" }} 
      />
    </div>
  );
}