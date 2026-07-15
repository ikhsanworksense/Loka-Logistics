import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { STRATEGIC_ACCOUNTS } from '../../data';

const P = {
  orange: 'oklch(68% 0.19 42)',
  orangeSoft: 'oklch(68% 0.19 42 / .14)',
  blue: 'oklch(58% 0.11 250)',
  blueSoft: 'oklch(58% 0.11 250 / .14)',
  red: 'oklch(64% 0.19 22)',
  redSoft: 'oklch(64% 0.19 22 / .12)',
  grid: 'oklch(94% 0.005 280)'
};

export default function CustomersView() {
  const chartSlaRef = useRef<HTMLCanvasElement | null>(null);
  const chartRetRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let slaChart: Chart | null = null;
    let retChart: Chart | null = null;

    if (chartSlaRef.current) {
      slaChart = new Chart(chartSlaRef.current, {
        type: 'line',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
          datasets: [
            {
              data: [18, 16, 19, 15, 13, 12, 11, 10, 12, 9, 8, 7],
              borderColor: P.red,
              backgroundColor: P.redSoft,
              fill: true,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                color: P.grid,
                drawTicks: false
              },
              border: {
                display: false
              }
            }
          }
        }
      });
    }

    if (chartRetRef.current) {
      retChart = new Chart(chartRetRef.current, {
        type: 'line',
        data: {
          labels: ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
          datasets: [
            {
              label: 'Enterprise',
              data: [100, 95, 93, 92, 91, 90, 89],
              borderColor: P.blue,
              borderWidth: 2,
              tension: 0.35,
              pointRadius: 0
            },
            {
              label: 'SMB',
              data: [100, 89, 84, 80, 78, 74, 71],
              borderColor: P.orange,
              borderWidth: 2,
              tension: 0.35,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end'
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                color: P.grid,
                drawTicks: false
              },
              border: {
                display: false
              },
              ticks: {
                callback: (v) => v + '%'
              }
            }
          }
        }
      });
    }

    return () => {
      if (slaChart) slaChart.destroy();
      if (retChart) retChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-cust">
      <div className="grid g-1-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">SLA Breach Trend</div>
              <div className="card-sub">12 minggu terakhir</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartSlaRef} id="c_sla"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Retention Cohort</div>
              <div className="card-sub">Enterprise vs SMB</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartRetRef} id="c_ret"></canvas>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Strategic Accounts</div>
            <div className="card-sub">Scorecard customer utama</div>
          </div>
        </div>
        <div className="scoregrid" id="custScores">
          {STRATEGIC_ACCOUNTS.map((acc, index) => (
            <div className="scorecard" key={index}>
              <h4>{acc.name}</h4>
              <div className="big tnum">{acc.otdValue}%</div>
              <small>{acc.type} compliance</small>
              <div style={{ marginTop: '10px', fontSize: '.8rem', color: 'var(--ink-3)' }}>
                Revenue ${acc.revenue}M/mo
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
