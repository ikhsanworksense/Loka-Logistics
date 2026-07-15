import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const P = {
  orange: 'oklch(68% 0.19 42)',
  orangeSoft: 'oklch(68% 0.19 42 / .14)',
  blue: 'oklch(58% 0.11 250)',
  green: 'oklch(64% 0.15 150)',
  amber: 'oklch(74% 0.13 82)',
  red: 'oklch(64% 0.19 22)',
  gray: 'oklch(85% 0.01 280)',
  grid: 'oklch(94% 0.005 280)'
};

export default function FinanceView() {
  const chartMarginRef = useRef<HTMLCanvasElement | null>(null);
  const chartCostBreakRef = useRef<HTMLCanvasElement | null>(null);
  const chartProfitRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let marginChart: Chart | null = null;
    let costBreakChart: Chart | null = null;
    let profitChart: Chart | null = null;

    if (chartMarginRef.current) {
      marginChart = new Chart(chartMarginRef.current, {
        type: 'bar',
        data: {
          labels: ['Revenue', 'Fuel', 'Labor', 'Toll', 'Maint.', 'Net'],
          datasets: [
            {
              data: [100, -29, -18, -8, -6, 39],
              backgroundColor: [P.blue, P.orange, P.amber, P.gray, P.red, P.green],
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
                callback: (v) => v + '%'
              }
            }
          }
        }
      });
    }

    if (chartCostBreakRef.current) {
      costBreakChart = new Chart(chartCostBreakRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Fuel', 'Labor', 'Linehaul', 'Toll', 'Maint.', 'Access.'],
          datasets: [
            {
              data: [26, 22, 18, 11, 9, 14],
              backgroundColor: [P.orange, P.amber, P.blue, P.green, P.gray, P.red],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }

    if (chartProfitRef.current) {
      profitChart = new Chart(chartProfitRef.current, {
        type: 'bubble',
        data: {
          datasets: [
            {
              data: [
                { x: 18, y: 24, r: 18 },
                { x: 11, y: 21, r: 14 },
                { x: 8, y: 17, r: 12 },
                { x: 22, y: 26, r: 20 },
                { x: 6, y: 15, r: 10 }
              ],
              backgroundColor: P.orangeSoft,
              borderColor: P.orange,
              borderWidth: 1.5
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
                label: (c: any) => `Vol ${c.raw.x}k, margin ${c.raw.y}%`
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
                text: 'volume (k)'
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
              title: {
                display: true,
                text: 'margin %'
              }
            }
          }
        }
      });
    }

    return () => {
      if (marginChart) marginChart.destroy();
      if (costBreakChart) costBreakChart.destroy();
      if (profitChart) profitChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-cost">
      <div className="grid g-1-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Margin Waterfall</div>
              <div className="card-sub">Revenue ke net margin</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartMarginRef} id="c_margin"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Cost Breakdown</div>
              <div className="card-sub">Komponen biaya logistik</div>
            </div>
          </div>
          <div className="chart-box sm">
            <canvas ref={chartCostBreakRef} id="c_costbreak"></canvas>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Profitability Matrix</div>
            <div className="card-sub">Customer per volume dan margin</div>
          </div>
        </div>
        <div className="chart-box">
          <canvas ref={chartProfitRef} id="c_profit"></canvas>
        </div>
      </div>
    </div>
  );
}
