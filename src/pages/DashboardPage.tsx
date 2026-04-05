import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTransactions } from '../api/transactionApi';
import TransactionCard from '../components/TransactionCard';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(),
  });

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Link
            to="/add-transaction"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            + Add Transaction
          </Link>
        </div>

        {isLoading && <p className="text-gray-500">Loading...</p>}
        {isError && <p className="text-red-500">Failed to load transactions.</p>}
        {transactions && transactions.length === 0 && (
          <p className="text-gray-500">No transactions yet.</p>
        )}

        <div className="space-y-3">
          {transactions?.map((t) => (
            <TransactionCard key={t._id} transaction={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
