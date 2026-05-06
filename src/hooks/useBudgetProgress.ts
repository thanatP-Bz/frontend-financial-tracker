import { useMemo } from "react";
import type { Budget, Transaction } from "../types";

export interface BudgetProgress {
  categoryId: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percent: number;
  status: "ok" | "warn" | "over";
}

export const useBudgetProgress = (
  budget: Budget | null | undefined,
  transactions: Transaction[] | undefined,
): BudgetProgress[] => {
  return useMemo(() => {
    if (!budget || !transactions) return [];

    return budget.categories.map((cat) => {
      const spent = transactions
        .filter((t) => t.type === "expense" && t.category === cat.category)
        .reduce((sum, t) => sum + t.amount, 0);

      const percent = (spent / cat.limit) * 100;

      const status = percent >= 100 ? "over" : percent >= 80 ? "warn" : "ok";

      return {
        categoryId: cat._id ?? cat.category,
        category: cat.category,
        limit: cat.limit,
        spent,
        remaining: cat.limit - spent,
        percent,
        status,
      };
    });
  }, [budget, transactions]);
};
