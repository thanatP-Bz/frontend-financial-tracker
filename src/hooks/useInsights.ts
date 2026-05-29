import { useMemo } from "react";

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface Insights {
  biggestSpendingMonth: string;
  biggestSpendingAmount: number;
  averageSavingsRate: number;
  monthlySavings: { month: string; saved: number; savingsRate: number }[];
  momTrend: number; // month-over-month expense change in %
}

export const useInsights = (monthlyData: MonthlyData[]): Insights | null => {
  return useMemo(() => {
    if (monthlyData.length === 0) return null;

    // 1. Biggest spending month
    const biggest = monthlyData.reduce((max, m) =>
      m.expenses > max.expenses ? m : max,
    );

    // 2. Average savings rate
    const avgSavingsRate =
      monthlyData.reduce((sum, m) => {
        if (m.income === 0) return sum;
        return sum + ((m.income - m.expenses) / m.income) * 100;
      }, 0) / monthlyData.filter((m) => m.income > 0).length;

    //3. Monthly savings and savings rate
    const monthlySavings = monthlyData.map((m) => ({
      month: m.month,
      saved: m.income - m.expenses,
      savingsRate:
        m.income > 0 ? ((m.income - m.expenses) / m.income) * 100 : 0,
    }));

    // 4. Month-over-month expense trend
    let momTrend = 0;
    if (monthlyData.length >= 2) {
      const last = monthlyData[monthlyData.length - 1];
      const prev = monthlyData[monthlyData.length - 2];
      if (prev.expenses > 0) {
        momTrend = ((last.expenses - prev.expenses) / prev.expenses) * 100;
      }
    }

    return {
      biggestSpendingMonth: biggest.month,
      biggestSpendingAmount: biggest.expenses,
      averageSavingsRate: avgSavingsRate,
      monthlySavings,
      momTrend,
    };
  }, [monthlyData]);
};
