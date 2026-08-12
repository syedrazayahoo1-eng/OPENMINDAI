import { Sparkles } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
}) {
  return (
    <div
      className="
      rounded-[32px]
      overflow-hidden
      border
      border-[#232323]
      bg-gradient-to-r
      from-[#0F172A]
      via-[#111827]
      to-[#0B1120]
      p-10
      relative
      "
    >
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#D4AF37]/10 blur-[180px]" />

      <div className="relative flex justify-between items-center">

        <div>

          <div
            className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[#D4AF37]/10
            px-4
            py-2
            text-[#D4AF37]
            text-sm
            font-semibold
            "
          >

            <Sparkles size={16} />

            DIGITECH Enterprise

          </div>

          <h1 className="mt-6 text-5xl font-black">

            {title}

          </h1>

          <p className="mt-4 text-gray-400 text-lg">

            {subtitle}

          </p>

        </div>

        <div className="hidden xl:block text-right">

          <h2 className="text-6xl font-black text-[#D4AF37]/20">
            AI
          </h2>

          <p className="text-gray-500 mt-3">
            Enterprise Workspace
          </p>

        </div>

      </div>

    </div>
  );
}