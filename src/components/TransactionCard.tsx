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
    <div>
      <div>
        <p>{transaction.description}</p>
        <p>
          {transaction.category} · {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
      <div>
        <span>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </span>
        <Link to={`/edit-transaction/${transaction._id}`}>Edit</Link>
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
