import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Minus, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { ProjectParameters } from '../types/financial';

interface ParametersFormProps {
  onParametersChange: (params: ProjectParameters) => void;
}

export const ParametersForm: React.FC<ParametersFormProps> = ({ onParametersChange }) => {
  const [params, setParams] = useState<ProjectParameters>({
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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form on parameter changes
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (params.initialInvestment <= 0) {
      errors.initialInvestment = 'Initial investment must be greater than 0';
    }
    
    if (params.projectTimeline < 1 || params.projectTimeline > 20) {
      errors.projectTimeline = 'Project timeline must be between 1 and 20 years';
    }
    
    if (params.taxRate < 0 || params.taxRate > 1) {
      errors.taxRate = 'Tax rate must be between 0% and 100%';
    }
    
    if (params.discountRate < 0 || params.discountRate > 1) {
      errors.discountRate = 'Discount rate must be between 0% and 100%';
    }
    
    if (params.depreciationRate < 0 || params.depreciationRate > 1) {
      errors.depreciationRate = 'Depreciation rate must be between 0% and 100%';
    }
    
    if (params.terminalGrowthRate < 0 || params.terminalGrowthRate > 0.1) {
      errors.terminalGrowthRate = 'Terminal growth rate must be between 0% and 10%';
    }
    
    // Check if all annual revenues and costs are valid
    params.annualRevenues.forEach((revenue, index) => {
      if (revenue < 0) {
        errors[`revenue_${index}`] = 'Revenue cannot be negative';
      }
    });
    
    params.operatingCosts.forEach((cost, index) => {
      if (cost < 0) {
        errors[`cost_${index}`] = 'Operating cost cannot be negative';
      }
    });
    
    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [params]);

  const updateParams = (newParams: Partial<ProjectParameters>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    onParametersChange(updatedParams);
  };

  const updateArrayValue = (array: number[], index: number, value: number, field: 'annualRevenues' | 'operatingCosts') => {
    const newArray = [...array];
    newArray[index] = value;
    updateParams({ [field]: newArray });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const hasError = validationErrors[fieldName];
    return hasError 
      ? `${baseClasses} border-red-300 bg-red-50` 
      : `${baseClasses} border-gray-300`;
  };

  const addYear = () => {
    const newTimeline = params.projectTimeline + 1;
    const newRevenues = [...params.annualRevenues, params.annualRevenues[params.annualRevenues.length - 1] || 0];
    const newCosts = [...params.operatingCosts, params.operatingCosts[params.operatingCosts.length - 1] || 0];
    
    updateParams({
      projectTimeline: newTimeline,
      annualRevenues: newRevenues,
      operatingCosts: newCosts
    });
  };

  const removeYear = () => {
    if (params.projectTimeline > 1) {
      const newTimeline = params.projectTimeline - 1;
      const newRevenues = params.annualRevenues.slice(0, newTimeline);
      const newCosts = params.operatingCosts.slice(0, newTimeline);
      
      updateParams({
        projectTimeline: newTimeline,
        annualRevenues: newRevenues,
        operatingCosts: newCosts
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Project Parameters</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isFormValid ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Form Valid</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Validation Errors</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Status Alert */}
      {!isFormValid && Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                {Object.values(validationErrors).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Guidance Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">How to use this form:</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• <strong>Initial Investment:</strong> Total upfront capital required for the project</li>
              <li>• <strong>Project Timeline:</strong> Number of years for the financial projection (1-20 years)</li>
              <li>• <strong>Annual Revenues & Costs:</strong> Year-by-year projections for revenue and operating expenses</li>
              <li>• <strong>Rates:</strong> Tax rate, discount rate, depreciation rate, and terminal growth rate</li>
              <li>• <strong>Working Capital:</strong> Additional capital needed for day-to-day operations</li>
              <li>• <strong>Terminal Value:</strong> Estimated value at the end of the project timeline</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Parameters</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Initial Investment ($)
              <span className="text-blue-500 ml-1 cursor-help" title="Total upfront investment required">
                <Info className="w-4 h-4 inline" />
              </span>
            </label>
            <input
              type="number"
              value={params.initialInvestment}
              onChange={(e) => updateParams({ initialInvestment: Number(e.target.value) })}
              className={getInputClassName('initialInvestment')}
              placeholder="Enter initial investment amount"
              min="0"
              step="1000"
            />
            {validationErrors.initialInvestment && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.initialInvestment}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Project Timeline (Years)
            </label>
            <input
              type="number"
              value={params.projectTimeline}
              onChange={(e) => updateParams({ projectTimeline: Number(e.target.value) })}
              className={getInputClassName('projectTimeline')}
              placeholder="Enter project timeline"
              min="1"
              max="20"
              step="1"
            />
            {validationErrors.projectTimeline && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.projectTimeline}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Working Capital ($)
            </label>
            <input
              type="number"
              value={params.workingCapital}
              onChange={(e) => updateParams({ workingCapital: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter working capital requirement"
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Terminal Value ($)
            </label>
            <input
              type="number"
              value={params.terminalValue}
              onChange={(e) => updateParams({ terminalValue: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter terminal value"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {/* Rates and Assumptions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Rates & Assumptions</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={params.taxRate * 100}
              onChange={(e) => updateParams({ taxRate: Number(e.target.value) / 100 })}
              className={getInputClassName('taxRate')}
              placeholder="Enter tax rate percentage"
              min="0"
              max="100"
              step="0.1"
            />
            {validationErrors.taxRate && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.taxRate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Discount Rate (%)
            </label>
            <input
              type="number"
              value={params.discountRate * 100}
              onChange={(e) => updateParams({ discountRate: Number(e.target.value) / 100 })}
              className={getInputClassName('discountRate')}
              placeholder="Enter discount rate percentage"
              min="0"
              max="100"
              step="0.1"
            />
            {validationErrors.discountRate && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.discountRate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Depreciation Rate (%)
            </label>
            <input
              type="number"
              value={params.depreciationRate * 100}
              onChange={(e) => updateParams({ depreciationRate: Number(e.target.value) / 100 })}
              className={getInputClassName('depreciationRate')}
              placeholder="Enter depreciation rate percentage"
              min="0"
              max="100"
              step="0.1"
            />
            {validationErrors.depreciationRate && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.depreciationRate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Terminal Growth Rate (%)
            </label>
            <input
              type="number"
              value={params.terminalGrowthRate * 100}
              onChange={(e) => updateParams({ terminalGrowthRate: Number(e.target.value) / 100 })}
              className={getInputClassName('terminalGrowthRate')}
              placeholder="Enter terminal growth rate percentage"
              min="0"
              max="10"
              step="0.1"
            />
            {validationErrors.terminalGrowthRate && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.terminalGrowthRate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Annual Projections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Annual Projections</h3>
          <div className="flex space-x-2">
            <button
              onClick={addYear}
              className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Year</span>
            </button>
            <button
              onClick={removeYear}
              disabled={params.projectTimeline <= 1}
              className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
              <span>Remove Year</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Revenue ($)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Operating Costs ($)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: params.projectTimeline }, (_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    Year {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={params.annualRevenues[index] || 0}
                      onChange={(e) => updateArrayValue(params.annualRevenues, index, Number(e.target.value), 'annualRevenues')}
                      className={`w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors[`revenue_${index}`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter revenue"
                      min="0"
                      step="1000"
                    />
                    {validationErrors[`revenue_${index}`] && (
                      <p className="mt-1 text-xs text-red-600">{validationErrors[`revenue_${index}`]}</p>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={params.operatingCosts[index] || 0}
                      onChange={(e) => updateArrayValue(params.operatingCosts, index, Number(e.target.value), 'operatingCosts')}
                      className={`w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors[`cost_${index}`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter operating cost"
                      min="0"
                      step="1000"
                    />
                    {validationErrors[`cost_${index}`] && (
                      <p className="mt-1 text-xs text-red-600">{validationErrors[`cost_${index}`]}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Project Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Investment:</span>
            <div className="font-semibold">{formatCurrency(params.initialInvestment + params.workingCapital)}</div>
          </div>
          <div>
            <span className="text-gray-600">Total Revenue:</span>
            <div className="font-semibold">{formatCurrency(params.annualRevenues.reduce((sum, rev) => sum + rev, 0))}</div>
          </div>
          <div>
            <span className="text-gray-600">Total Costs:</span>
            <div className="font-semibold">{formatCurrency(params.operatingCosts.reduce((sum, cost) => sum + cost, 0))}</div>
          </div>
          <div>
            <span className="text-gray-600">Project Duration:</span>
            <div className="font-semibold">{params.projectTimeline} years</div>
          </div>
        </div>
      </div>
    </div>
  );
};