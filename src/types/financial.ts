export interface ProjectParameters {
  initialInvestment: number;
  projectTimeline: number;
  annualRevenues: number[];
  operatingCosts: number[];
  taxRate: number;
  discountRate: number;
  depreciationRate: number;
  workingCapital: number;
  terminalGrowthRate: number;
  terminalValue: number;
}

export interface FinancialMetrics {
  npv: number;
  irr: number;
  paybackPeriod: number;
  roi: number;
  ebitdaMargin: number;
  freeCashFlows: number[];
  cumulativeCashFlows: number[];
  presentValues: number[];
}

export interface ScenarioAnalysis {
  bestCase: FinancialMetrics;
  baseCase: FinancialMetrics;
  worstCase: FinancialMetrics;
}

export interface SensitivityVariable {
  name: string;
  baseValue: number;
  minValue: number;
  maxValue: number;
  impact: number;
}

export interface MonteCarloResult {
  npvDistribution: number[];
  irrDistribution: number[];
  probabilityOfPositiveNPV: number;
  expectedNPV: number;
  npvPercentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string;
    borderWidth: number;
  }[];
}

// New interfaces for financial reports
export interface IncomeStatement {
  year: number;
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interestExpense: number;
  ebt: number;
  taxExpense: number;
  netIncome: number;
  ebitdaMargin: number;
  netProfitMargin: number;
}

export interface BalanceSheet {
  year: number;
  // Assets
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  totalCurrentAssets: number;
  propertyPlantEquipment: number;
  accumulatedDepreciation: number;
  netPPE: number;
  totalAssets: number;
  
  // Liabilities
  accountsPayable: number;
  accruedExpenses: number;
  shortTermDebt: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  
  // Equity
  commonStock: number;
  retainedEarnings: number;
  totalEquity: number;
  
  // Ratios
  currentRatio: number;
  debtToEquityRatio: number;
  returnOnEquity: number;
}

export interface CashFlowStatement {
  year: number;
  // Operating Activities
  netIncome: number;
  depreciation: number;
  changesInWorkingCapital: number;
  netOperatingCashFlow: number;
  
  // Investing Activities
  capitalExpenditures: number;
  netInvestingCashFlow: number;
  
  // Financing Activities
  debtIssuance: number;
  debtRepayment: number;
  dividends: number;
  netFinancingCashFlow: number;
  
  // Summary
  netCashFlow: number;
  beginningCashBalance: number;
  endingCashBalance: number;
}

export interface FinancialReports {
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];
  summary: {
    totalRevenue: number;
    totalNetIncome: number;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    cumulativeCashFlow: number;
  };
}