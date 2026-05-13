import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createBudget, updateBudget } from "../../api/budgetApi";
import type { Budget, TransactionCategory } from "../../types";

interface BudgetFormProps {
  budget: Budget | null;
  editCategory: string | null;
  month: number;
  year: number;
  onClose: () => void;
}

const BudgetForm = ({
  budget,
  editCategory,
  month,
  year,
  onClose,
}: BudgetFormProps) => {
  const queryClient = useQueryClient();

  const existingLimit = budget?.categories.find(
    (c) => c.category === editCategory,
  )?.limit;

  const [category, setCategory] = useState<TransactionCategory | "">(
    (editCategory as TransactionCategory) ?? "",
  );
  const [limit, setLimit] = useState<string>(
    existingLimit != null ? String(existingLimit) : "",
  );

  const createMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });

      toast.success("Budget created!");
      onClose();
    },
    onError: () => toast.error("Failed to create budget"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Budget updated!");
      onClose();
    },
    onError: () => toast.error("Failed to update budget"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!limit || Number(limit) <= 0) {
      toast.error("Please enter a valid limit");
      return;
    }

    // duplicate check — only in add mode
    if (!editCategory && budget) {
      const alreadyExists = budget.categories.some(
        (c) => c.category === category,
      );
      if (alreadyExists) {
        toast.error(`${category} budget already exists`);
        return;
      }
    }

    // POST vs PATCH decision
    if (!budget) {
      createMutation.mutate({
        month,
        year,
        categories: [{ category, limit: Number(limit) }],
      });
    } else {
      const updatedCategories = editCategory
        ? budget.categories.map((c) =>
            c.category === editCategory
              ? { ...c, category, limit: Number(limit) }
              : c,
          )
        : [...budget.categories, { category, limit: Number(limit) }];

      updateMutation.mutate({
        id: budget._id,
        data: {
          categories: updatedCategories,
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const existingCategories = budget?.categories.map((c) => c.category) ?? [];

  const categoryOptions: TransactionCategory[] = [
    "Food",
    "Transport",
    "Housing",
    "Entertainment",
    "Other",
  ];

  const availableCategories = editCategory
    ? categoryOptions
    : categoryOptions.filter((c) => !existingCategories.includes(c));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {editCategory ? `Edit ${editCategory}` : "Add Category Budget"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Month + year display — read only */}
        <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            Setting budget for{" "}
            <span className="font-medium text-gray-700">
              {new Date(year, month - 1).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category select */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as TransactionCategory)
              }
              disabled={!!editCategory}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0892a5] focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Select category</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {!!editCategory && (
              <p className="text-xs text-gray-400 mt-1">
                Category cannot be changed — edit the limit only
              </p>
            )}
          </div>

          {/* Limit input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Monthly limit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0892a5] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-[#0892a5] hover:bg-[#0a7a8c] disabled:bg-[#0892a5]/50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            {isPending
              ? "Saving..."
              : editCategory
                ? "Update budget"
                : "Add budget"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
