import { deleteTransaction, getTransactions } from "../api/transactionApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import type { Transaction } from "../types";
import EditTransactionForm from "./EditTransactionForm";

const TrashIcon = FaTrashCan as React.FC;
const EditIcon = FiEdit as React.FC;

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

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      console.log("Delete successful, invalidating...");
      queryClient.invalidateQueries({ queryKey: [`transactions`] });
      toast.success("Transaction deleted");
    },
    onError: () => toast.error("Failed to delete transaction"),
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    if (error) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message || "Failed to load transactions";
      toast.error(message);
    }
  }, [error]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-4 shadow">
      {isLoading && <p>Loading...</p>}
      <ul className="space-y-1">
        {transaction?.map((transaction) => (
          <li key={transaction._id}>
            <div className="flex items-center justify-between bg-white rounded-lg p-4 ">
              {/* Left side - icon and details */}
              <div className="flex items-center gap-4">
                {/* Category icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    transaction.type === "income"
                      ? "bg-[#7FA033]/20 text-[#7FA033]"
                      : "bg-[#d64a17]/20 text-[#d64a17]"
                  }`}
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
                  <p className="font-medium text-gray-800">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.category}
                  </p>
                </div>
              </div>

              {/* Right side - amount and actions */}
              <div className="flex items-center gap-4">
                <p
                  className={`font-bold text-lg ${
                    transaction.type === "income"
                      ? "text-[#7FA033]"
                      : "text-[#d64a17]"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    aria-label="Edit transaction"
                    className="p-2 text-gray-400 hover:text-[#004D3A] hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setEditingTransaction(transaction)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    aria-label="Edit transaction"
                    className="p-2 text-gray-400 hover:text-[#d64a17] hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleDelete(transaction._id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* edit form */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => setEditingTransaction(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
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

export default Transactions;
