import {
  Sparkles,
  MessageSquare,
  CalendarDays,
  Building2,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Generate AI Reply",
    subtitle: "Reply to customer reviews",
    icon: Sparkles,
    color: "bg-[#D4AF37] text-black",
  },
  {
    title: "View Reviews",
    subtitle: "Open latest reviews",
    icon: MessageSquare,
    color: "bg-[#171717] text-white",
  },
  {
    title: "Schedule Post",
    subtitle: "Publish Google updates",
    icon: CalendarDays,
    color: "bg-[#171717] text-white",
  },
  {
    title: "Businesses",
    subtitle: "Manage locations",
    icon: Building2,
    color: "bg-[#171717] text-white",
  },
];

export default function QuickActions() {
  return (
    <div
      className="
      bg-[#111111]
      border
      border-[#242424]
      rounded-2xl
      p-6
      h-full
      "
    >
      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">

        {actions.map((item, index) => {

          const Icon = item.icon;

          return (

            <button
              key={index}
              className={`
                w-full
                rounded-xl
                px-5
                py-4
                flex
                items-center
                justify-between
                transition-all
                duration-300
                hover:scale-[1.02]
                ${item.color}
              `}
            >

              <div className="flex items-center gap-4">

                <Icon size={22} />

                <div className="text-left">

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p
                    className={`text-sm ${
                      item.color.includes("text-black")
                        ? "text-black/70"
                        : "text-gray-400"
                    }`}
                  >
                    {item.subtitle}
                  </p>

                </div>

              </div>

              <ArrowRight size={18} />

            </button>

          );

        })}

      </div>

    </div>
  );
}