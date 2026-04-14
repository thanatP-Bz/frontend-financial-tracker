import { useState } from "react";
import { createTransaction } from "../api/transactionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TransactionCategory } from "../types";

interface TransactionForm {
  type: "income" | "expense";
  amount: string;
  description: string;
  category: TransactionCategory | "";
  date: string;
}

const AddTransactionPage = () => {
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
      [name]: name === "amount" ? Number(value) : value,
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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col w-fit">
        <div className="flex rounded-2xl bg-neutral-500 mx-3 p-1 w-fit mt-2">
          <button
            type="button"
            className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
              formData.type === "income"
                ? "bg-[#7FA033] text-white"
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
                ? "bg-[#d64a17] text-white"
                : "text-white"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: "expense" }))
            }
          >
            Expense
          </button>
        </div>

        {/* Amount */}
        <div>
          <input
            type="number"
            name="amount"
            placeholder="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <input
            type="text"
            name="description"
            placeholder="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Housing">Housing</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          className="px-6 py-3 mx-3 text-sm font-medium rounded-2xl transition-colors cursor-pointer bg-[#004D3A] text-white"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Adding..." : "+ Add Transaction"}
        </button>
      </div>
    </form>
  );
};

export default AddTransactionPage;
