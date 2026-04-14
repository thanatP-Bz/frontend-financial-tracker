import Navbar from "../components/Navbar";
import Transactions from "../components/Transactions";
import AddTransactionPage from "./AddTransactionForm";

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <AddTransactionPage />
      <Transactions />
    </div>
  );
}
