import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Positive",
    value: 72,
    color: "#22C55E",
  },
  {
    name: "Neutral",
    value: 18,
    color: "#FACC15",
  },
  {
    name: "Negative",
    value: 10,
    color: "#EF4444",
  },
];

export default function ReviewAnalytics() {
  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-8">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-400 text-sm">
            Review Sentiment
          </p>

          <h2 className="text-4xl font-black mt-2">
            14,862
          </h2>

          <p className="mt-2 text-green-400 font-semibold">
            +18% this month
          </p>

        </div>

        <div className="w-[260px] h-[220px]">

          <ResponsiveContainer>

            <PieChart>

              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >

                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-5 mt-8">

        {data.map((item) => (

          <div
            key={item.name}
            className="rounded-2xl bg-[#171717] p-5"
          >

            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: item.color,
              }}
            />

            <h3 className="mt-4 text-3xl font-black">

              {item.value}%

            </h3>

            <p className="mt-2 text-gray-400">

              {item.name}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
}