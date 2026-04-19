import { useMemo } from "react";
import type { Transaction } from "../types";

export const useCategoryData = (transitions: Transaction[] | undefined) => {
  return useMemo(() => {
    if (!transitions) return [];

    const expenses = transitions.filter((t) => t.type === "expense");

    const categoryTotals = expenses.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const COLORS: Record<string, string> = {
      Food: "#E86C4F",
      Transport: "#F4A24C",
      Housing: "#DBAE8D",
      Entertainment: "#027A76",
      Salary: "#95907F",
      Other: "#F2E5D3",
    };

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || "#95907F",
    }));
  }, [transitions]);
};
