import {
  Building2,
  Star,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Businesses",
    value: "286",
    change: "+12%",
    icon: Building2,
  },
  {
    title: "Reviews",
    value: "14.8K",
    change: "+18%",
    icon: Star,
  },
  {
    title: "AI Replies",
    value: "98%",
    change: "+6%",
    icon: MessageSquare,
  },
  {
    title: "Automation",
    value: "99.9%",
    change: "Healthy",
    icon: Sparkles,
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="
              rounded-3xl
              bg-[#101010]
              border
              border-[#232323]
              p-7
              transition-all
              duration-300
              hover:border-[#D4AF37]
              hover:-translate-y-1
            "
          >

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-400 text-sm">
                  {item.title}
                </p>

                <h2 className="text-5xl font-black mt-3">
                  {item.value}
                </h2>

                <p className="text-[#D4AF37] mt-3 text-sm">
                  {item.change}
                </p>

              </div>

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-[#D4AF37]/10
                  flex
                  items-center
                  justify-center
                "
              >

                <Icon
                  size={30}
                  className="text-[#D4AF37]"
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
}