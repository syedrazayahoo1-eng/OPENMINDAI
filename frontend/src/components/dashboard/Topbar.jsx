import {
  Search,
  Bell,
  Settings,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  return (
    <div className="w-full flex items-center justify-between">

      {/* Left */}

      <div className="flex items-center gap-6 flex-1">

        <div className="relative w-full max-w-xl">

          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            placeholder="Search businesses, reviews, customers..."
            className="
            w-full
            h-14
            rounded-2xl
            bg-[#151515]
            border
            border-[#262626]
            pl-14
            pr-5
            text-white
            outline-none
            focus:border-[#D4AF37]
            transition
            "
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        <div
          className="
          hidden
          lg:flex
          items-center
          gap-3
          px-5
          h-12
          rounded-2xl
          bg-[#151515]
          border
          border-[#262626]
          "
        >

          <Sparkles
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="font-semibold">
            AI Active
          </span>

        </div>

        <button
          className="
          w-12
          h-12
          rounded-2xl
          bg-[#151515]
          border
          border-[#262626]
          flex
          items-center
          justify-center
          hover:border-[#D4AF37]
          transition
          "
        >

          <Bell size={19} />

        </button>

        <button
          className="
          w-12
          h-12
          rounded-2xl
          bg-[#151515]
          border
          border-[#262626]
          flex
          items-center
          justify-center
          hover:border-[#D4AF37]
          transition
          "
        >

          <Settings size={19} />

        </button>

        <div
          className="
          flex
          items-center
          gap-4
          px-4
          h-14
          rounded-2xl
          bg-[#151515]
          border
          border-[#262626]
          "
        >

          <img
            src="https://i.pravatar.cc/100"
            alt=""
            className="w-10 h-10 rounded-full"
          />

          <div className="hidden lg:block">

            <h3 className="font-bold">
              Sar Thousif
            </h3>

            <p className="text-xs text-gray-400">
              Administrator
            </p>

          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </div>
  );
}