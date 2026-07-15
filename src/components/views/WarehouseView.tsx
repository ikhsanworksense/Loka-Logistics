import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { WAREHOUSES } from '../../data';

const P = {
  orange: 'oklch(68% 0.19 42)',
  blue: 'oklch(58% 0.11 250)',
  green: 'oklch(64% 0.15 150)',
  amber: 'oklch(74% 0.13 82)',
  grid: 'oklch(94% 0.005 280)'
};

export default function WarehouseView() {
  const chartAbcRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let abcChart: Chart | null = null;

    if (chartAbcRef.current) {
      abcChart = new Chart(chartAbcRef.current, {
        data: {
          labels: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'C4'],
          datasets: [
            {
              type: 'bar',
              label: 'Nilai',
              data: [28, 19, 13, 9, 7, 6, 5, 4, 3, 2],
              backgroundColor: P.orange,
              borderRadius: 4
            },
            {
              type: 'line',
              label: 'Kumulatif',
              data: [28, 47, 60, 69, 76, 82, 87, 91, 94, 96],
              borderColor: P.blue,
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 0,
              yAxisID: 'y1'
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
            },
            y1: {
              position: 'right',
              grid: {
                display: false
              },
              min: 0,
              max: 100,
              ticks: {
                callback: (v) => v + '%'
              }
            }
          }
        }
      });
    }

    return () => {
      if (abcChart) abcChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-wh">
      <div className="grid g-2-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">ABC Analysis</div>
              <div className="card-sub">Kontribusi nilai kumulatif per kategori SKU</div>
            </div>
          </div>
          <div className="chart-box">
            <canvas ref={chartAbcRef} id="c_abc"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Warehouse Utilization</div>
              <div className="card-sub">Kapasitas terpakai</div>
            </div>
          </div>
          <table>
            <tbody id="whTable">
              {WAREHOUSES.map((wh, index) => {
                const color = wh.value >= 90 ? P.amber : wh.value >= 70 ? P.orange : P.green;
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{wh.name}</td>
                    <td style={{ width: '45%' }}>
                      <div className="heat">
                        <i style={{ width: `${wh.value}%`, background: color }}></i>
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 700 }}>
                      {wh.value}%
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
