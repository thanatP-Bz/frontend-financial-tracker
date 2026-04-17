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
      <div className="bg-[#84572f]/70 rounded-lg p-4 shadow">
        <p className="text-sm text-white">Total Income</p>
        <p className="text-2xl font-bold text-white">
          ${totalIncome.toFixed(2)}
        </p>
      </div>

      {/* Expenses Card */}
      <div className="bg-[#f1a805]/20 rounded-lg p-4 shadow">
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-2xl font-bold text-[#84572f]">
          ${totalExpenses.toFixed(2)}
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-[#f2d6a1] rounded-lg p-4 shadow">
        <p className="text-sm text-white">Balance</p>
        <p className={`text-2xl font-bold text-[#84572f]`}>
          ${balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
