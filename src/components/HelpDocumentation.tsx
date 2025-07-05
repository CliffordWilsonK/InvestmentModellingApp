import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Book, Calculator, TrendingUp, AlertCircle } from 'lucide-react';

export const HelpDocumentation: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Book,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            This Financial Modeling Application helps you analyze investment projects by calculating key financial metrics 
            and assessing risks. The tool provides comprehensive analysis including NPV, IRR, payback period, and Monte Carlo simulations.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Key Features:</h4>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Real-time financial calculations</li>
              <li>Scenario analysis (best, base, worst case)</li>
              <li>Monte Carlo risk assessment</li>
              <li>Interactive visualizations</li>
              <li>Excel export functionality</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'parameters',
      title: 'Input Parameters',
      icon: Calculator,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Basic Parameters</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Initial Investment:</strong> Total upfront capital required</li>
                <li><strong>Working Capital:</strong> Additional capital needed for operations</li>
                <li><strong>Terminal Value:</strong> Expected value at project end</li>
                <li><strong>Project Timeline:</strong> Duration in years</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Rates & Assumptions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Tax Rate:</strong> Corporate tax rate (typically 15-35%)</li>
                <li><strong>Discount Rate:</strong> Required rate of return (WACC)</li>
                <li><strong>Depreciation Rate:</strong> Annual depreciation percentage</li>
                <li><strong>Terminal Growth Rate:</strong> Long-term growth assumption</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'metrics',
      title: 'Financial Metrics',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Net Present Value (NPV)</h4>
              <p className="text-sm text-gray-600 mb-2">
                Sum of present values of all cash flows. A positive NPV indicates the project adds value.
              </p>
              <div className="bg-green-50 p-2 rounded text-sm">
                <strong>Decision Rule:</strong> Accept if NPV &gt; 0
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Internal Rate of Return (IRR)</h4>
              <p className="text-sm text-gray-600 mb-2">
                Discount rate that makes NPV equal to zero. Represents the project's expected return.
              </p>
              <div className="bg-green-50 p-2 rounded text-sm">
                <strong>Decision Rule:</strong> Accept if IRR &gt; Required Return
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Payback Period</h4>
              <p className="text-sm text-gray-600 mb-2">
                Time required to recover the initial investment from cash flows.
              </p>
              <div className="bg-yellow-50 p-2 rounded text-sm">
                <strong>Note:</strong> Shorter payback periods are generally preferred
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'scenarios',
      title: 'Scenario Analysis',
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Scenario analysis evaluates how changes in key variables affect project outcomes:
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Best Case Scenario</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Revenues 20% higher than base case</li>
                <li>• Operating costs 10% lower than base case</li>
                <li>• Optimistic market conditions</li>
              </ul>
            </div>
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Base Case Scenario</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Most likely outcomes</li>
                <li>• Conservative estimates</li>
                <li>• Expected market conditions</li>
              </ul>
            </div>
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Worst Case Scenario</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Revenues 20% lower than base case</li>
                <li>• Operating costs 15% higher than base case</li>
                <li>• Pessimistic market conditions</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'montecarlo',
      title: 'Monte Carlo Simulation',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Monte Carlo simulation uses random sampling to model uncertainty and risk:
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">How It Works:</h4>
            <ol className="list-decimal list-inside text-purple-700 space-y-1">
              <li>Randomly vary key parameters (revenues, costs, discount rate)</li>
              <li>Calculate NPV for each iteration</li>
              <li>Repeat thousands of times</li>
              <li>Analyze the distribution of outcomes</li>
            </ol>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Key Outputs</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Expected NPV</li>
                <li>• Probability of positive NPV</li>
                <li>• Value at Risk (VaR)</li>
                <li>• Confidence intervals</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Risk Assessment</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Distribution of outcomes</li>
                <li>• Downside risk quantification</li>
                <li>• Sensitivity to assumptions</li>
                <li>• Robust decision making</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'export',
      title: 'Excel Export',
      icon: Book,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Export your complete financial analysis to Excel for further analysis or presentation:
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Excel Export Includes:</h4>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Input parameters and assumptions</li>
              <li>Detailed financial metrics</li>
              <li>Year-by-year cash flow analysis</li>
              <li>Scenario comparison table</li>
              <li>Monte Carlo simulation results</li>
              <li>Risk analysis summary</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Best Practices:</h4>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>Review all inputs before exporting</li>
              <li>Run Monte Carlo simulation for complete analysis</li>
              <li>Use exported data for presentations and reports</li>
              <li>Archive models for future reference</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <HelpCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Help & Documentation</h2>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <section.icon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800">{section.title}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSection === section.id && (
              <div className="px-4 pb-4 border-t border-gray-200">
                <div className="pt-4">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Need More Help?</h3>
        <p className="text-sm text-gray-600">
          This financial modeling tool follows standard financial analysis practices. For complex projects, 
          consider consulting with a financial professional or investment advisor.
        </p>
      </div>
    </div>
  );
};