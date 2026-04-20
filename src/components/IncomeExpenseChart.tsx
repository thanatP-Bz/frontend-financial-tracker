import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "../../src/types/index";
import { useMonthlyData } from "../hooks/useMonthlyData";

interface IncomeExpenseChartProps {
  transactions?: Transaction[];
}

const IncomeExpenseChart = ({ transactions = [] }: IncomeExpenseChartProps) => {
  const chartData = useMonthlyData(transactions);

  // Format month for display
  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={8} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={formatMonth} />
          <YAxis />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? `$${value.toFixed(2)}` : value
            }
          />
          <Legend />
          <Bar
            dataKey="income"
            fill="#92ada4"
            name="Income"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            fill="#edd5c0"
            name="Expenses"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseChart;
