import {
  MessageSquare,
  Building2,
  Star,
  Sparkles,
} from "lucide-react";

const activities = [
  {
    icon: MessageSquare,
    title: "AI replied to a review",
    time: "2 minutes ago",
  },
  {
    icon: Building2,
    title: "Google Business synced",
    time: "10 minutes ago",
  },
  {
    icon: Star,
    title: "New 5-star review received",
    time: "18 minutes ago",
  },
  {
    icon: Sparkles,
    title: "AI generated a new post",
    time: "32 minutes ago",
  },
];

export default function RecentActivity() {
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
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="
              flex
              items-center
              gap-4
              pb-5
              border-b
              border-[#1e1e1e]
              last:border-0
              last:pb-0
              "
            >

              <div
                className="
                w-12
                h-12
                rounded-xl
                bg-[#D4AF37]/10
                flex
                items-center
                justify-center
                "
              >
                <Icon
                  size={22}
                  className="text-[#D4AF37]"
                />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.time}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}