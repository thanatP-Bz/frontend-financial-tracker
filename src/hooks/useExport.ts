import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction, Budget } from "../types";

interface DateFilters {
  startDate: string;
  endDate: string;
}

export const useExport = () => {
  const exportPDF = (
    transactions: Transaction[],
    budget: Budget | null,
    dateFilters: DateFilters,
  ) => {
    const doc = new jsPDF();

    const formattedStart = new Date(dateFilters.startDate).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" },
    );
    const formattedEnd = new Date(dateFilters.endDate).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" },
    );

    const dateRangeLabel = `${formattedStart} – ${formattedEnd}`;

    // ── PAGE 1: TRANSACTIONS ──────────────────────────
    doc.setFontSize(16);
    doc.text("Financial Report", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(dateRangeLabel, 14, 28);

    // filter transactions by date range
    const filtered = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date >= new Date(dateFilters.startDate) &&
        date <= new Date(dateFilters.endDate)
      );
    });

    const transactionRows = filtered.map((t) => [
      new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      t.description || t.category,
      t.category,
      t.type === "income"
        ? `+$${t.amount.toFixed(2)}`
        : `-$${t.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Date", "Description", "Category", "Amount"]],
      body: transactionRows,
      headStyles: { fillColor: [230, 116, 142] },
    });

    // ── PAGE 2: BUDGET SUMMARY ────────────────────────
    doc.addPage();

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Budget Summary", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(dateRangeLabel, 14, 28);

    if (budget && budget.categories.length > 0) {
      const budgetRows = budget.categories.map((cat) => {
        const spent = filtered
          .filter((t) => t.category === cat.category && t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        const remaining = cat.limit - spent;
        const status =
          spent >= cat.limit
            ? "Over"
            : spent >= cat.limit * 0.8
              ? "Warn"
              : "OK";

        return [
          cat.category,
          `$${cat.limit.toFixed(2)}`,
          `$${spent.toFixed(2)}`,
          `$${remaining.toFixed(2)}`,
          status,
        ];
      });

      autoTable(doc, {
        startY: 35,
        head: [["Category", "Limit", "Spent", "Remaining", "Status"]],
        body: budgetRows,
        headStyles: { fillColor: [230, 116, 142] },
      });
    } else {
      doc.setFontSize(11);
      doc.setTextColor(150);
      doc.text("No budget data available.", 14, 40);
    }

    // ── SAVE ─────────────────────────────────────────
    doc.save(
      `financial-report-${dateFilters.startDate}-${dateFilters.endDate}.pdf`,
    );
  };

  return { exportPDF };
};
