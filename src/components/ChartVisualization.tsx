import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FinancialMetrics, ScenarioAnalysis } from '../types/financial';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartVisualizationProps {
  metrics: FinancialMetrics;
  scenarios: ScenarioAnalysis;
}

export const ChartVisualization: React.FC<ChartVisualizationProps> = ({ metrics, scenarios }) => {
  // Cash Flow Chart Data
  const cashFlowData = {
    labels: metrics.freeCashFlows.map((_, index) => `Year ${index}`),
    datasets: [
      {
        label: 'Free Cash Flow',
        data: metrics.freeCashFlows,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Cumulative Cash Flow',
        data: metrics.cumulativeCashFlows,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Present Value Waterfall Chart
  const presentValueData = {
    labels: metrics.presentValues.map((_, index) => `Year ${index}`),
    datasets: [
      {
        label: 'Present Value',
        data: metrics.presentValues,
        backgroundColor: metrics.presentValues.map(value => 
          value >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: metrics.presentValues.map(value => 
          value >= 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 2
      }
    ]
  };

  // Scenario Comparison Chart
  const scenarioData = {
    labels: ['NPV', 'IRR (%)', 'ROI (%)'],
    datasets: [
      {
        label: 'Best Case',
        data: [
          scenarios.bestCase.npv / 1000, // Convert to thousands for better visualization
          scenarios.bestCase.irr * 100,
          scenarios.bestCase.roi
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: 'Base Case',
        data: [
          scenarios.baseCase.npv / 1000,
          scenarios.baseCase.irr * 100,
          scenarios.baseCase.roi
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Worst Case',
        data: [
          scenarios.worstCase.npv / 1000,
          scenarios.worstCase.irr * 100,
          scenarios.worstCase.roi
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }
    ]
  };

  // Risk Distribution Chart
  const riskData = {
    labels: ['Positive NPV', 'Negative NPV'],
    datasets: [
      {
        data: [
          metrics.npv > 0 ? 75 : 25, // Simplified risk representation
          metrics.npv > 0 ? 25 : 75
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Scenario Comparison'
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Risk Assessment',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Cash Flow Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow Analysis</h3>
        <div className="h-80">
          <Line 
            data={cashFlowData} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'Free Cash Flow vs Cumulative Cash Flow'
                }
              }
            }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Present Value Waterfall */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Present Value Waterfall</h3>
          <div className="h-64">
            <Bar 
              data={presentValueData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Present Value by Year'
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
          <div className="h-64">
            <Doughnut data={riskData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Scenario Comparison</h3>
        <div className="h-80">
          <Bar data={scenarioData} options={barChartOptions} />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>* NPV values are shown in thousands for better visualization</p>
        </div>
      </div>
    </div>
  );
};