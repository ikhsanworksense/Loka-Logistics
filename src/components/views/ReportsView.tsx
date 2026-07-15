import Icon from '../Icon';
import { REPORT_PREVIEWS } from '../../data';

export default function ReportsView() {
  return (
    <div className="view active" id="v-reports">
      <div className="builder">
        <div className="pane">
          <div className="card-title" style={{ marginBottom: '12px' }}>
            Dimensions
          </div>
          <span className="token">Date</span>
          <span className="token">Region</span>
          <span className="token">Lane</span>
          <span className="token">Service</span>
          <span className="token">Customer</span>
          <span className="token">Carrier</span>

          <div className="card-title" style={{ margin: '16px 0 12px' }}>
            Metrics
          </div>
          <span className="token">Volume</span>
          <span className="token">OTD</span>
          <span className="token">Cost/shipment</span>
          <span className="token">Margin</span>
        </div>

        <div className="pane">
          <div className="card-head">
            <div>
              <div className="card-title">Report Composer</div>
              <div className="card-sub">Drag & drop builder</div>
            </div>
            <button className="btn">
              <Icon name="upload" /> Export CSV
            </button>
          </div>
          <div className="scoregrid" style={{ marginBottom: '14px' }}>
            <div className="scorecard">
              <h4>Rows</h4>
              <div style={{ marginTop: '8px' }}>
                <span className="token">Region</span>
                <span className="token">Service</span>
              </div>
            </div>
            <div className="scorecard">
              <h4>Columns</h4>
              <div style={{ marginTop: '8px' }}>
                <span className="token">Month</span>
              </div>
            </div>
            <div className="scorecard">
              <h4>Values</h4>
              <div style={{ marginTop: '8px' }}>
                <span className="token">Volume</span>
                <span className="token">OTD</span>
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Region</th>
                <th>Service</th>
                <th className="num">Jun</th>
                <th className="num">Jul</th>
                <th className="num">OTD</th>
                <th className="num">Margin</th>
              </tr>
            </thead>
            <tbody id="reportPreview">
              {REPORT_PREVIEWS.map((row, index) => (
                <tr key={index}>
                  <td>{row.region}</td>
                  <td className="muted">{row.service}</td>
                  <td className="num">{row.jun}</td>
                  <td className="num">{row.jul}</td>
                  <td className="num">{row.otd}</td>
                  <td className="num">{row.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
