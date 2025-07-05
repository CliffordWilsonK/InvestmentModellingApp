import React, { useState, useEffect } from 'react';
import { Calculator, Download, FileText, BarChart3, Settings, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { ParametersForm } from './components/ParametersForm';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ChartVisualization } from './components/ChartVisualization';
import { MonteCarloSimulation } from './components/MonteCarloSimulation';
import { HelpDocumentation } from './components/HelpDocumentation';
import FinancialReports from './components/FinancialReports';
import { ProjectParameters, FinancialMetrics, ScenarioAnalysis, MonteCarloResult } from './types/financial';
import { FinancialCalculator } from './utils/financialCalculations';
import { ExcelExporter } from './utils/excelExport';

function App() {
  const [activeTab, setActiveTab] = useState<'parameters' | 'metrics' | 'charts' | 'reports' | 'monte-carlo' | 'help'>('parameters');
  const [parameters, setParameters] = useState<ProjectParameters>({
    initialInvestment: 0,
    projectTimeline: 1,
    annualRevenues: [0],
    operatingCosts: [0],
    taxRate: 0.25,
    discountRate: 0.10,
    depreciationRate: 0.20,
    workingCapital: 0,
    terminalGrowthRate: 0.02,
    terminalValue: 0
  });
  
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioAnalysis | null>(null);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResult | null>(null);

  useEffect(() => {
    // Recalculate metrics when parameters change
    const calculatedMetrics = FinancialCalculator.calculateMetrics(parameters);
    const scenarioAnalysis = FinancialCalculator.calculateScenarioAnalysis(parameters);
    
    setMetrics(calculatedMetrics);
    setScenarios(scenarioAnalysis);
  }, [parameters]);

  const handleParametersChange = (newParameters: ProjectParameters) => {
    setParameters(newParameters);
  };

  const handleExportToExcel = () => {
    if (metrics && scenarios) {
      const monteCarloData = monteCarloResults || FinancialCalculator.runMonteCarloSimulation(parameters);
      ExcelExporter.exportFinancialModel(parameters, metrics, scenarios, monteCarloData);
    }
  };

  const tabs = [
    { id: 'parameters', label: 'Parameters', icon: Settings },
    { id: 'metrics', label: 'Metrics', icon: Calculator },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
    { id: 'reports', label: 'Financial Reports', icon: FileSpreadsheet },
    { id: 'monte-carlo', label: 'Risk Analysis', icon: BarChart3 },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  const getProjectHealthStatus = () => {
    if (!metrics) return { status: 'unknown', color: 'text-gray-500' };
    
    if (metrics.npv > 100000 && metrics.irr > 0.15) {
      return { status: 'Excellent', color: 'text-green-600' };
    } else if (metrics.npv > 0 && metrics.irr > 0.10) {
      return { status: 'Good', color: 'text-blue-600' };
    } else if (metrics.npv > 0) {
      return { status: 'Fair', color: 'text-yellow-600' };
    } else {
      return { status: 'Poor', color: 'text-red-600' };
    }
  };

  const projectHealth = getProjectHealthStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Modeling Suite</h1>
                <p className="text-sm text-gray-500">Professional Investment Analysis Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {metrics && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Project Health:</span>
                  <span className={`text-sm font-semibold ${projectHealth.color}`}>
                    {projectHealth.status}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleExportToExcel}
                disabled={!metrics || !scenarios}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export to Excel</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'parameters' && (
          <ParametersForm onParametersChange={handleParametersChange} />
        )}
        
        {activeTab === 'metrics' && metrics && scenarios && (
          <MetricsDashboard metrics={metrics} scenarios={scenarios} />
        )}
        
        {activeTab === 'charts' && metrics && scenarios && (
          <ChartVisualization metrics={metrics} scenarios={scenarios} />
        )}
        
        {activeTab === 'reports' && (
          <FinancialReports parameters={parameters} />
        )}
        
        {activeTab === 'monte-carlo' && (
          <MonteCarloSimulation 
            parameters={parameters} 
          />
        )}
        
        {activeTab === 'help' && (
          <HelpDocumentation />
        )}
        
        {/* Loading state for other tabs when metrics not available */}
        {(activeTab === 'metrics' || activeTab === 'charts') && (!metrics || !scenarios) && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Calculating financial metrics...</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Professional Financial Modeling Tool - Built with modern web technologies
              </span>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 Financial Modeling Suite. All calculations follow standard financial practices.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;