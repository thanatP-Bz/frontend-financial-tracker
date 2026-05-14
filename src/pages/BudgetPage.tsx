import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTransactions } from "../api/transactionApi";
import { getBudget, deleteBudget, updateBudget } from "../api/budgetApi";
import { useBudgetProgress } from "../hooks/useBudgetProgress";
import BudgetCard from "../components/budget/BudgetCard";
import BudgetForm from "../components/forms/BudgetForm";
import TotalLimitForm from "../components/forms/totalLimitForm";

const BudgetPage = () => {
  const queryClient = useQueryClient();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<string | null>(null);

  const startDate = new Date(selectedYear, selectedMonth - 1, 1)
    .toISOString()
    .split("T")[0];

  const endDate = new Date(selectedYear, selectedMonth, 0)
    .toISOString()
    .split("T")[0];

  /* fetch budget data*/
  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ["budget", selectedMonth, selectedYear],
    queryFn: () => getBudget(selectedMonth, selectedYear),
    retry: false,
  });

  /* fetch transactions data */
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", selectedMonth, selectedYear],
    queryFn: () => getTransactions({ startDate, endDate }),
  });

  const budgetProgress = useBudgetProgress(budget, transactions);
  const isLoading = budgetLoading || transactionsLoading;

  console.log("budget:", budget);
  console.log("transactions:", transactions);
  console.log("budgetProgress:", budgetProgress);

  const deleteMutation = useMutation({
    mutationFn: async (category: string) => {
      const updatedCategories = budget!.categories.filter(
        (c) => c.category !== category,
      );
      if (updatedCategories.length === 0) {
        return deleteBudget(budget!._id);
      }
      return updateBudget(budget!._id, { categories: updatedCategories });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Category removed");
    },
    onError: () => toast.error("Failed to remove category"),
  });

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleOpenAdd = () => {
    setEditCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: string) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditCategory(null);
  };

  const monthName = new Date(
    selectedYear,
    selectedMonth - 1,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budgets</h1>
        <div className="flex items-center gap-3">
          {/* Month navigator */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <button
              onClick={handlePrevMonth}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-25 text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Two separate buttons */}
          <button
            onClick={() => setIsLimitModalOpen(true)}
            className="py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors cursor-pointer"
          >
            ✎ Set monthly limit
          </button>
          <button
            onClick={handleOpenAdd}
            className="py-2 px-4 bg-[#0892a5] hover:bg-[#0a7a8c] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            + Add category
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!budget && (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 font-medium mb-1">
            No budget set for {monthName}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Start by setting a monthly limit or adding a category budget
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsLimitModalOpen(true)}
              className="py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors cursor-pointer"
            >
              ✎ Set monthly limit
            </button>
            <button
              onClick={handleOpenAdd}
              className="py-2 px-4 bg-[#0892a5] hover:bg-[#0a7a8c] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              + Add category
            </button>
          </div>
        </div>
      )}

      {/* Budget exists */}
      {budget && (
        <div>
          {/* Total limit banner */}
          {budget.totalLimit &&
            (() => {
              const totalSpent = budgetProgress.reduce(
                (sum, p) => sum + p.spent,
                0,
              );
              const remaining = budget.totalLimit! - totalSpent;
              const percentRaw = (totalSpent / budget.totalLimit!) * 100;
              const percentClamped = Math.min(percentRaw, 100);

              return (
                <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm mb-6">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Total budget limit
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        ${budget.totalLimit!.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        month of {monthName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Total spent so far
                      </p>
                      <p
                        className={`text-2xl font-semibold ${
                          percentRaw >= 100
                            ? "text-[#A32D2D]"
                            : percentRaw >= 80
                              ? "text-[#BA7517]"
                              : "text-gray-800"
                        }`}
                      >
                        ${totalSpent.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {remaining >= 0
                          ? `$${remaining.toFixed(2)} remaining`
                          : `over by $${Math.abs(remaining).toFixed(2)}`}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500">
                          Overall progress
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            percentRaw >= 100
                              ? "text-[#A32D2D]"
                              : percentRaw >= 80
                                ? "text-[#BA7517]"
                                : "text-[#0892a5]"
                          }`}
                        >
                          {percentRaw.toFixed(0)}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            percentRaw >= 100
                              ? "bg-[#E24B4A]"
                              : percentRaw >= 80
                                ? "bg-[#EF9F27]"
                                : "bg-[#0892a5]"
                          }`}
                          style={{ width: `${percentClamped}%` }}
                        />
                      </div>
                      <button
                        onClick={() => setIsLimitModalOpen(true)}
                        className="text-xs text-[#0892a5] mt-1 cursor-pointer hover:underline"
                      >
                        ✎ edit monthly limit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Category cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetProgress.map((progress) => (
              <BudgetCard
                key={progress.categoryId}
                progress={progress}
                onEdit={handleOpenEdit}
                onDelete={(category) => deleteMutation.mutate(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* BudgetForm modal */}
      {isModalOpen && (
        <BudgetForm
          budget={budget ?? null}
          editCategory={editCategory}
          month={selectedMonth}
          year={selectedYear}
          onClose={handleClose}
        />
      )}

      {/* TotalLimitForm modal */}
      {isLimitModalOpen && (
        <TotalLimitForm
          budget={budget ?? null}
          month={selectedMonth}
          year={selectedYear}
          onClose={() => setIsLimitModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BudgetPage;
