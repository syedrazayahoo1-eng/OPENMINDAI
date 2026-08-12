import { motion } from "framer-motion";
import {
  Building2,
  MessageSquare,
  Bot,
  Star,
  TrendingUp,
} from "lucide-react";

const bars = [20, 32, 28, 48, 45, 70, 92];

export default function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80, rotate: -8 }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: -5,
        y: [0, -12, 0],
      }}
      transition={{
        opacity: { duration: 1 },
        x: { duration: 1 },
        rotate: { duration: 1 },
        y: {
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        },
      }}
      className="
      relative
      w-[700px]
      rounded-[34px]
      overflow-hidden
      border
      border-white/10
      bg-[#141A27]/80
      backdrop-blur-3xl
      shadow-[0_40px_120px_rgba(0,0,0,.55)]
      "
    >
      {/* Glow */}

      <div className="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]" />

      <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="relative z-10 p-8">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-slate-400 text-lg">
              Enterprise Workspace
            </p>

            <h2 className="text-5xl font-black mt-1">
              AI Dashboard
            </h2>

          </div>

          <TrendingUp
            size={42}
            className="text-emerald-400"
          />

        </div>

        <div className="grid grid-cols-2 gap-5 mt-8">

          <Stat
            icon={<Building2 size={28} />}
            title="Businesses"
            value="286"
          />

          <Stat
            icon={<MessageSquare size={28} />}
            title="Reviews"
            value="14.8K"
          />

          <Stat
            icon={<Bot size={28} />}
            title="AI Replies"
            value="98%"
          />

          <Stat
            icon={<Star size={28} />}
            title="Rating"
            value="4.9"
          />

        </div>

        <div className="mt-8">

          <p className="text-xl font-semibold mb-5">
            Monthly Growth
          </p>

          <div className="flex items-end justify-between h-44">

            {bars.map((h, i) => (

              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  delay: i * .12,
                  duration: .7,
                }}
                className="
                w-12
                rounded-full
                bg-gradient-to-t
                from-blue-600
                to-cyan-300
                shadow-[0_0_30px_rgba(59,130,246,.35)]
                "
              />

            ))}

          </div>

        </div>

      </div>
    </motion.div>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#0F1522]/80
      p-5
      "
    >
      <div className="text-sky-400">
        {icon}
      </div>

      <p className="mt-2 text-slate-400 text-lg">
        {title}
      </p>

      <h3 className="text-6xl font-black mt-2">
        {value}
      </h3>
    </div>
  );
}