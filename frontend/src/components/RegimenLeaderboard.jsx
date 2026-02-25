// frontend/src/components/RegimenLeaderboard.jsx
import { useState, useRef, useEffect } from "react";

export default function RegimenLeaderboard({ regimens }) {
  // 1. Core States
  const [sortConfig, setSortConfig] = useState({ key: "pcr_prob", direction: "desc" });
  const [openMenu, setOpenMenu] = useState(null);
  
  // 2. Toolbar States
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 3. Column Visibility & Resize States
  const [visibleCols, setVisibleCols] = useState({ index: false, regimen: true, pcr_prob: true });
  const [regimenWidth, setRegimenWidth] = useState(65); 
  
  const containerRef = useRef(null);
  const isResizing = useRef(false);

  // ==========================================
  // FIX: Moved useEffect ABOVE the early return! 
  // React requires all hooks to run unconditionally.
  // ==========================================
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Now we can safely return null if the data hasn't loaded yet
  if (!regimens || !regimens.pcr_probability_by_regimen) return null;

  // SAFE DATA PARSING: Map to objects and force numbers to prevent crashes
  let entriesArray = Object.entries(regimens.pcr_probability_by_regimen).map(([name, val], idx) => ({
    name: name,
    val: Number(val) || 0,
    idx: idx
  }));
  
  if (searchQuery) {
    entriesArray = entriesArray.filter((row) => row.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  // SAFE SORTING
  entriesArray.sort((a, b) => {
    if (sortConfig.key === "regimen") {
      return sortConfig.direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortConfig.key === "index") {
      return sortConfig.direction === "asc" ? a.idx - b.idx : b.idx - a.idx;
    } else {
      return sortConfig.direction === "asc" ? a.val - b.val : b.val - a.val;
    }
  });

  const handleSort = (key, dir) => {
    setSortConfig({ key, direction: dir });
    setOpenMenu(null);
  };

  const startResize = (e) => {
    isResizing.current = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const onMouseMove = (e) => {
    if (!isResizing.current || !containerRef.current) return;
    const containerBounds = containerRef.current.getBoundingClientRect();
    const newWidthPercent = ((e.clientX - containerBounds.left) / containerBounds.width) * 100;
    if (newWidthPercent > 20 && newWidthPercent < 80) setRegimenWidth(newWidthPercent);
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  const handleDownload = () => {
    let csv = "regimen,pcr_prob\n";
    entriesArray.forEach((row) => { csv += `"${row.name}",${row.val.toFixed(4)}\n`; });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regimen_leaderboard.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  const toggleCol = (col) => setVisibleCols(prev => ({ ...prev, [col]: !prev[col] }));
  const allSelected = visibleCols.index && visibleCols.regimen && visibleCols.pcr_prob;
  const toggleAll = () => {
    const newState = !allSelected;
    setVisibleCols({ index: newState, regimen: newState, pcr_prob: newState });
  };

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

  const TableHeader = ({ columnKey, label }) => {
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

        {isMenuOpen && (
          <div style={{
            position: "absolute", top: "100%", right: 10, marginTop: 4, zIndex: 100, background: "var(--bg-card)", border: "1px solid var(--border-main)",
            borderRadius: 8, padding: 8, width: 220, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", color: "var(--text-main)", fontSize: 14, fontWeight: 400, textAlign: "left"
          }}>
            <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border-main)", marginBottom: 4, color: "var(--text-muted)", fontSize: 13 }}>
              <span>≡</span> <span>{label}</span>
            </div>
            <div className="table-menu-item" onClick={() => handleSort(columnKey, "asc")}>↑ Sort ascending</div>
            <div className="table-menu-item" onClick={() => handleSort(columnKey, "desc")}>↓ Sort descending</div>
            <div className="table-menu-item" onClick={() => { setVisibleCols(prev => ({ ...prev, [columnKey]: false })); setOpenMenu(null); }}>∅ Hide column</div>
          </div>
        )}
      </th>
    );
  };

  return (
    <div style={{ marginBottom: 24 }}>
      
      <style>{`
        .table-menu-item { padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.2s; margin-bottom: 2px; color: var(--text-main); }
        .table-menu-item:hover { background: var(--input-bg); }
        .st-dataframe-wrapper { border: 1px solid var(--border-main); border-radius: 8px; background: var(--bg-card); display: flex; flex-direction: column; position: relative; }
        .st-dataframe-toolbar { position: absolute; top: 6px; right: 14px; background: var(--panel-bg); border: 1px solid var(--border-main); box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; padding: 6px 10px; display: flex; alignItems: center; gap: 12px; z-index: 50; opacity: 0; visibility: hidden; transition: opacity 0.2s ease, visibility 0.2s ease; }
        .st-dataframe-wrapper:hover .st-dataframe-toolbar, .st-dataframe-toolbar.active { opacity: 1; visibility: visible; }
        .st-dataframe { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; table-layout: fixed; }
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

      <details className="st-expander" open>
        <summary>Regimen leaderboard (optional)</summary>
        <div className="st-expander-content" style={{ padding: "0 14px 14px 14px", borderTop: "none" }}>
          
          <div className="st-dataframe-wrapper" ref={containerRef} style={{ maxHeight: isFullscreen ? "100vh" : "auto", height: isFullscreen ? "100vh" : "auto", padding: isFullscreen ? 20 : 0 }}>
            
            <div className={`st-dataframe-toolbar ${isEyeOpen || isSearchOpen ? 'active' : ''}`}>
              {isSearchOpen && (
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus
                  style={{ background: "var(--input-bg)", color: "var(--text-main)", border: "1px solid var(--border-main)", borderRadius: 4, padding: "4px 8px", fontSize: 13, outline: "none", width: 160 }} 
                />
              )}
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <svg onClick={() => setIsEyeOpen(!isEyeOpen)} className="st-toolbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {isEyeOpen && (
                    <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "var(--panel-bg)", border: "1px solid var(--border-main)", borderRadius: 8, padding: "12px", width: 160, zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                      <CustomCheckbox checked={allSelected} indeterminate={!allSelected && (visibleCols.index || visibleCols.regimen || visibleCols.pcr_prob)} onChange={toggleAll} label="Select all" />
                      <div style={{ height: 1, background: "var(--border-main)", margin: "8px 0" }} />
                      <CustomCheckbox checked={visibleCols.index} onChange={() => toggleCol("index")} label="(index)" />
                      <CustomCheckbox checked={visibleCols.regimen} onChange={() => toggleCol("regimen")} label="regimen" />
                      <CustomCheckbox checked={visibleCols.pcr_prob} onChange={() => toggleCol("pcr_prob")} label="pcr_prob" />
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
                  {visibleCols.index && <col style={{ width: "60px" }} />}
                  {visibleCols.regimen && <col style={{ width: visibleCols.pcr_prob ? `${regimenWidth}%` : "100%" }} />}
                  {visibleCols.pcr_prob && <col style={{ width: visibleCols.regimen ? `${100 - regimenWidth}%` : "100%" }} />}
                </colgroup>
                <thead>
                  <tr>
                    {visibleCols.index && <TableHeader columnKey="index" label="(index)" />}
                    {visibleCols.regimen && (
                      <th className="st-th" style={{ position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span onClick={() => handleSort("regimen", sortConfig.direction === "asc" ? "desc" : "asc")} style={{ cursor: "pointer", flex: 1, display: "flex", gap: 6, color: "var(--text-muted)" }}>
                            {sortConfig.key === "regimen" && <span style={{ fontSize: 12 }}>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>} regimen
                          </span>
                          <span onClick={() => setOpenMenu(openMenu === "regimen" ? null : "regimen")} className="st-menu-icon" style={{ cursor: "pointer", opacity: openMenu === "regimen" ? 1 : "" }}>⋮</span>
                        </div>
                        {visibleCols.pcr_prob && <div className="drag-handle" onMouseDown={startResize} />}
                      </th>
                    )}
                    {visibleCols.pcr_prob && <TableHeader columnKey="pcr_prob" label="pcr_prob" />}
                  </tr>
                </thead>
                <tbody>
                  {entriesArray.length === 0 ? (
                    <tr><td colSpan="3" style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>No regimens found</td></tr>
                  ) : (
                    entriesArray.map((row) => (
                      <tr key={row.name}>
                        {visibleCols.index && <td className="st-td" style={{ color: "var(--text-muted)", fontSize: 12 }}>{row.idx}</td>}
                        {visibleCols.regimen && <td className="st-td" style={{ color: "var(--text-main)" }} title={row.name}>{row.name}</td>}
                        {visibleCols.pcr_prob && <td className="st-td" style={{ textAlign: "right", fontFamily: "monospace", fontSize: "14px", color: "var(--text-main)" }}>
                          {row.val.toFixed(4)}
                        </td>}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </details>
    </div>
  );
}