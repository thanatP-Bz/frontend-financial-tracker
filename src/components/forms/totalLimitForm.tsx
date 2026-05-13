import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createBudget, updateBudget } from "../../api/budgetApi";
import type { Budget } from "../../types";

interface TotalLimitFormProps {
  budget: Budget | null;
  month: number;
  year: number;
  onClose: () => void;
}

const TotalLimitForm = ({
  budget,
  month,
  year,
  onClose,
}: TotalLimitFormProps) => {
  const queryClient = useQueryClient();

  const [totalLimit, setTotalLimit] = useState<string>(
    budget?.totalLimit != null ? String(budget.totalLimit) : "",
  );

  const createMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Monthly limit set!");
      onClose();
    },
    onError: () => toast.error("Failed to set monthly limit"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Monthly limit updated!");
      onClose();
    },
    onError: () => toast.error("Failed to update monthly limit"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!totalLimit || Number(totalLimit) <= 0) {
      toast.error("Please enter a valid limit");
      return;
    }

    if (!budget) {
      createMutation.mutate({
        month,
        year,
        totalLimit: Number(totalLimit),
        categories: [],
      });
    } else {
      updateMutation.mutate({
        id: budget._id,
        data: { totalLimit: Number(totalLimit) },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {budget?.totalLimit ? "Edit monthly limit" : "Set monthly limit"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Month display */}
        <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            Setting limit for{" "}
            <span className="font-medium text-gray-700">{monthName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Total limit input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Total monthly limit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={totalLimit}
                onChange={(e) => setTotalLimit(e.target.value)}
                placeholder="e.g. 2000"
                min="0.01"
                step="0.01"
                autoFocus
                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0892a5] focus:border-transparent outline-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Overall spending cap for {monthName}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-[#0892a5] hover:bg-[#0a7a8c] disabled:bg-[#0892a5]/50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            {isPending
              ? "Saving..."
              : budget?.totalLimit
                ? "Update limit"
                : "Set limit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TotalLimitForm;
