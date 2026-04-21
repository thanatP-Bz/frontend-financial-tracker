import { useQuery } from "@tanstack/react-query";
import AddTransactionButton from "../components/AddTransactionButton";
import Transactions from "../components/Transactions";
import SummaryCards from "../components/SummaryCards";
import SpendingChart from "../components/charts/SpendingChart";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import { getTransactions } from "../api/transactionApi";
import { useTransactionSummary } from "../hooks/useTransactionSummary";
import { useCategoryData } from "../hooks/useCategoryData";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar (now without FinanceTracker title - it's in sidebar) */}
        <Navbar />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <AddTransactionButton />
            </div>

            {/* Your existing dashboard content */}
            <SummaryCards
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={balance}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
              <div className="lg:col-span-3">
                <IncomeExpenseChart transactions={transactions} />
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                <SpendingChart data={categoryData} />
                <Transactions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
