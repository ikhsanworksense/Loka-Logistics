import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FLEET_VEHICLES, Vehicle } from '../../data';

const P = {
  orange: 'oklch(68% 0.19 42)',
  orangeSoft: 'oklch(68% 0.19 42 / .14)',
  blue: 'oklch(58% 0.11 250)',
  green: 'oklch(64% 0.15 150)',
  amber: 'oklch(74% 0.13 82)',
  red: 'oklch(64% 0.19 22)',
  grid: 'oklch(94% 0.005 280)'
};

interface FleetViewProps {
  vehicles: Vehicle[];
}

export default function FleetView({ vehicles }: FleetViewProps) {
  const chartFleetRef = useRef<HTMLCanvasElement | null>(null);
  const chartScatterRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let fleetChart: Chart | null = null;
    let scatterChart: Chart | null = null;

    if (chartFleetRef.current) {
      fleetChart = new Chart(chartFleetRef.current, {
        type: 'bar',
        data: {
          labels: ['Box Truck', 'CDD', 'Fuso', 'Van', 'Motor', 'Trailer'],
          datasets: [
            {
              data: [78, 82, 71, 84, 89, 63],
              backgroundColor: [P.amber, P.green, P.orange, P.green, P.green, P.orange],
              borderRadius: 5
            }
          ]
        },
        options: {
          indexAxis: 'y',
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
                color: P.grid,
                drawTicks: false
              },
              border: {
                display: false
              },
              max: 100,
              ticks: {
                callback: (v) => v + '%'
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    if (chartScatterRef.current) {
      const scatterPoints = Array.from({ length: 35 }, () => ({
        x: +(3 + Math.random() * 3.5).toFixed(1),
        y: +(55 + Math.random() * 40).toFixed(0)
      }));

      scatterChart = new Chart(chartScatterRef.current, {
        type: 'scatter',
        data: {
          datasets: [
            {
              data: scatterPoints,
              backgroundColor: P.orangeSoft,
              borderColor: P.orange,
              borderWidth: 1.5,
              pointRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (c: any) => `${c.raw.x} km/L, ${c.raw.y}% load`
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: P.grid,
                drawTicks: false
              },
              border: {
                display: false
              },
              title: {
                display: true,
                text: 'km/L'
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
              max: 100,
              title: {
                display: true,
                text: 'load %'
              }
            }
          }
        }
      });
    }

    return () => {
      if (fleetChart) fleetChart.destroy();
      if (scatterChart) scatterChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-fleet">
      <div className="grid g-1-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Utilization per Vehicle Type</div>
              <div className="card-sub">Rata-rata 30 hari</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartFleetRef} id="c_fleet"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Fuel Efficiency vs Load Factor</div>
              <div className="card-sub">Tiap titik satu kendaraan</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartScatterRef} id="c_scatter"></canvas>
          </div>
        </div>
      </div>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Depot</th>
              <th className="num">Utilization</th>
              <th className="num">Idle</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="fleetRows">
            {vehicles.map((vehicle, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{vehicle.plate}</td>
                <td className="muted">{vehicle.type}</td>
                <td className="muted">{vehicle.depot}</td>
                <td className="num">{vehicle.utilization}%</td>
                <td className="num">{vehicle.idle}%</td>
                <td>
                  <span className={`pill ${vehicle.statusClass}`}>{vehicle.statusText}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
