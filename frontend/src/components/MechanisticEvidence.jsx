// frontend/src/components/MechanisticEvidence.jsx
import { useState, useRef, useEffect } from "react";

export default function MechanisticEvidence({ drivers, omics, regimens }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [openMenu, setOpenMenu] = useState(null);
  
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [visibleCols, setVisibleCols] = useState({ label: true, z: true, call: true });
  const [colWidths, setColWidths] = useState({ label: 45, z: 25 }); 
  
  const containerRef = useRef(null);
  const activeHandle = useRef(null);

  // SAFE DATA PARSING: Prevent crashing if 'val' is a string
  const getRawZ = (key) => omics?.mrna?.[key];
  const formatZStr = (val) => {
    if (val === undefined || val === null || isNaN(Number(val))) return "—";
    const num = Number(val);
    return num >= 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
  };
  
  const findDriverVal = (substr1, substr2) => {
    if (!drivers || typeof drivers !== 'object') return "Unknown";
    let match = Object.keys(drivers).find(k => k.toLowerCase().includes(substr1));
    if (!match && substr2) match = Object.keys(drivers).find(k => k.toLowerCase().includes(substr2));
    return match ? drivers[match] : "Unknown";
  };

  let rawData = [
    { label: "HRD / DNA repair", z: getRawZ("hrd"), call: findDriverVal("hrd") },
    { label: "PI3K axis", z: getRawZ("pi3k_akt_mtor"), call: findDriverVal("pi3k") },
    { label: "Immune cytotoxic", z: getRawZ("immune_cytotoxic"), call: findDriverVal("immune") },
    { label: "Proliferation", z: getRawZ("proliferation"), call: findDriverVal("proliferation", "ki67") }
  ];

  if (searchQuery) {
    rawData = rawData.filter(row => 
      row.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      row.call.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  rawData.sort((a, b) => {
    if (!sortConfig.key) return 0;
    const { key, direction } = sortConfig;
    if (key === 'z') {
      const valA = a.z === undefined || a.z === null || isNaN(Number(a.z)) ? -999 : Number(a.z);
      const valB = b.z === undefined || b.z === null || isNaN(Number(b.z)) ? -999 : Number(b.z);
      return direction === 'asc' ? valA - valB : valB - valA;
    } else {
      const strA = String(a[key] || "");
      const strB = String(b[key] || "");
      return direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    }
  });

  const handleSort = (key, dir) => {
    setSortConfig({ key, direction: dir });
    setOpenMenu(null);
  };

  const startResize = (handleIndex) => (e) => {
    activeHandle.current = handleIndex;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const onMouseMove = (e) => {
    if (!activeHandle.current || !containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - bounds.left) / bounds.width) * 100;

    if (activeHandle.current === 1) {
      if (pct > 15 && pct < (colWidths.label + colWidths.z - 10)) setColWidths(p => ({ ...p, label: pct }));
    } else if (activeHandle.current === 2) {
      const newZ = pct - colWidths.label;
      if (newZ > 10 && pct < 85) setColWidths(p => ({ ...p, z: newZ }));
    }
  };

  const stopResize = () => {
    activeHandle.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  const handleDownload = () => {
    let csv = "Evidence signal,z-score,Call\n";
    rawData.forEach(row => { csv += `"${row.label}","${row.z !== undefined ? row.z : ""}","${row.call}"\n`; });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "evidence_mapping.csv";
    a.click();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  const toggleCol = (col) => setVisibleCols(p => ({ ...p, [col]: !p[col] }));
  const allSelected = visibleCols.label && visibleCols.z && visibleCols.call;
  const toggleAll = () => {
    const state = !allSelected;
    setVisibleCols({ label: state, z: state, call: state });
  };

  let parpDeltaStr = "N/A";
  let pi3kDeltaStr = "N/A";

  if (regimens && regimens.pcr_probability_by_regimen) {
    const entries = Object.entries(regimens.pcr_probability_by_regimen);
    const sorted = [...entries].sort((a, b) => Number(b[1]) - Number(a[1]));
    const standard = sorted[0] || ["Unknown", 0];
    const parp = sorted[1] || standard;
    const pi3k = sorted[2] || standard;

    const stdScore = Math.round(Number(standard[1]) * 100);
    const parpDelta = Math.round(Number(parp[1]) * 100) - stdScore;
    const pi3kDelta = Math.round(Number(pi3k[1]) * 100) - stdScore;

    parpDeltaStr = parpDelta >= 0 ? `+${parpDelta}%` : `${parpDelta}%`;
    pi3kDeltaStr = pi3kDelta >= 0 ? `+${pi3kDelta}%` : `${pi3kDelta}%`;
  }

  const CustomCheckbox = ({ checked, indeterminate, onChange, label }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "4px 0", fontSize: 13, color: "var(--text-main)" }}>
      <div onClick={onChange} style={{
        width: 16, height: 16, borderRadius: 4, display: "flex", justifyContent: "center", alignItems: "center",
        background: checked || indeterminate ? "#ff4b4b" : "transparent",
        border: checked || indeterminate ? "1px solid #ff4b4b" : "1px solid var(--border-main)",
        color: "white"
      }}>
        {checked && !indeterminate && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
        {indeterminate && !checked && <div style={{ width: 8, height: 2, background: "white", borderRadius: 2 }} />}
      </div>
      {label}
    </label>
  );

  const TableHeader = ({ columnKey, label, handleId, hideResize }) => {
    if (!visibleCols[columnKey]) return null;
    const isSorted = sortConfig.key === columnKey;
    const isMenuOpen = openMenu === columnKey;

    return (
      <th className="st-th" style={{ position: "relative", cursor: "pointer", userSelect: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span onClick={() => handleSort(columnKey, sortConfig.direction === "asc" ? "desc" : "asc")} style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
            {isSorted && <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
            <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
          </span>
          <span onClick={() => setOpenMenu(isMenuOpen ? null : columnKey)} className="st-menu-icon" style={{ opacity: isMenuOpen ? 1 : "" }}>⋮</span>
        </div>

        {!hideResize && <div className="drag-handle" onMouseDown={startResize(handleId)} />}

        {isMenuOpen && (
          <div style={{
            position: "absolute", top: "100%", right: 10, marginTop: 4, zIndex: 100, background: "var(--bg-card)", border: "1px solid var(--border-main)",
            borderRadius: 8, padding: 8, width: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", color: "var(--text-main)", fontSize: 14, fontWeight: 400, textAlign: "left"
          }}>
            <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border-main)", marginBottom: 4, color: "var(--text-muted)", fontSize: 13 }}>
              <span>≡</span> <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
            </div>
            <div className="table-menu-item" onClick={() => handleSort(columnKey, "asc")}>↑ Sort ascending</div>
            <div className="table-menu-item" onClick={() => handleSort(columnKey, "desc")}>↓ Sort descending</div>
            <div className="table-menu-item" onClick={() => { setVisibleCols(p => ({ ...p, [columnKey]: false })); setOpenMenu(null); }}>∅ Hide column</div>
          </div>
        )}
      </th>
    );
  };

  return (
    <div>
      <style>{`
        .table-menu-item { padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.2s; margin-bottom: 2px; color: var(--text-main); }
        .table-menu-item:hover { background: var(--input-bg); }
        .st-dataframe-wrapper { border: 1px solid var(--border-main); border-radius: 8px; background: var(--bg-card); display: flex; flex-direction: column; margin-bottom: 16px; position: relative; }
        .st-dataframe-toolbar { position: absolute; top: 6px; right: 14px; background: var(--panel-bg); border: 1px solid var(--border-main); box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; padding: 6px 10px; display: flex; align-items: center; gap: 12px; z-index: 50; opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; }
        .st-dataframe-wrapper:hover .st-dataframe-toolbar, .st-dataframe-toolbar.active { opacity: 1; visibility: visible; }
        .st-dataframe { width: 100%; border-collapse: collapse; text-align: left; font-size: 14.5px; table-layout: fixed; }
        .st-th, .st-td { padding: 10px 14px; border-bottom: 1px solid var(--border-main); position: relative; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .st-th:not(:last-child), .st-td:not(:last-child) { border-right: 1px solid var(--border-main); }
        .st-dataframe tbody tr:last-child .st-td { border-bottom: none; }
        .st-menu-icon { font-size: 16px; padding: 0 4px; color: var(--text-muted); opacity: 0; transition: opacity 0.2s; }
        .st-th:hover .st-menu-icon { opacity: 1; }
        .st-toolbar-icon { width: 16px; height: 16px; cursor: pointer; color: var(--text-muted); transition: color 0.2s; }
        .st-toolbar-icon:hover { color: var(--text-main); }
        .drag-handle { position: absolute; right: 0; top: 0; bottom: 0; width: 6px; cursor: col-resize; z-index: 10; }
        .drag-handle:hover { background: rgba(120, 210, 255, 0.3); }
      `}</style>

      <p style={{ fontSize: "14.5px", color: "var(--text-main)", marginTop: 0, lineHeight: 1.6 }}>
        A compact, investor-friendly bridge between baseline evidence signals and the scenario what-if deltas. Heuristic only (not causal proof).
      </p>

      <details className="st-expander" open>
        <summary>Show evidence mapping</summary>
        <div className="st-expander-content" style={{ padding: "14px 14px 14px 14px", borderTop: "1px solid var(--border-main)" }}>
          
          <div className="st-dataframe-wrapper" ref={containerRef} style={{ maxHeight: isFullscreen ? "100vh" : "auto", height: isFullscreen ? "100vh" : "auto", padding: isFullscreen ? 20 : 0 }}>
            
            <div className={`st-dataframe-toolbar ${isEyeOpen || isSearchOpen ? 'active' : ''}`}>
              {isSearchOpen && (
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus
                  style={{ background: "var(--input-bg)", color: "var(--text-main)", border: "1px solid var(--border-main)", borderRadius: 4, padding: "4px 8px", fontSize: 13, outline: "none", width: 150 }} 
                />
              )}
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <svg onClick={() => setIsEyeOpen(!isEyeOpen)} className="st-toolbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {isEyeOpen && (
                    <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "var(--panel-bg)", border: "1px solid var(--border-main)", borderRadius: 8, padding: "12px", width: 170, zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                      <CustomCheckbox checked={allSelected} indeterminate={!allSelected && (visibleCols.label || visibleCols.z || visibleCols.call)} onChange={toggleAll} label="Select all" />
                      <div style={{ height: 1, background: "var(--border-main)", margin: "8px 0" }} />
                      <CustomCheckbox checked={visibleCols.label} onChange={() => toggleCol("label")} label="Evidence signal" />
                      <CustomCheckbox checked={visibleCols.z} onChange={() => toggleCol("z")} label="z-score" />
                      <CustomCheckbox checked={visibleCols.call} onChange={() => toggleCol("call")} label="Call" />
                    </div>
                  )}
                </div>
                <svg onClick={handleDownload} className="st-toolbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <svg onClick={() => setIsSearchOpen(!isSearchOpen)} className="st-toolbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <svg onClick={toggleFullscreen} className="st-toolbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isFullscreen ? <><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></> : <><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></>}
                </svg>
              </div>
            </div>

            <div style={{ overflowX: "auto", overflowY: "auto", flex: 1, borderRadius: 8 }}>
              <table className="st-dataframe">
                <colgroup>
                  {visibleCols.label && <col style={{ width: visibleCols.z || visibleCols.call ? `${colWidths.label}%` : "100%" }} />}
                  {visibleCols.z && <col style={{ width: visibleCols.call ? `${colWidths.z}%` : (visibleCols.label ? `${100 - colWidths.label}%` : "100%") }} />}
                  {visibleCols.call && <col style={{ width: (visibleCols.label || visibleCols.z) ? `${100 - colWidths.label - colWidths.z}%` : "100%" }} />}
                </colgroup>
                <thead>
                  <tr>
                    <TableHeader columnKey="label" label="Evidence signal" handleId={1} hideResize={!visibleCols.z && !visibleCols.call} />
                    <TableHeader columnKey="z" label="z-score" handleId={2} hideResize={!visibleCols.call} />
                    <TableHeader columnKey="call" label="Call" hideResize={true} />
                  </tr>
                </thead>
                <tbody>
                  {rawData.length === 0 ? (
                    <tr><td colSpan="3" style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>No matches found</td></tr>
                  ) : (
                    rawData.map((row, idx) => (
                      <tr key={idx}>
                        {visibleCols.label && <td className="st-td" style={{ color: "var(--text-main)" }}>{row.label}</td>}
                        {visibleCols.z && <td className="st-td" style={{ color: "var(--text-main)" }}>{formatZStr(row.z)}</td>}
                        {visibleCols.call && <td className="st-td" style={{ color: "var(--text-main)" }}>{row.call}</td>}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ color: "var(--text-main)", fontSize: "15px", marginBottom: "12px", lineHeight: 1.5 }}>
            <strong>Scenario uplift vs Standard:</strong> PARP {parpDeltaStr} • PI3K/AKT {pi3kDeltaStr}
          </div>
          
          <div style={{ color: "var(--text-main)", fontSize: "14.5px", lineHeight: 1.5 }}>
            Interpret uplift as a within-library what-if: the model selects the best-scoring regimen inside each scenario class.
          </div>

        </div>
      </details>
    </div>
  );
}