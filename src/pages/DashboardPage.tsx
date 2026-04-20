import { useQuery } from "@tanstack/react-query";
import AddTransactionButton from "../components/AddTransactionButton";
import Navbar from "../components/Navbar";
import Transactions from "../components/Transactions";
import SummaryCards from "../components/SummaryCards";
import SpendingChart from "../components/SpendingChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { getTransactions } from "../api/transactionApi";
import { useTransactionSummary } from "../hooks/useTransactionSummary";
import { useCategoryData } from "../hooks/useCategoryData";

const DashboardPage = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  const { totalIncome, totalExpenses, balance } =
    useTransactionSummary(transactions);

  const categoryData = useCategoryData(transactions);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <AddTransactionButton />
        </div>

        {/* Summary Cards - Top Row */}
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        {/* Charts Row - Custom Widths */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          {/* Left: Bar Chart - 60% (3 columns) */}
          <div className="lg:col-span-3">
            <IncomeExpenseChart transactions={transactions} />
          </div>

          {/* Right Column: Pie Chart + Transactions - 40% (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pie Chart */}
            <SpendingChart data={categoryData} />

            {/* Recent Transactions */}
            <Transactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
