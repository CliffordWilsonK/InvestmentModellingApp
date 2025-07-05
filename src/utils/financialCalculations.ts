import { ProjectParameters, FinancialMetrics, ScenarioAnalysis, MonteCarloResult, IncomeStatement, BalanceSheet, CashFlowStatement, FinancialReports } from '../types/financial';

export class FinancialCalculator {
  static calculateNPV(cashFlows: number[], discountRate: number): number {
    return cashFlows.reduce((npv, cashFlow, index) => {
      return npv + cashFlow / Math.pow(1 + discountRate, index);
    }, 0);
  }

  static calculateIRR(cashFlows: number[], guess: number = 0.1): number {
    const maxIterations = 100;
    const tolerance = 1e-7;
    let rate = guess;

    for (let i = 0; i < maxIterations; i++) {
      const npv = this.calculateNPV(cashFlows, rate);
      const derivative = cashFlows.reduce((sum, cashFlow, index) => {
        return sum - (index * cashFlow) / Math.pow(1 + rate, index + 1);
      }, 0);

      if (Math.abs(derivative) < tolerance) break;
      
      const newRate = rate - npv / derivative;
      if (Math.abs(newRate - rate) < tolerance) break;
      
      rate = newRate;
    }

    return rate;
  }

  static calculatePaybackPeriod(cashFlows: number[]): number {
    let cumulativeCashFlow = 0;
    
    for (let i = 0; i < cashFlows.length; i++) {
      cumulativeCashFlow += cashFlows[i];
      if (cumulativeCashFlow >= 0) {
        if (i === 0) return 0;
        const previousCumulative = cumulativeCashFlow - cashFlows[i];
        return i - 1 + Math.abs(previousCumulative) / cashFlows[i];
      }
    }
    
    return cashFlows.length;
  }

  static calculateROI(totalGains: number, initialInvestment: number): number {
    if (initialInvestment === 0) return 0;
    return (totalGains / initialInvestment) * 100;
  }

  static calculateEBITDAMargin(ebitda: number, revenue: number): number {
    if (revenue === 0) return 0;
    return (ebitda / revenue) * 100;
  }

  static calculateFreeCashFlows(params: ProjectParameters): number[] {
    const { initialInvestment, projectTimeline, annualRevenues, operatingCosts, taxRate, depreciationRate, workingCapital } = params;
    const cashFlows: number[] = [];
    
    // Initial investment (negative cash flow)
    cashFlows[0] = -initialInvestment - workingCapital;
    
    for (let year = 1; year <= projectTimeline; year++) {
      const revenue = annualRevenues[year - 1] || 0;
      const operatingCost = operatingCosts[year - 1] || 0;
      const depreciation = initialInvestment * depreciationRate;
      const ebit = revenue - operatingCost - depreciation;
      const tax = ebit > 0 ? ebit * taxRate : 0;
      const nopat = ebit - tax;
      const freeCashFlow = nopat + depreciation;
      
      cashFlows[year] = freeCashFlow;
    }
    
    // Add terminal value and working capital recovery in final year
    if (cashFlows.length > 0) {
      cashFlows[cashFlows.length - 1] += params.terminalValue + workingCapital;
    }
    
    return cashFlows;
  }

  static calculateMetrics(params: ProjectParameters): FinancialMetrics {
    const freeCashFlows = this.calculateFreeCashFlows(params);
    const npv = this.calculateNPV(freeCashFlows, params.discountRate);
    const irr = this.calculateIRR(freeCashFlows);
    const paybackPeriod = this.calculatePaybackPeriod(freeCashFlows);
    
    const totalRevenue = params.annualRevenues.reduce((sum, rev) => sum + rev, 0);
    const totalCosts = params.operatingCosts.reduce((sum, cost) => sum + cost, 0);
    const totalGains = totalRevenue - totalCosts - params.initialInvestment;
    const roi = this.calculateROI(totalGains, params.initialInvestment);
    
    const avgRevenue = totalRevenue / params.projectTimeline;
    const avgEbitda = (totalRevenue - totalCosts) / params.projectTimeline;
    const ebitdaMargin = this.calculateEBITDAMargin(avgEbitda, avgRevenue);
    
    const cumulativeCashFlows = freeCashFlows.reduce((acc, flow, index) => {
      acc[index] = (acc[index - 1] || 0) + flow;
      return acc;
    }, [] as number[]);
    
    const presentValues = freeCashFlows.map((flow, index) => 
      flow / Math.pow(1 + params.discountRate, index)
    );
    
    return {
      npv,
      irr,
      paybackPeriod,
      roi,
      ebitdaMargin,
      freeCashFlows,
      cumulativeCashFlows,
      presentValues
    };
  }

  static calculateScenarioAnalysis(baseParams: ProjectParameters): ScenarioAnalysis {
    // Best case: 20% higher revenues, 10% lower costs
    const bestCaseParams = {
      ...baseParams,
      annualRevenues: baseParams.annualRevenues.map(rev => rev * 1.2),
      operatingCosts: baseParams.operatingCosts.map(cost => cost * 0.9)
    };
    
    // Worst case: 20% lower revenues, 15% higher costs
    const worstCaseParams = {
      ...baseParams,
      annualRevenues: baseParams.annualRevenues.map(rev => rev * 0.8),
      operatingCosts: baseParams.operatingCosts.map(cost => cost * 1.15)
    };
    
    return {
      bestCase: this.calculateMetrics(bestCaseParams),
      baseCase: this.calculateMetrics(baseParams),
      worstCase: this.calculateMetrics(worstCaseParams)
    };
  }

  static runMonteCarloSimulation(params: ProjectParameters, iterations: number = 1000): MonteCarloResult {
    const npvResults: number[] = [];
    const irrResults: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      // Add random variations to key parameters
      const revenueVariation = 0.8 + Math.random() * 0.4; // ±20% variation
      const costVariation = 0.85 + Math.random() * 0.3; // ±15% variation
      const discountVariation = params.discountRate * (0.9 + Math.random() * 0.2); // ±10% variation
      
      const simulationParams = {
        ...params,
        annualRevenues: params.annualRevenues.map(rev => rev * revenueVariation),
        operatingCosts: params.operatingCosts.map(cost => cost * costVariation),
        discountRate: discountVariation
      };
      
      const metrics = this.calculateMetrics(simulationParams);
      npvResults.push(metrics.npv);
      irrResults.push(metrics.irr);
    }
    
    const sortedNPV = npvResults.sort((a, b) => a - b);
    const probabilityOfPositiveNPV = npvResults.filter(npv => npv > 0).length / iterations;
    const expectedNPV = npvResults.reduce((sum, npv) => sum + npv, 0) / iterations;
    
    return {
      npvDistribution: npvResults,
      irrDistribution: irrResults,
      probabilityOfPositiveNPV,
      expectedNPV,
      npvPercentiles: {
        p10: sortedNPV[Math.floor(iterations * 0.1)],
        p25: sortedNPV[Math.floor(iterations * 0.25)],
        p50: sortedNPV[Math.floor(iterations * 0.5)],
        p75: sortedNPV[Math.floor(iterations * 0.75)],
        p90: sortedNPV[Math.floor(iterations * 0.9)]
      }
    };
  }

  // New methods for financial reports
  static generateIncomeStatements(params: ProjectParameters): IncomeStatement[] {
    const statements: IncomeStatement[] = [];
    
    for (let year = 1; year <= params.projectTimeline; year++) {
      const revenue = params.annualRevenues[year - 1] || 0;
      const operatingCost = params.operatingCosts[year - 1] || 0;
      const depreciation = params.initialInvestment * params.depreciationRate;
      
      // Assume 60% of operating costs are COGS, 40% are operating expenses
      const costOfGoodsSold = operatingCost * 0.6;
      const operatingExpenses = operatingCost * 0.4;
      
      const grossProfit = revenue - costOfGoodsSold;
      const ebitda = revenue - operatingCost;
      const ebit = ebitda - depreciation;
      
      // Assume some interest expense (10% of initial investment)
      const interestExpense = params.initialInvestment * 0.1;
      const ebt = ebit - interestExpense;
      const taxExpense = ebt > 0 ? ebt * params.taxRate : 0;
      const netIncome = ebt - taxExpense;
      
      statements.push({
        year,
        revenue,
        costOfGoodsSold,
        grossProfit,
        operatingExpenses,
        ebitda,
        depreciation,
        ebit,
        interestExpense,
        ebt,
        taxExpense,
        netIncome,
        ebitdaMargin: revenue > 0 ? (ebitda / revenue) * 100 : 0,
        netProfitMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0
      });
    }
    
    return statements;
  }

  static generateBalanceSheets(params: ProjectParameters): BalanceSheet[] {
    const balanceSheets: BalanceSheet[] = [];
    let retainedEarnings = 0;
    let accumulatedDepreciation = 0;
    let cashBalance = params.workingCapital;
    
    for (let year = 1; year <= params.projectTimeline; year++) {
      const revenue = params.annualRevenues[year - 1] || 0;
      const operatingCost = params.operatingCosts[year - 1] || 0;
      const depreciation = params.initialInvestment * params.depreciationRate;
      const netIncome = revenue - operatingCost - depreciation;
      
      // Update retained earnings
      retainedEarnings += netIncome;
      accumulatedDepreciation += depreciation;
      
      // Update cash balance
      cashBalance += netIncome + depreciation;
      
      // Calculate working capital components
      const accountsReceivable = revenue * 0.15; // 15% of revenue
      const inventory = operatingCost * 0.2; // 20% of operating costs
      const prepaidExpenses = operatingCost * 0.05; // 5% of operating costs
      const accountsPayable = operatingCost * 0.25; // 25% of operating costs
      const accruedExpenses = operatingCost * 0.1; // 10% of operating costs
      
      const totalCurrentAssets = cashBalance + accountsReceivable + inventory + prepaidExpenses;
      const netPPE = params.initialInvestment - accumulatedDepreciation;
      const totalAssets = totalCurrentAssets + netPPE;
      
      const totalCurrentLiabilities = accountsPayable + accruedExpenses;
      const longTermDebt = params.initialInvestment * 0.6; // 60% debt financing
      const totalLiabilities = totalCurrentLiabilities + longTermDebt;
      
      const commonStock = params.initialInvestment * 0.4; // 40% equity financing
      const totalEquity = commonStock + retainedEarnings;
      
      balanceSheets.push({
        year,
        cashAndEquivalents: cashBalance,
        accountsReceivable,
        inventory,
        prepaidExpenses,
        totalCurrentAssets,
        propertyPlantEquipment: params.initialInvestment,
        accumulatedDepreciation,
        netPPE,
        totalAssets,
        accountsPayable,
        accruedExpenses,
        shortTermDebt: 0,
        totalCurrentLiabilities,
        longTermDebt,
        totalLiabilities,
        commonStock,
        retainedEarnings,
        totalEquity,
        currentRatio: totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0,
        debtToEquityRatio: totalEquity > 0 ? totalLiabilities / totalEquity : 0,
        returnOnEquity: totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0
      });
    }
    
    return balanceSheets;
  }

  static generateCashFlowStatements(params: ProjectParameters): CashFlowStatement[] {
    const cashFlowStatements: CashFlowStatement[] = [];
    let beginningCashBalance = params.workingCapital;
    
    for (let year = 1; year <= params.projectTimeline; year++) {
      const revenue = params.annualRevenues[year - 1] || 0;
      const operatingCost = params.operatingCosts[year - 1] || 0;
      const depreciation = params.initialInvestment * params.depreciationRate;
      const netIncome = revenue - operatingCost - depreciation;
      
      // Calculate working capital changes
      const accountsReceivable = revenue * 0.15;
      const inventory = operatingCost * 0.2;
      const accountsPayable = operatingCost * 0.25;
      const changesInWorkingCapital = accountsReceivable + inventory - accountsPayable;
      
      const netOperatingCashFlow = netIncome + depreciation - changesInWorkingCapital;
      
      // Investing activities (capital expenditures in year 1, maintenance capex in other years)
      const capitalExpenditures = year === 1 ? params.initialInvestment : params.initialInvestment * 0.05;
      const netInvestingCashFlow = -capitalExpenditures;
      
      // Financing activities
      const debtIssuance = year === 1 ? params.initialInvestment * 0.6 : 0;
      const debtRepayment = year > 1 ? debtIssuance / (params.projectTimeline - 1) : 0;
      const dividends = netIncome > 0 ? netIncome * 0.3 : 0; // 30% payout ratio
      const netFinancingCashFlow = debtIssuance - debtRepayment - dividends;
      
      const netCashFlow = netOperatingCashFlow + netInvestingCashFlow + netFinancingCashFlow;
      const endingCashBalance = beginningCashBalance + netCashFlow;
      
      cashFlowStatements.push({
        year,
        netIncome,
        depreciation,
        changesInWorkingCapital,
        netOperatingCashFlow,
        capitalExpenditures,
        netInvestingCashFlow,
        debtIssuance,
        debtRepayment,
        dividends,
        netFinancingCashFlow,
        netCashFlow,
        beginningCashBalance,
        endingCashBalance
      });
      
      beginningCashBalance = endingCashBalance;
    }
    
    return cashFlowStatements;
  }

  static generateFinancialReports(params: ProjectParameters): FinancialReports {
    const incomeStatements = this.generateIncomeStatements(params);
    const balanceSheets = this.generateBalanceSheets(params);
    const cashFlowStatements = this.generateCashFlowStatements(params);
    
    const totalRevenue = incomeStatements.reduce((sum, stmt) => sum + stmt.revenue, 0);
    const totalNetIncome = incomeStatements.reduce((sum, stmt) => sum + stmt.netIncome, 0);
    const totalAssets = balanceSheets[balanceSheets.length - 1]?.totalAssets || 0;
    const totalLiabilities = balanceSheets[balanceSheets.length - 1]?.totalLiabilities || 0;
    const totalEquity = balanceSheets[balanceSheets.length - 1]?.totalEquity || 0;
    const cumulativeCashFlow = cashFlowStatements.reduce((sum, stmt) => sum + stmt.netCashFlow, 0);
    
    return {
      incomeStatements,
      balanceSheets,
      cashFlowStatements,
      summary: {
        totalRevenue,
        totalNetIncome,
        totalAssets,
        totalLiabilities,
        totalEquity,
        cumulativeCashFlow
      }
    };
  }
}