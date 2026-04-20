import { useMemo } from "react";
import type { Transaction } from "../types/index";

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export const useMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  return useMemo(() => {
    // Group transactions by month
    const monthlyData = transactions.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
        }

        if (transaction.type === "income") {
          acc[monthKey].income += transaction.amount;
        } else {
          acc[monthKey].expenses += transaction.amount;
        }

        return acc;
      },
      {} as Record<string, MonthlyData>,
    );

    // Convert to array and sort by month
    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month),
    );
  }, [transactions]);
};
