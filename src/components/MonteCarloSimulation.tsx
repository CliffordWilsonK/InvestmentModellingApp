import React, { useState } from 'react';
import { Play, Download, BarChart3, TrendingUp } from 'lucide-react';
import { ProjectParameters, MonteCarloResult } from '../types/financial';
import { FinancialCalculator } from '../utils/financialCalculations';

interface MonteCarloSimulationProps {
  parameters: ProjectParameters;
}

export const MonteCarloSimulation: React.FC<MonteCarloSimulationProps> = ({ parameters }) => {
  const [results, setResults] = useState<MonteCarloResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(1000);

  const runSimulation = async () => {
    setIsRunning(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const simulationResults = FinancialCalculator.runMonteCarloSimulation(parameters, iterations);
    setResults(simulationResults);
    setIsRunning(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getConfidenceLevel = (probability: number) => {
    if (probability >= 0.8) return { level: 'High', color: 'bg-green-100 text-green-800' };
    if (probability >= 0.6) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-red-100 text-red-800' };
  };

  const confidence = results ? getConfidenceLevel(results.probabilityOfPositiveNPV) : null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Monte Carlo Simulation</h2>
      </div>

      {/* Simulation Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-600">Iterations:</label>
          <select
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isRunning}
          >
            <option value={500}>500</option>
            <option value={1000}>1,000</option>
            <option value={2000}>2,000</option>
            <option value={5000}>5,000</option>
          </select>
        </div>
        
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>{isRunning ? 'Running...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Loading State */}
      {isRunning && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Running {iterations.toLocaleString()} iterations...</span>
        </div>
      )}

      {/* Results */}
      {results && !isRunning && (
        <div className="space-y-6">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Expected NPV</p>
                  <p className="text-xl font-bold text-blue-800">
                    {formatCurrency(results.expectedNPV)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Success Probability</p>
                  <p className="text-xl font-bold text-green-800">
                    {(results.probabilityOfPositiveNPV * 100).toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-purple-600">Confidence Level</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${confidence?.color}`}>
                  {confidence?.level}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-orange-600">Iterations</p>
                <p className="text-xl font-bold text-orange-800">
                  {iterations.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* NPV Percentiles */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">NPV Percentiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">10th Percentile</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(results.npvPercentiles.p10)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">25th Percentile</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(results.npvPercentiles.p25)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Median (50th)</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(results.npvPercentiles.p50)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">75th Percentile</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(results.npvPercentiles.p75)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">90th Percentile</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(results.npvPercentiles.p90)}
                </p>
              </div>
            </div>
          </div>

          {/* Distribution Visualization */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">NPV Distribution</h3>
            <div className="h-64 flex items-end justify-center space-x-1">
              {/* Simple histogram visualization */}
              {Array.from({ length: 20 }, (_, i) => {
                const min = Math.min(...results.npvDistribution);
                const max = Math.max(...results.npvDistribution);
                const bucketSize = (max - min) / 20;
                const bucketStart = min + i * bucketSize;
                const bucketEnd = bucketStart + bucketSize;
                
                const count = results.npvDistribution.filter(
                  npv => npv >= bucketStart && npv < bucketEnd
                ).length;
                
                const height = (count / iterations) * 100;
                
                return (
                  <div
                    key={i}
                    className="bg-blue-500 opacity-80 w-4 transition-all duration-300 hover:opacity-100"
                    style={{ height: `${height * 2}px` }}
                    title={`${count} values between ${formatCurrency(bucketStart)} and ${formatCurrency(bucketEnd)}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              NPV Distribution ({iterations.toLocaleString()} simulations)
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Probability of Loss (NPV &lt; 0)</span>
                <span className="font-semibold text-red-600">
                  {((1 - results.probabilityOfPositiveNPV) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Probability of Break-even or Better</span>
                <span className="font-semibold text-green-600">
                  {(results.probabilityOfPositiveNPV * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Value at Risk (10th percentile)</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(results.npvPercentiles.p10)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};