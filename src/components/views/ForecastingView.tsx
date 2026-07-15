import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { RISK_ITEMS } from '../../data';

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

export default function ForecastingView() {
  const chartForecastRef = useRef<HTMLCanvasElement | null>(null);
  const chartFeatureRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let forecastChart: Chart | null = null;
    let featureChart: Chart | null = null;

    if (chartForecastRef.current) {
      forecastChart = new Chart(chartForecastRef.current, {
        type: 'line',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
          datasets: [
            {
              label: 'Lower',
              data: [84, 87, 85, 90, 92, 95, 97, 98],
              borderColor: 'transparent',
              pointRadius: 0
            },
            {
              label: 'Upper',
              data: [96, 100, 102, 107, 109, 112, 115, 118],
              borderColor: 'transparent',
              backgroundColor: P.orangeSoft,
              fill: '-1',
              pointRadius: 0
            },
            {
              label: 'Forecast',
              data: [90, 94, 93, 98, 100, 104, 106, 110],
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
                callback: (v) => v + 'k'
              }
            }
          }
        }
      });
    }

    if (chartFeatureRef.current) {
      featureChart = new Chart(chartFeatureRef.current, {
        type: 'bar',
        data: {
          labels: ['Traffic', 'Hub dwell', 'Driver change', 'Weather', 'Load factor', 'Missed scan'],
          datasets: [
            {
              data: [28, 23, 17, 12, 11, 9],
              backgroundColor: [P.orange, P.blue, P.amber, P.green, P.red, P.gray],
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

    return () => {
      if (forecastChart) forecastChart.destroy();
      if (featureChart) featureChart.destroy();
    };
  }, []);

  return (
    <div className="view active" id="v-forecast">
      <div className="grid g-2-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Demand Forecast per Region</div>
              <div className="card-sub">Baseline dengan confidence band</div>
            </div>
          </div>
          <div className="chart-box">
            <canvas ref={chartForecastRef} id="c_forecast"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Risk Model Output</div>
              <div className="card-sub">Delay, maintenance, anomaly</div>
            </div>
          </div>
          <div id="riskList">
            {RISK_ITEMS.map((risk, index) => (
              <div className="metric-row" key={index}>
                <span>{risk.label}</span>
                <strong style={{ color: risk.color }}>{risk.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Feature Importance</div>
            <div className="card-sub">Faktor pendorong keterlambatan</div>
          </div>
        </div>
        <div className="chart-box sm">
          <canvas ref={chartFeatureRef} id="c_feature"></canvas>
        </div>
      </div>
    </div>
  );
}
