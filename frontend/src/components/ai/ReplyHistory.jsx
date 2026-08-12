import {
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const history = [
  {
    business: "Pizza Palace",
    customer: "John Smith",
    status: "Published",
    time: "2 mins ago",
  },
  {
    business: "Coffee Hub",
    customer: "Sarah Johnson",
    status: "Generated",
    time: "15 mins ago",
  },
  {
    business: "Royal Restaurant",
    customer: "Michael Brown",
    status: "Published",
    time: "1 hour ago",
  },
  {
    business: "Burger House",
    customer: "Emma Wilson",
    status: "Draft",
    time: "Today",
  },
];

export default function ReplyHistory() {
  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-8">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-black">
          AI Reply History
        </h2>

        <Sparkles
          className="text-[#D4AF37]"
          size={22}
        />

      </div>

      <div className="mt-8 space-y-5">

        {history.map((item, index) => (

          <div
            key={index}
            className="
              rounded-2xl
              bg-[#171717]
              border
              border-[#232323]
              p-5
              hover:border-[#D4AF37]
              transition
            "
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-bold">
                  {item.customer}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {item.business}
                </p>

              </div>

              <div
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold

                  ${
                    item.status === "Published"
                      ? "bg-green-500/10 text-green-400"
                      : item.status === "Generated"
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }
                `}
              >
                {item.status}
              </div>

            </div>

            <div className="flex items-center justify-between mt-5">

              <div className="flex items-center gap-2 text-gray-500 text-sm">

                <Clock size={15} />

                {item.time}

              </div>

              <CheckCircle2
                className="text-green-400"
                size={18}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}