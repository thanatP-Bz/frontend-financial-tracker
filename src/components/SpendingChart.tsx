import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface SpendingChartProps {
  data: ChartData[];
}

const SpendingChart = ({ data }: SpendingChartProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow text-center">
        <p className="text-gray-500">No expenses to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data.map((d) => ({ ...d, fill: d.color }))}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
          />
          <Tooltip formatter={(value) => typeof value === "number" ? `$${value.toFixed(2)}` : value} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
