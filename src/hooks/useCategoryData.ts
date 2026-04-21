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
      Food: "#F0EBD8", // Shells (keep - already light)
      Transport: "#D4A89A", // Sand Castle (lightened from #B87E6D)
      Housing: "#5DBFC0", // Aquascape (lightened from #0CA4A5)
      Entertainment: "#8FB5B7", // Deep Dive (lightened from #6B8D8F)
      Salary: "#7BA8C7", // Ocean Waves (lightened from #4B82A9)
      Other: "#B3D9ED",
    };

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || "#95907F",
    }));
  }, [transitions]);
};
