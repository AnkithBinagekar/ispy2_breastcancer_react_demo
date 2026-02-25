// frontend/src/components/AuditProvenance.jsx

export default function AuditProvenance() {
  return (
    <div>
      <p style={{ fontSize: 14.5, color: "var(--text-main)", margin: "0 0 10px 0" }}>
        This section surfaces data lineage fields (IDs, modalities used, model metadata) for auditability. Hidden by default in pitch; keep for credibility.
      </p>

      <details className="st-expander">
        <summary>Show audit details</summary>
        <div className="st-expander-content">
          <p style={{ margin: "0 0 8px 0", color: "var(--text-main)" }}><strong>Modalities used:</strong></p>
          <pre style={{ background: "var(--input-bg)", padding: 12, borderRadius: 6, border: "1px solid var(--border-main)", fontSize: 13, color: "var(--text-main)", overflowX: "auto", fontFamily: "monospace" }}>
[
  0: "mrna"
  1: "rppa"
]
          </pre>
          <p style={{ margin: "14px 0 8px 0", color: "var(--text-main)" }}><strong>Ensemble method:</strong></p>
          <p style={{ margin: "14px 0 8px 0", color: "var(--text-main)" }}><strong>Feature provenance:</strong> (can be filled by builder patch later).</p>
        </div>
      </details>
    </div>
  );
}