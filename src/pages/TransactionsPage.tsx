import { toast } from "sonner";
import { deleteTransaction, getTransactions } from "../api/transactionApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { SquarePen } from "lucide-react";
import { X } from "lucide-react";
import type { Transaction } from "../types";
import EditTransactionForm from "../components/forms/EditTransactionForm";
import AddTransactionButton from "../components/AddTransactionButton";

const TransactionsPage = () => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expenses", value: "expense" },
  ] as const;

  const queryClient = useQueryClient();

  //fetch data
  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  console.log(transaction);

  /* filter */
  const filteredTransactions = transaction?.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  /* delete function */
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`transactions`] });
      toast.success("Transaction deleted");
    },
    onError: () => toast.error("Failed to delete transaction"),
  });

  /* delete handle */
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  //show toast message
  useEffect(() => {
    if (error) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message || "Failed to load transactions";
      toast.error(message);
    }
  }, [error]);

  return (
    <div>
      {isLoading && <p>is loading...</p>}

      {!isLoading && (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <AddTransactionButton />
          </div>
          <div className="bg-white p-2 rounded-lg">
            {/* filter transactions */}
            <div className="flex m-2 p-2 gap-x-2 border-b border-gray-200">
              {filterOptions.map((option) => {
                console.log(option);
                return (
                  <div key={option.value}>
                    <button
                      onClick={() => setFilter(option.value)}
                      className={`px-3 py-2 text-sm font-medium  rounded-lg cursor-pointer ${
                        option.value === "all"
                          ? "bg-[#e6748e] text-white"
                          : option.value === "income"
                            ? "bg-[#92ada4] text-white"
                            : "bg-[#f1a805]/40 text-[#84572f]"
                      }`}
                    >
                      {option.label}
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredTransactions?.length === 0 ? (
              <div className="bg-white rounded-lg p-8 shadow text-center m-4">
                <p className="text-gray-500">
                  {filter === "all" && "No transactions yet"}
                  {filter === "income" && "No income transactions yet"}
                  {filter === "expense" && "No expense transactions yet"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Add your first {filter === "all" ? "transaction" : filter} to
                  get started
                </p>
              </div>
            ) : (
              /* transaction lists */
              <ul className="space-y-2 m-4">
                {filteredTransactions?.map((transaction) => (
                  <li key={transaction._id}>
                    <div
                      className={`flex items-center justify-between rounded-lg p-3 text-base ${
                        transaction.type === "income"
                          ? "bg-[#92ada4]/50"
                          : "bg-[#edd5c0]"
                      }`}
                    >
                      {/* Left side - icon and details */}
                      <div className="flex items-center gap-3">
                        {/* Category icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-white`}
                        >
                          {transaction.category === "Food" && "🍔"}
                          {transaction.category === "Transport" && "🚗"}
                          {transaction.category === "Housing" && "🏠"}
                          {transaction.category === "Entertainment" && "🎬"}
                          {transaction.category === "Salary" && "💰"}
                          {transaction.category === "Other" && "📦"}
                        </div>

                        {/* Details */}
                        <div>
                          <p className="font-medium text-small text-gray-800">
                            {transaction.description || transaction.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.category}
                          </p>
                        </div>
                      </div>

                      {/* Right side - amount and actions */}
                      <div className="flex items-center gap-3">
                        <p
                          className={`font-bold text-base ${
                            transaction.type === "income"
                              ? "text-[#84572f]"
                              : "text-white"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-1">
                          <button
                            aria-label="Edit transaction"
                            className="p-2 text-gray-400 hover:text-[#004D3A] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <SquarePen />
                          </button>
                          <button
                            aria-label="Delete transaction"
                            className="p-2 text-gray-400 hover:text-[#d64a17] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleDelete(transaction._id)}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* edit form */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => setEditingTransaction(null)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <EditTransactionForm
              transaction={editingTransaction}
              onSuccess={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
