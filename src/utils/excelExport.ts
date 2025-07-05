import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ProjectParameters, FinancialMetrics, ScenarioAnalysis, MonteCarloResult, FinancialReports } from '../types/financial';
import { FinancialCalculator } from './financialCalculations';

export class ExcelExporter {
  static exportFinancialModel(
    params: ProjectParameters,
    metrics: FinancialMetrics,
    scenarios: ScenarioAnalysis,
    monteCarloResults: MonteCarloResult
  ): void {
    const reports = FinancialCalculator.generateFinancialReports(params);
    const workbook = XLSX.utils.book_new();

    // Input Parameters Sheet
    const inputData = [
      ['Parameter', 'Value'],
      ['Initial Investment', params.initialInvestment],
      ['Project Timeline (years)', params.projectTimeline],
      ['Tax Rate (%)', params.taxRate * 100],
      ['Discount Rate (%)', params.discountRate * 100],
      ['Depreciation Rate (%)', params.depreciationRate * 100],
      ['Working Capital', params.workingCapital],
      ['Terminal Growth Rate (%)', params.terminalGrowthRate * 100],
      ['Terminal Value', params.terminalValue],
      [],
      ['Annual Revenues'],
      ...params.annualRevenues.map((rev, index) => [`Year ${index + 1}`, rev]),
      [],
      ['Operating Costs'],
      ...params.operatingCosts.map((cost, index) => [`Year ${index + 1}`, cost])
    ];
    
    const inputSheet = XLSX.utils.aoa_to_sheet(inputData);
    XLSX.utils.book_append_sheet(workbook, inputSheet, 'Input Parameters');

    // Financial Metrics Sheet
    const metricsData = [
      ['Metric', 'Value'],
      ['Net Present Value (NPV)', metrics.npv],
      ['Internal Rate of Return (IRR)', `${(metrics.irr * 100).toFixed(2)}%`],
      ['Payback Period (years)', metrics.paybackPeriod],
      ['Return on Investment (ROI)', `${metrics.roi.toFixed(2)}%`],
      ['EBITDA Margin', `${metrics.ebitdaMargin.toFixed(2)}%`],
      [],
      ['Cash Flow Analysis'],
      ['Year', 'Free Cash Flow', 'Cumulative Cash Flow', 'Present Value'],
      ...metrics.freeCashFlows.map((flow, index) => [
        index,
        flow,
        metrics.cumulativeCashFlows[index],
        metrics.presentValues[index]
      ])
    ];
    
    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Financial Metrics');

    // Scenario Analysis Sheet
    const scenarioData = [
      ['Scenario', 'NPV', 'IRR (%)', 'Payback Period', 'ROI (%)'],
      ['Best Case', scenarios.bestCase.npv, (scenarios.bestCase.irr * 100).toFixed(2), scenarios.bestCase.paybackPeriod, scenarios.bestCase.roi.toFixed(2)],
      ['Base Case', scenarios.baseCase.npv, (scenarios.baseCase.irr * 100).toFixed(2), scenarios.baseCase.paybackPeriod, scenarios.baseCase.roi.toFixed(2)],
      ['Worst Case', scenarios.worstCase.npv, (scenarios.worstCase.irr * 100).toFixed(2), scenarios.worstCase.paybackPeriod, scenarios.worstCase.roi.toFixed(2)]
    ];
    
    const scenarioSheet = XLSX.utils.aoa_to_sheet(scenarioData);
    XLSX.utils.book_append_sheet(workbook, scenarioSheet, 'Scenario Analysis');

    // Monte Carlo Results Sheet
    const monteCarloData = [
      ['Monte Carlo Simulation Results'],
      ['Expected NPV', monteCarloResults.expectedNPV],
      ['Probability of Positive NPV', `${(monteCarloResults.probabilityOfPositiveNPV * 100).toFixed(2)}%`],
      [],
      ['NPV Percentiles'],
      ['P10', monteCarloResults.npvPercentiles.p10],
      ['P25', monteCarloResults.npvPercentiles.p25],
      ['P50 (Median)', monteCarloResults.npvPercentiles.p50],
      ['P75', monteCarloResults.npvPercentiles.p75],
      ['P90', monteCarloResults.npvPercentiles.p90],
      [],
      ['NPV Distribution Sample'],
      ...monteCarloResults.npvDistribution.slice(0, 100).map((npv, index) => [`Iteration ${index + 1}`, npv])
    ];
    
    const monteCarloSheet = XLSX.utils.aoa_to_sheet(monteCarloData);
    XLSX.utils.book_append_sheet(workbook, monteCarloSheet, 'Monte Carlo Results');

    // Income Statement Sheet
    const incomeStatementData = [
      ['Year', 'Revenue', 'COGS', 'Gross Profit', 'Operating Expenses', 'EBITDA', 'Depreciation', 'EBIT', 'Interest', 'EBT', 'Tax', 'Net Income', 'EBITDA Margin (%)', 'Net Margin (%)'],
      ...reports.incomeStatements.map(stmt => [
        stmt.year,
        stmt.revenue,
        stmt.costOfGoodsSold,
        stmt.grossProfit,
        stmt.operatingExpenses,
        stmt.ebitda,
        stmt.depreciation,
        stmt.ebit,
        stmt.interestExpense,
        stmt.ebt,
        stmt.taxExpense,
        stmt.netIncome,
        stmt.ebitdaMargin.toFixed(1),
        stmt.netProfitMargin.toFixed(1)
      ])
    ];
    
    const incomeStatementSheet = XLSX.utils.aoa_to_sheet(incomeStatementData);
    XLSX.utils.book_append_sheet(workbook, incomeStatementSheet, 'Income Statement');

    // Balance Sheet Sheet
    const balanceSheetData = [
      ['Year', 'Cash & Equivalents', 'Accounts Receivable', 'Inventory', 'Prepaid Expenses', 'Total Current Assets', 'PP&E', 'Acc. Depreciation', 'Net PPE', 'Total Assets', 'Accounts Payable', 'Accrued Expenses', 'Total Current Liabilities', 'Long-term Debt', 'Total Liabilities', 'Common Stock', 'Retained Earnings', 'Total Equity', 'Current Ratio', 'Debt/Equity', 'ROE (%)'],
      ...reports.balanceSheets.map(bs => [
        bs.year,
        bs.cashAndEquivalents,
        bs.accountsReceivable,
        bs.inventory,
        bs.prepaidExpenses,
        bs.totalCurrentAssets,
        bs.propertyPlantEquipment,
        bs.accumulatedDepreciation,
        bs.netPPE,
        bs.totalAssets,
        bs.accountsPayable,
        bs.accruedExpenses,
        bs.totalCurrentLiabilities,
        bs.longTermDebt,
        bs.totalLiabilities,
        bs.commonStock,
        bs.retainedEarnings,
        bs.totalEquity,
        bs.currentRatio.toFixed(2),
        bs.debtToEquityRatio.toFixed(2),
        bs.returnOnEquity.toFixed(1)
      ])
    ];
    
    const balanceSheetSheet = XLSX.utils.aoa_to_sheet(balanceSheetData);
    XLSX.utils.book_append_sheet(workbook, balanceSheetSheet, 'Balance Sheet');

    // Cash Flow Statement Sheet
    const cashFlowData = [
      ['Year', 'Net Income', 'Depreciation', 'WC Changes', 'Operating CF', 'CapEx', 'Investing CF', 'Debt Issuance', 'Debt Repayment', 'Dividends', 'Financing CF', 'Net Cash Flow', 'Beginning Cash', 'Ending Cash'],
      ...reports.cashFlowStatements.map(cf => [
        cf.year,
        cf.netIncome,
        cf.depreciation,
        cf.changesInWorkingCapital,
        cf.netOperatingCashFlow,
        cf.capitalExpenditures,
        cf.netInvestingCashFlow,
        cf.debtIssuance,
        cf.debtRepayment,
        cf.dividends,
        cf.netFinancingCashFlow,
        cf.netCashFlow,
        cf.beginningCashBalance,
        cf.endingCashBalance
      ])
    ];
    
    const cashFlowSheet = XLSX.utils.aoa_to_sheet(cashFlowData);
    XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Cash Flow Statement');

    // Export the workbook
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Financial_Model_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}