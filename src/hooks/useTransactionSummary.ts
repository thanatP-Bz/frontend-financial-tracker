import { useMemo } from "react";
import type { Transaction } from "../types";

interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const useTransactionSummary = (
  transactions: Transaction[] | undefined,
): TransactionSummary => {
  return useMemo(() => {
    if (!transactions) {
      return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum: number, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum: number, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  }, [transactions]);
};
