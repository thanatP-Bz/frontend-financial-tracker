import { deleteTransaction, getTransactions } from "../api/transactionApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { SquarePen } from "lucide-react";
import type { Transaction } from "../types";
import EditTransactionForm from "./forms/EditTransactionForm";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const Transactions = () => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

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

  //slice
  const displayedTransactions = transaction?.slice(0, 4);

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
    <div className="max-w-full rounded-lg">
      {isLoading && <p>Loading...</p>}

      {!isLoading && (!transaction || transaction.length === 0) ? (
        <div className="bg-white rounded-lg p-8 shadow text-center">
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first transaction to get started
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {displayedTransactions?.map((transaction) => (
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
                      aria-label="Edit transaction"
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

      {/* limit the list at 4 */}
      {transaction && transaction.length > 4 && (
        <Link to="/transactions">
          <div className="w-full mt-3 py-2 text-sm text-[#004D3A] bg-gray-300 rounded-lg transition-colors cursor-pointer text-center">
            View All transactions ({transaction.length})
          </div>
        </Link>
      )}
    </div>
  );
};

export default Transactions;
