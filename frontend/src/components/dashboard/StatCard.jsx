import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div
      className="
      bg-[#111111]
      border
      border-[#242424]
      rounded-2xl
      p-6
      hover:border-[#D4AF37]
      transition-all
      duration-300
      "
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="text-5xl font-black mt-2">
            {value}
          </h2>

          <p className="text-[#D4AF37] font-semibold mt-2">
            {subtitle}
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

      <div className="mt-6 flex items-center gap-2 text-gray-500 text-sm">

        <ArrowUpRight size={16} />

        Updated just now

      </div>

    </div>
  );
}