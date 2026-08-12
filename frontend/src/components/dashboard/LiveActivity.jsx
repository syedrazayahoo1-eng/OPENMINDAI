import {
  Star,
  MessageSquare,
  Building2,
  Sparkles,
} from "lucide-react";

const activities = [
  {
    icon: Star,
    color: "text-yellow-400",
    title: "New 5★ Review",
    description: "Pizza Palace • 2 minutes ago",
  },
  {
    icon: MessageSquare,
    color: "text-cyan-400",
    title: "AI replied automatically",
    description: "Coffee Hub • 5 minutes ago",
  },
  {
    icon: Building2,
    color: "text-green-400",
    title: "Business synced",
    description: "Royal Restaurant • 11 minutes ago",
  },
  {
    icon: Sparkles,
    color: "text-purple-400",
    title: "AI Insight Generated",
    description: "Customer satisfaction increased",
  },
];

export default function LiveActivity() {
  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-7 h-full">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-black">
          Live Activity
        </h2>

        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold">
          LIVE
        </span>

      </div>

      <div className="mt-8 space-y-5">

        {activities.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="flex gap-4 items-start"
            >

              <div
                className={`w-12 h-12 rounded-xl bg-[#181818] flex items-center justify-center ${item.color}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  {item.description}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}