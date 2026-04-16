interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const SummaryCards = ({
  totalIncome,
  totalExpenses,
  balance,
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Income Card */}
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="text-sm text-gray-500">Total Income</p>
        <p className="text-2xl font-bold text-[#7FA033]">
          ${totalIncome.toFixed(2)}
        </p>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-2xl font-bold text-[#d64a17]">
          ${totalExpenses.toFixed(2)}
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="text-sm text-gray-500">Balance</p>
        <p
          className={`text-2xl font-bold ${balance >= 0 ? "text-[#004D3A]" : "text-red-600"}`}
        >
          ${balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
