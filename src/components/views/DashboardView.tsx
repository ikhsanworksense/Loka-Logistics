import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Icon from '../Icon';
import { DASH_ALERTS, OTD_REGIONS, CHART_DAYS, generateDaySeries } from '../../data';

const P = {
  orange: 'oklch(68% 0.19 42)',
  orangeSoft: 'oklch(68% 0.19 42 / .14)',
  blue: 'oklch(58% 0.11 250)',
  blueSoft: 'oklch(58% 0.11 250 / .14)',
  gray: 'oklch(85% 0.01 280)',
  ink3: 'oklch(62% 0.012 280)',
  grid: 'oklch(94% 0.005 280)'
};

export default function DashboardView() {
  const chartVolRef = useRef<HTMLCanvasElement | null>(null);
  const chartRegRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let volChart: Chart | null = null;
    let regChart: Chart | null = null;

    // Generate dynamic chart data consistent with original logic
    const actual = generateDaySeries(30, 1520, 210, 5);
    let last = actual[29];
    const fc: number[] = [];
    for (let i = 0; i < 7; i++) {
      last += 9 + (Math.random() - 0.5) * 28;
      fc.push(Math.round(last));
    }

    if (chartVolRef.current) {
      volChart = new Chart(chartVolRef.current, {
        type: 'line',
        data: {
          labels: [...CHART_DAYS, '+1', '+2', '+3', '+4', '+5', '+6', '+7'],
          datasets: [
            {
              label: 'Actual',
              data: [...actual, ...Array(7).fill(null)],
              borderColor: P.orange,
              backgroundColor: P.orangeSoft,
              fill: true,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 0
            },
            {
              label: 'Forecast',
              data: [...Array(29).fill(null), actual[29], ...fc],
              borderColor: P.blue,
              borderDash: [5, 4],
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
                callback: (v) => (typeof v === 'number' && v >= 1000 ? (v / 1000) + 'k' : v)
              }
            }
          }
        }
      });
    }

    if (chartRegRef.current) {
      regChart = new Chart(chartRegRef.current, {
        type: 'bar',
        data: {
          labels: ['JKT', 'Jabar', 'Jatim', 'Sumut', 'Sulsel', 'Bali'],
          datasets: [
            {
              label: 'Revenue',
              data: [42, 31, 28, 18, 14, 11],
              backgroundColor: P.orange,
              borderRadius: 5
            },
            {
              label: 'Cost',
              data: [31, 24, 22, 14, 11, 9],
              backgroundColor: P.gray,
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

    return () => {
      if (volChart) volChart.destroy();
      if (regChart) regChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-dash">
      <div className="grid g-2-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Shipment Volume & Forecast</div>
              <div className="card-sub">30 hari + proyeksi 7 hari</div>
            </div>
          </div>
          <div className="chart-box">
            <canvas ref={chartVolRef} id="c_vol"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Active Exceptions</div>
              <div className="card-sub">14 aktif, 3 kritis</div>
            </div>
          </div>
          <div className="feed" id="dashAlerts">
            {DASH_ALERTS.map((alert, index) => (
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
      </div>

      <div className="grid g-2-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Revenue vs Cost per Region</div>
              <div className="card-sub">Bulan berjalan, $M</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartRegRef} id="c_reg"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">OTD per Wilayah</div>
              <div className="card-sub">Target 95%</div>
            </div>
          </div>
          <table>
            <tbody id="otdTable">
              {OTD_REGIONS.map((region, index) => {
                const color = region.value >= 95 ? 'var(--green)' : region.value >= 90 ? 'var(--amber)' : 'var(--orange)';
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{region.name}</td>
                    <td style={{ width: '45%' }}>
                      <div className="heat">
                        <i style={{ width: `${region.value}%`, background: color }}></i>
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 700 }}>
                      {region.value.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
