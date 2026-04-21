import { useState } from "react";
import { updateTransaction } from "../../api/transactionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TransactionPayload } from "../../types/index";
import type { Transaction } from "../../types/index";

interface EditTransactionFormProp {
  transaction: Transaction;
  onSuccess?: () => void;
}

const EditTransactionForm = ({
  transaction,
  onSuccess,
}: EditTransactionFormProp) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    type: transaction.type,
    amount: String(transaction.amount),
    description: transaction.description,
    category: transaction.category,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<TransactionPayload>) =>
      updateTransaction(transaction._id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`transactions`] });
      toast.success("Transaction Updated!");
      onSuccess?.();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update transaction";
      toast.error(message);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    updateMutation.mutate({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm p-4">
      <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>

      {/* Type Toggle */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Type
        </label>
        <div className="flex rounded-xl bg-neutral-200 p-1 w-fit">
          <button
            type="button"
            className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
              formData.type === "income"
                ? "bg-[#92ada4] text-white"
                : "text-white"
            }`}
            onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
          >
            Income
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
              formData.type === "expense"
                ? "bg-[#edd5c0] text-[#84572f]"
                : "text-white"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: "expense" }))
            }
          >
            Expense
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            $
          </span>
          <input
            placeholder="amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D3A] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          placeholder="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D3A] focus:border-transparent outline-none"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D3A] focus:border-transparent outline-none bg-white"
        >
          <option value="Food">🍔 Food</option>
          <option value="Transport">🚗 Transport</option>
          <option value="Housing">🏠 Housing</option>
          <option value="Entertainment">🎬 Entertainment</option>
          <option value="Salary">💰 Salary</option>
          <option value="Other">📦 Other</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="w-full py-2 px-4 bg-[#0892a5] hover:bg-[##0892a5]/20 disabled:bg-[#0892a5]/50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
      >
        {updateMutation.isPending ? "Updating..." : "Update Transaction"}
      </button>
    </form>
  );
};

export default EditTransactionForm;
