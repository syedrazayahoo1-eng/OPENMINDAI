import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 240 },
  { month: "Apr", value: 330 },
  { month: "May", value: 430 },
  { month: "Jun", value: 520 },
];

export default function RevenueChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            stroke="#222"
            vertical={false}
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            stroke="#666"
            tick={{ fill: "#888", fontSize: 12 }}
          />

          <YAxis
            stroke="#666"
            tick={{ fill: "#888", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid #D4AF37",
              borderRadius: 12,
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#D4AF37"
            strokeWidth={4}
            dot={{
              fill: "#D4AF37",
              strokeWidth: 2,
              r: 5,
            }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}