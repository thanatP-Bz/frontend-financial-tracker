import AddTransactionButton from "../components/AddTransactionButton";
import Navbar from "../components/Navbar";
import Transactions from "../components/Transactions";

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <AddTransactionButton />
      <Transactions />
    </div>
  );
}
