import Icon from '../Icon';
import { LIVE_ALERTS, ALERT_STEPS } from '../../data';

export default function AlertsView() {
  return (
    <div className="view active" id="v-alerts">
      <div className="grid g-1-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Live Exceptions Queue</div>
              <div className="card-sub">Severity, owner, SLA resolution</div>
            </div>
          </div>
          <div className="feed" id="alertsFeed">
            {LIVE_ALERTS.map((alert, index) => (
              <div className="alert" key={index}>
                <div className={`alert-ico ${alert.className}`}>
                  <Icon name={alert.icon} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-meta">{alert.meta}</div>
                </div>
                <div className="alert-time">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Escalation Flow</div>
              <div className="card-sub">Routing dan acknowledgment</div>
            </div>
          </div>
          <div className="timeline" id="alertSteps">
            {ALERT_STEPS.map((step, index) => (
              <div className="step" key={index}>
                <div className="dotx"></div>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
                <strong>{step.time}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
