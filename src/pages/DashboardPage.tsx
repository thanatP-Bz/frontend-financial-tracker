import { useQuery } from "@tanstack/react-query";
import AddTransactionButton from "../components/AddTransactionButton";
import Navbar from "../components/Navbar";
import Transactions from "../components/Transactions";
import SummaryCards from "../components/summaryCards";
import { getTransactions } from "../api/transactionApi";
import { useTransactionSummary } from "../hooks/useTransactionSummary";

const DashboardPage = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  const { totalIncome, totalExpenses, balance } =
    useTransactionSummary(transactions);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <AddTransactionButton />
        </div>

        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <div className="mt-4 max-w-md ml-auto">
          <Transactions />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
