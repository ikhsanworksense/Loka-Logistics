import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ROUTE_LANE_DETAILS, ROUTE_STATES } from '../../data';

const P = {
  orange: 'oklch(68% 0.19 42)',
  orangeSoft: 'oklch(68% 0.19 42 / .14)',
  blue: 'oklch(58% 0.11 250)',
  grid: 'oklch(94% 0.005 280)'
};

export default function RoutesView() {
  const chartLaneRef = useRef<HTMLCanvasElement | null>(null);
  const chartWhatIfRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let laneChart: Chart | null = null;
    let whatIfChart: Chart | null = null;

    if (chartLaneRef.current) {
      laneChart = new Chart(chartLaneRef.current, {
        type: 'bar',
        data: {
          labels: ['JKT-SBY', 'BDG-CRB', 'SBY-MLG', 'MDN-PKU', 'MKS-PLU'],
          datasets: [
            {
              label: 'Revenue',
              data: [9.2, 4.1, 3.3, 5.4, 3.8],
              backgroundColor: P.blue,
              borderRadius: 5
            },
            {
              label: 'Cost',
              data: [7.1, 3.5, 2.4, 4.8, 3.4],
              backgroundColor: P.orange,
              borderRadius: 5
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
                callback: (v) => '$' + v + 'M'
              }
            }
          }
        }
      });
    }

    if (chartWhatIfRef.current) {
      whatIfChart = new Chart(chartWhatIfRef.current, {
        type: 'line',
        data: {
          labels: ['-20%', '-10%', 'Base', '+10%', '+20%'],
          datasets: [
            {
              data: [0.98, 0.92, 0.86, 0.79, 0.75],
              borderColor: P.orange,
              backgroundColor: P.orangeSoft,
              fill: true,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 4
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
              },
              ticks: {
                callback: (v) => '$' + v
              }
            }
          }
        }
      });
    }

    return () => {
      if (laneChart) laneChart.destroy();
      if (whatIfChart) whatIfChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-route">
      <div className="grid g-1-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Lane Profitability</div>
              <div className="card-sub">Revenue & cost per rute utama, $M</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartLaneRef} id="c_lane"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Planned vs Actual Time</div>
              <div className="card-sub">Variance per lane prioritas</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Lane</th>
                <th className="num">Plan</th>
                <th className="num">Actual</th>
                <th className="num">Var</th>
              </tr>
            </thead>
            <tbody id="routeTable">
              {ROUTE_LANE_DETAILS.map((r, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{r.lane}</td>
                  <td className="num">{r.plan}</td>
                  <td className="num">{r.actual}</td>
                  <td className="num">{r.var}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Network What-If</div>
            <div className="card-sub">Simulasi volume terhadap cost per km</div>
          </div>
        </div>
        <div className="statebar" id="routeStates">
          {ROUTE_STATES.map((s, index) => (
            <div className="state" key={index}>
              <div className="n">{s.value}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="chart-box sm" style={{ marginTop: '14px' }}>
          <canvas ref={chartWhatIfRef} id="c_whatif"></canvas>
        </div>
      </div>
    </div>
  );
}
