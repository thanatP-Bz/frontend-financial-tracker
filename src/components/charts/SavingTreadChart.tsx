import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface MonthlySaving {
  month: string;
  saved: number;
  savingsRate: number;
}

interface SavingsTrendChartProps {
  data: MonthlySaving[];
}

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short" });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTick = ({ x, y, payload, data }: any) => {
  const entry = data.find((d: MonthlySaving) => d.month === payload.value);
  const saved = entry ? entry.saved : 0;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        className="text-sm font-medium"
        fill="#374151"
      >
        {formatMonth(payload.value)}
      </text>
      <text
        x={0}
        y={0}
        dy={34}
        textAnchor="middle"
        className="text-xs"
        fill="#0F6E56"
      >
        +${saved.toFixed(0)}
      </text>
    </g>
  );
};

const SavingsTrendChart = ({ data }: SavingsTrendChartProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow text-center">
        <p className="text-gray-500">No savings data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Savings Trend</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomTick data={data} />}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? `${value.toFixed(1)}%` : value
            }
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="savingsRate"
            stroke="#378ADD"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#378ADD" }}
            name="Savings Rate"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsTrendChart;
