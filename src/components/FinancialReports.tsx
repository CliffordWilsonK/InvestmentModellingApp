import React, { useState } from 'react';
import { ProjectParameters, FinancialReports as FinancialReportsType } from '../types/financial';
import { FinancialCalculator } from '../utils/financialCalculations';

interface FinancialReportsProps {
  parameters: ProjectParameters;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ parameters }) => {
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow' | 'summary'>('summary');
  const reports: FinancialReportsType = FinancialCalculator.generateFinancialReports(parameters);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const renderIncomeStatement = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border-b text-left font-semibold">Year</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Revenue</th>
            <th className="px-4 py-2 border-b text-right font-semibold">COGS</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Gross Profit</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Op. Expenses</th>
            <th className="px-4 py-2 border-b text-right font-semibold">EBITDA</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Depreciation</th>
            <th className="px-4 py-2 border-b text-right font-semibold">EBIT</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Interest</th>
            <th className="px-4 py-2 border-b text-right font-semibold">EBT</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Tax</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Net Income</th>
            <th className="px-4 py-2 border-b text-right font-semibold">EBITDA Margin</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Net Margin</th>
          </tr>
        </thead>
        <tbody>
          {reports.incomeStatements.map((stmt) => (
            <tr key={stmt.year} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b font-medium">{stmt.year}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.revenue)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.costOfGoodsSold)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.grossProfit)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.operatingExpenses)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.ebitda)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.depreciation)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.ebit)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.interestExpense)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.ebt)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(stmt.taxExpense)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(stmt.netIncome)}</td>
              <td className="px-4 py-2 border-b text-right">{formatPercentage(stmt.ebitdaMargin)}</td>
              <td className="px-4 py-2 border-b text-right">{formatPercentage(stmt.netProfitMargin)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBalanceSheet = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border-b text-left font-semibold">Year</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Cash & Equivalents</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Accounts Receivable</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Inventory</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Prepaid Expenses</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Total Current Assets</th>
            <th className="px-4 py-2 border-b text-right font-semibold">PP&E</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Acc. Depreciation</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Net PPE</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Total Assets</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Accounts Payable</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Accrued Expenses</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Total Current Liabilities</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Long-term Debt</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Total Liabilities</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Common Stock</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Retained Earnings</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Total Equity</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Current Ratio</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Debt/Equity</th>
            <th className="px-4 py-2 border-b text-right font-semibold">ROE</th>
          </tr>
        </thead>
        <tbody>
          {reports.balanceSheets.map((bs) => (
            <tr key={bs.year} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b font-medium">{bs.year}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.cashAndEquivalents)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.accountsReceivable)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.inventory)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.prepaidExpenses)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(bs.totalCurrentAssets)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.propertyPlantEquipment)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.accumulatedDepreciation)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.netPPE)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(bs.totalAssets)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.accountsPayable)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.accruedExpenses)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(bs.totalCurrentLiabilities)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.longTermDebt)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(bs.totalLiabilities)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.commonStock)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(bs.retainedEarnings)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(bs.totalEquity)}</td>
              <td className="px-4 py-2 border-b text-right">{bs.currentRatio.toFixed(2)}</td>
              <td className="px-4 py-2 border-b text-right">{bs.debtToEquityRatio.toFixed(2)}</td>
              <td className="px-4 py-2 border-b text-right">{formatPercentage(bs.returnOnEquity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCashFlowStatement = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border-b text-left font-semibold">Year</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Net Income</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Depreciation</th>
            <th className="px-4 py-2 border-b text-right font-semibold">WC Changes</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Operating CF</th>
            <th className="px-4 py-2 border-b text-right font-semibold">CapEx</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Investing CF</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Debt Issuance</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Debt Repayment</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Dividends</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Financing CF</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Net Cash Flow</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Beginning Cash</th>
            <th className="px-4 py-2 border-b text-right font-semibold">Ending Cash</th>
          </tr>
        </thead>
        <tbody>
          {reports.cashFlowStatements.map((cf) => (
            <tr key={cf.year} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b font-medium">{cf.year}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.netIncome)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.depreciation)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.changesInWorkingCapital)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(cf.netOperatingCashFlow)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.capitalExpenditures)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(cf.netInvestingCashFlow)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.debtIssuance)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.debtRepayment)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.dividends)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(cf.netFinancingCashFlow)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(cf.netCashFlow)}</td>
              <td className="px-4 py-2 border-b text-right">{formatCurrency(cf.beginningCashBalance)}</td>
              <td className="px-4 py-2 border-b text-right font-semibold">{formatCurrency(cf.endingCashBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Statement Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Revenue:</span>
            <span className="font-semibold">{formatCurrency(reports.summary.totalRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Net Income:</span>
            <span className="font-semibold">{formatCurrency(reports.summary.totalNetIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Net Profit Margin:</span>
            <span className="font-semibold">
              {formatPercentage((reports.summary.totalNetIncome / reports.summary.totalRevenue) * 100)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Balance Sheet Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Assets:</span>
            <span className="font-semibold">{formatCurrency(reports.summary.totalAssets)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Liabilities:</span>
            <span className="font-semibold">{formatCurrency(reports.summary.totalLiabilities)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Equity:</span>
            <span className="font-semibold">{formatCurrency(reports.summary.totalEquity)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Debt/Equity Ratio:</span>
            <span className="font-semibold">
              {(reports.summary.totalLiabilities / reports.summary.totalEquity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Cumulative Cash Flow:</span>
            <span className="font-semibold">{formatCurrency(reports.summary.cumulativeCashFlow)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Initial Investment:</span>
            <span className="font-semibold">{formatCurrency(parameters.initialInvestment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ROI:</span>
            <span className="font-semibold">
              {formatPercentage((reports.summary.cumulativeCashFlow / parameters.initialInvestment) * 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Reports</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'summary'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'income'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Income Statement
        </button>
        <button
          onClick={() => setActiveTab('balance')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'balance'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'cashflow'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Cash Flow
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'income' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Income Statement</h3>
            {renderIncomeStatement()}
          </div>
        )}
        {activeTab === 'balance' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Balance Sheet</h3>
            {renderBalanceSheet()}
          </div>
        )}
        {activeTab === 'cashflow' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cash Flow Statement</h3>
            {renderCashFlowStatement()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReports; 