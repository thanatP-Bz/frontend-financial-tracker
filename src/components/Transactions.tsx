import { deleteTransaction, getTransactions } from "../api/transactionApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { FaTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";

const TrashIcon = FaTrashCan as React.FC;
const EditIcon = FiEdit as React.FC;

const Transactions = () => {
  const queryClient = useQueryClient();
  const {
    data: transactions,
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
    <div>
      {isLoading && <p>Loading...</p>}
      <ul>
        {transactions?.map((transaction) => (
          <li key={transaction._id}>
            <div className="flex rounded-2xl w-fit gap-x-5 m-2 p-4 bg-[#4F81B7] text-white">
              <div>{transaction.type}</div>
              <div>amount:${transaction.amount}</div>
              <div>{transaction.category}</div>
              <div>description: {transaction.description}</div>
              <div className=" text-white py-2 cursor-pointer text-lg ">
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
    </div>
  );
};

export default Transactions;
