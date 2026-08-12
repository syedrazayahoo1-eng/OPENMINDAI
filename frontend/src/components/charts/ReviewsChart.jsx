import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", reviews: 18 },
  { day: "Tue", reviews: 24 },
  { day: "Wed", reviews: 32 },
  { day: "Thu", reviews: 27 },
  { day: "Fri", reviews: 38 },
  { day: "Sat", reviews: 42 },
  { day: "Sun", reviews: 35 },
];

export default function ReviewsChart() {
  return (
    <div className="h-[300px] w-full">

      <ResponsiveContainer width="100%" height="100%">

        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="goldGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#D4AF37"
                stopOpacity={0.7}
              />

              <stop
                offset="100%"
                stopColor="#D4AF37"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            stroke="#222"
            vertical={false}
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="day"
            stroke="#777"
            tick={{ fill: "#888", fontSize: 12 }}
          />

          <YAxis
            stroke="#777"
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

          <Area
            type="monotone"
            dataKey="reviews"
            stroke="#D4AF37"
            strokeWidth={3}
            fill="url(#goldGradient)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}