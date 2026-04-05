import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteTransaction } from '../api/transactionApi';
import type { Transaction } from '../types';

interface Props {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteTransaction(transaction._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction deleted');
    },
    onError: () => toast.error('Failed to delete transaction'),
  });

  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div>
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-gray-500">
          {transaction.category} · {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className={transaction.type === 'income' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </span>
        <Link to={`/edit-transaction/${transaction._id}`} className="text-sm text-blue-600 hover:underline">
          Edit
        </Link>
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="text-sm text-red-500 hover:underline disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
