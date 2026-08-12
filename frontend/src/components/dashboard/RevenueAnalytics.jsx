import {
  TrendingUp,
  DollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", revenue: 210 },
  { month: "Feb", revenue: 240 },
  { month: "Mar", revenue: 280 },
  { month: "Apr", revenue: 320 },
  { month: "May", revenue: 370 },
  { month: "Jun", revenue: 430 },
  { month: "Jul", revenue: 520 },
];

export default function RevenueAnalytics() {
  return (
    <div
      className="
      rounded-[32px]
      border
      border-[#232323]
      bg-[#101010]
      p-7
      "
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-400 text-sm">
            Revenue Analytics
          </p>

          <h2 className="text-4xl font-black mt-2">
            ₹12.8L
          </h2>

          <div className="flex items-center gap-2 mt-3">

            <TrendingUp
              size={18}
              className="text-green-400"
            />

            <span className="text-green-400 font-semibold">
              +18.2%
            </span>

          </div>

        </div>

        <div
          className="
          h-16
          w-16
          rounded-2xl
          bg-[#D4AF37]/10
          flex
          items-center
          justify-center
          "
        >
          <DollarSign
            className="text-[#D4AF37]"
            size={30}
          />
        </div>

      </div>

      <div className="mt-10 h-[300px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="rev"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#D4AF37"
                  stopOpacity={0.8}
                />

                <stop
                  offset="100%"
                  stopColor="#D4AF37"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis
              dataKey="month"
              stroke="#777"
            />

            <Tooltip />

            <Area
              dataKey="revenue"
              stroke="#D4AF37"
              strokeWidth={3}
              fill="url(#rev)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}