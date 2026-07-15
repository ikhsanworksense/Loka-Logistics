import { SOURCE_HEALTHS } from '../../data';

export default function GovernanceView() {
  return (
    <div className="view active" id="v-admin">
      <div className="grid g-1-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Data Source Health</div>
              <div className="card-sub">Freshness & ingestion</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Last Sync</th>
                <th className="num">Fresh</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="sourceTable">
              {SOURCE_HEALTHS.map((src, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{src.name}</td>
                  <td className="muted">{src.lastSync}</td>
                  <td className="num">{src.fresh}</td>
                  <td>
                    <span className={`pill ${src.statusClass}`}>{src.statusText}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Governance Snapshot</div>
              <div className="card-sub">Role, masking, audit, quality</div>
            </div>
          </div>
          <div className="kv">
            <div>RBAC roles</div>
            <div>Admin, Manager, Analyst, Viewer</div>
            <div>Row-level security</div>
            <div>Aktif per region & warehouse</div>
            <div>Field masking</div>
            <div>Margin, AR/AP, kontrak</div>
            <div>Audit log</div>
            <div>14,382 event / 30 hari</div>
            <div>Data quality</div>
            <div>96.4%</div>
            <div>SSO / SAML</div>
            <div>Aktif</div>
          </div>
        </div>
      </div>
    </div>
  );
}
