import { useState } from "react";
import { createTransaction } from "../../api/transactionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TransactionCategory } from "../../types/index";

interface TransactionForm {
  type: "income" | "expense";
  amount: string;
  description: string;
  category: TransactionCategory | "";
  date: string;
}

interface AddTransactionFormProps {
  onSuccess?: () => void;
}

const AddTransactionForm = ({ onSuccess }: AddTransactionFormProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TransactionForm>({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`transactions`] });
      toast.success("Transaction Added!");
      onSuccess?.();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to add transaction";
      toast.error(message);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? value.replace(/^0+(?=\d)/, "") : value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    console.log("form data", formData);

    const submitData = {
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category as TransactionCategory,
      description: formData.description,
      date: new Date().toISOString(),
    };

    createMutation.mutate(submitData);

    setFormData({
      type: "expense",
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add Transaction</h1>

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
            type="number"
            name="amount"
            placeholder="0.00"
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
          type="text"
          name="description"
          placeholder="What's this for?"
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
          <option value="">Select category</option>
          <option value="Food">🍔 Food</option>
          <option value="Transport">🚗 Transport</option>
          <option value="Housing">🏠 Housing</option>
          <option value="Entertainment">🎬 Entertainment</option>
          <option value="Salary">💰 Salary</option>
          <option value="Other">📦 Other</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full py-2 px-4 bg-[#0892a5] hover:bg-[##0892a5]/20 disabled:bg-[#0892a5]/50 text-sm text-white font-medium rounded-lg transition-colors cursor-pointer"
      >
        {createMutation.isPending ? "Adding..." : "+ Add Transaction"}
      </button>
    </form>
  );
};

export default AddTransactionForm;
