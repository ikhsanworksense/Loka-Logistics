import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { SUPPLIERS } from '../../data';

const P = {
  orange: 'oklch(68% 0.19 42)',
  blue: 'oklch(58% 0.11 250)',
  green: 'oklch(64% 0.15 150)',
  amber: 'oklch(74% 0.13 82)',
  red: 'oklch(64% 0.19 22)',
  gray: 'oklch(85% 0.01 280)',
  grid: 'oklch(94% 0.005 280)'
};

export default function ProcurementView() {
  const chartSpendRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let spendChart: Chart | null = null;

    if (chartSpendRef.current) {
      spendChart = new Chart(chartSpendRef.current, {
        type: 'bar',
        data: {
          labels: ['Fuel', 'Tires', 'Spareparts', 'Cold-chain', '3PL', 'Packaging'],
          datasets: [
            {
              data: [4.2, 1.8, 1.6, 1.2, 2.3, 0.9],
              backgroundColor: [P.orange, P.amber, P.blue, P.green, P.gray, P.red],
              borderRadius: 5
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
                callback: (v) => '$' + v + 'M'
              }
            }
          }
        }
      });
    }

    return () => {
      if (spendChart) spendChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-proc">
      <div className="grid g-1-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Spend by Category</div>
              <div className="card-sub">Bulan berjalan, $M</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartSpendRef} id="c_spend"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Supplier Scorecard</div>
              <div className="card-sub">Delivery, quality, variance</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th className="num">OT</th>
                <th className="num">Defect</th>
                <th className="num">Var</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="supplierTable">
              {SUPPLIERS.map((sup, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{sup.name}</td>
                  <td className="num">{sup.ot}%</td>
                  <td className="num">{sup.defect}%</td>
                  <td className="num">{sup.var}%</td>
                  <td>
                    <span className={`pill ${sup.statusClass}`}>{sup.statusText}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
