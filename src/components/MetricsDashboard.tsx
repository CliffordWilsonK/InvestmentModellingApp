import React from 'react';
import { TrendingUp, DollarSign, Clock, Target, BarChart3, AlertTriangle } from 'lucide-react';
import { FinancialMetrics, ScenarioAnalysis } from '../types/financial';

interface MetricsDashboardProps {
  metrics: FinancialMetrics;
  scenarios: ScenarioAnalysis;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics, scenarios }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getMetricColor = (value: number, threshold: number = 0) => {
    if (value > threshold) return 'text-green-600';
    if (value > threshold * 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (npv: number) => {
    if (npv > 100000) return { level: 'Low', color: 'bg-green-100 text-green-800' };
    if (npv > 0) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'High', color: 'bg-red-100 text-red-800' };
  };

  const risk = getRiskLevel(metrics.npv);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Present Value</p>
              <p className={`text-2xl font-bold ${getMetricColor(metrics.npv)}`}>
                {formatCurrency(metrics.npv)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Internal Rate of Return</p>
              <p className={`text-2xl font-bold ${getMetricColor(metrics.irr, 0.1)}`}>
                {formatPercentage(metrics.irr)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payback Period</p>
              <p className="text-2xl font-bold text-gray-800">
                {metrics.paybackPeriod.toFixed(1)} years
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return on Investment</p>
              <p className={`text-2xl font-bold ${getMetricColor(metrics.roi)}`}>
                {metrics.roi.toFixed(2)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* EBITDA and Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">EBITDA Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">EBITDA Margin</span>
              <span className={`font-semibold ${getMetricColor(metrics.ebitdaMargin)}`}>
                {metrics.ebitdaMargin.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, metrics.ebitdaMargin))}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Risk Assessment</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Risk Level</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${risk.color}`}>
                {risk.level}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Based on NPV and cash flow analysis
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Scenario Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Scenario</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">NPV</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">IRR</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Payback</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-green-600">Best Case</td>
                <td className="px-4 py-2 text-green-600">{formatCurrency(scenarios.bestCase.npv)}</td>
                <td className="px-4 py-2 text-green-600">{formatPercentage(scenarios.bestCase.irr)}</td>
                <td className="px-4 py-2 text-green-600">{scenarios.bestCase.paybackPeriod.toFixed(1)} years</td>
                <td className="px-4 py-2 text-green-600">{scenarios.bestCase.roi.toFixed(2)}%</td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-blue-600">Base Case</td>
                <td className="px-4 py-2">{formatCurrency(scenarios.baseCase.npv)}</td>
                <td className="px-4 py-2">{formatPercentage(scenarios.baseCase.irr)}</td>
                <td className="px-4 py-2">{scenarios.baseCase.paybackPeriod.toFixed(1)} years</td>
                <td className="px-4 py-2">{scenarios.baseCase.roi.toFixed(2)}%</td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-red-600">Worst Case</td>
                <td className="px-4 py-2 text-red-600">{formatCurrency(scenarios.worstCase.npv)}</td>
                <td className="px-4 py-2 text-red-600">{formatPercentage(scenarios.worstCase.irr)}</td>
                <td className="px-4 py-2 text-red-600">{scenarios.worstCase.paybackPeriod.toFixed(1)} years</td>
                <td className="px-4 py-2 text-red-600">{scenarios.worstCase.roi.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Year</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Free Cash Flow</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Cumulative Cash Flow</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Present Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.freeCashFlows.map((flow, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{index}</td>
                  <td className={`px-4 py-2 ${getMetricColor(flow)}`}>
                    {formatCurrency(flow)}
                  </td>
                  <td className={`px-4 py-2 ${getMetricColor(metrics.cumulativeCashFlows[index])}`}>
                    {formatCurrency(metrics.cumulativeCashFlows[index])}
                  </td>
                  <td className="px-4 py-2">
                    {formatCurrency(metrics.presentValues[index])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};