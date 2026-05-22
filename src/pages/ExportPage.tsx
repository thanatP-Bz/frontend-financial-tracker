import { useState } from "react";
import { FileDown } from "lucide-react";
import { useExport } from "../hooks/useExport";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/transactionApi";
import { getBudget } from "../api/budgetApi";

const getPresentDates = () => {
  const now = new Date();
  return {
    startDate: new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  };
};

const ExportPage = () => {
  const [dateFilters, setDateFilters] = useState(getPresentDates);

  const { exportPDF } = useExport();

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", dateFilters],
    queryFn: () => getTransactions(dateFilters),
  });

  const now = new Date();
  const { data: budget = null } = useQuery({
    queryKey: ["budget", now.getMonth() + 1, now.getFullYear()],
    queryFn: () => getBudget(now.getMonth() + 1, now.getFullYear()),
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Export Report</h1>

      <div className="bg-white rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>

        {/* Date inputs */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              placeholder="date"
              value={dateFilters.startDate}
              onChange={(e) =>
                setDateFilters((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e6748e]/40 focus:border-[#e6748e]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              placeholder="date"
              type="date"
              value={dateFilters.endDate}
              onChange={(e) =>
                setDateFilters((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e6748e]/40 focus:border-[#e6748e]"
            />
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={() => exportPDF(transactions, budget, dateFilters)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#e6748e] text-white rounded-lg font-medium hover:bg-[#d4607a] transition-colors cursor-pointer"
        >
          <FileDown size={18} />
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default ExportPage;
