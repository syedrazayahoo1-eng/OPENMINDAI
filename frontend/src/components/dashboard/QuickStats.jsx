import {
  Star,
  MessageSquare,
  Building2,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Reviews",
    value: "14,862",
    change: "+18%",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    title: "AI Replies",
    value: "13,905",
    change: "94%",
    icon: MessageSquare,
    color: "text-cyan-400",
  },
  {
    title: "Businesses",
    value: "286",
    change: "+6",
    icon: Building2,
    color: "text-green-400",
  },
  {
    title: "Growth",
    value: "28%",
    change: "Monthly",
    icon: TrendingUp,
    color: "text-[#D4AF37]",
  },
];

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="
            rounded-[28px]
            bg-[#101010]
            border
            border-[#232323]
            p-6
            hover:border-[#D4AF37]
            transition
            "
          >

            <div className="flex justify-between">

              <div>

                <p className="text-gray-400 text-sm">
                  {item.title}
                </p>

                <h2 className="text-4xl font-black mt-3">
                  {item.value}
                </h2>

                <p className="text-green-400 mt-3">
                  {item.change}
                </p>

              </div>

              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-[#181818]
                flex
                items-center
                justify-center
                "
              >

                <Icon
                  className={item.color}
                  size={26}
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
}