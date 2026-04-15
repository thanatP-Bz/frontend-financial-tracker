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
    <div className="max-w-md mx-auto p-4">
      {isLoading && <p>Loading...</p>}
      <ul>
        {transaction?.map((transaction) => (
          <li key={transaction._id}>
            <div className="flex rounded-2xl w-fit gap-x-2 m-2 p-3 bg-[#e5778c] text-white">
              <div>{transaction.type}</div>
              <div>amount:${transaction.amount}</div>
              <div>{transaction.category}</div>
              <div>description: {transaction.description}</div>
              <div
                className=" text-white py-2 cursor-pointer text-lg"
                onClick={() => setEditingTransaction(transaction)}
              >
                <EditIcon />
              </div>
              <div
                className=" text-white p-2 cursor-pointer text-lg "
                onClick={() => handleDelete(transaction._id)}
              >
                <TrashIcon />
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
