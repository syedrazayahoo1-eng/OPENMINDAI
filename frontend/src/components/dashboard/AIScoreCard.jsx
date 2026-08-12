import { motion } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";

const metrics = [
  {
    title: "Azure OpenAI",
    value: "Connected",
    icon: BrainCircuit,
    color: "text-cyan-400",
  },
  {
    title: "GPT Model",
    value: "GPT-5.5",
    icon: Sparkles,
    color: "text-yellow-400",
  },
  {
    title: "Latency",
    value: "182 ms",
    icon: Zap,
    color: "text-green-400",
  },
  {
    title: "Security",
    value: "Protected",
    icon: ShieldCheck,
    color: "text-blue-400",
  },
];

export default function AIScoreCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-[#111827]
        backdrop-blur-2xl
        p-7
      "
    >
      {/* Background Glow */}

      <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10">

        {/* Header */}

        <div className="flex items-center gap-4">

          <div
            className="
            h-16
            w-16
            rounded-2xl
            bg-cyan-500/10
            flex
            items-center
            justify-center
            "
          >
            <BrainCircuit
              size={34}
              className="text-cyan-400"
            />
          </div>

          <div>

            <p className="uppercase tracking-[4px] text-xs text-cyan-400">
              Enterprise AI
            </p>

            <h2 className="text-3xl font-black text-white mt-2">
              Azure AI Status
            </h2>

          </div>

        </div>

        {/* Overall Score */}

        <div
          className="
          mt-8
          rounded-3xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          p-6
          "
        >
          <p className="text-black/70 font-semibold">
            AI Health Score
          </p>

          <div className="flex items-end justify-between mt-3">

            <h1 className="text-6xl font-black text-black">
              98%
            </h1>

            <CheckCircle2
              size={42}
              className="text-black"
            />

          </div>

        </div>

        {/* Metrics */}

        <div className="mt-8 space-y-5">

          {metrics.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-black/20
                border
                border-white/5
                px-5
                py-4
                "
              >
                <div className="flex items-center gap-4">

                  <div
                    className="
                    h-12
                    w-12
                    rounded-xl
                    bg-white/5
                    flex
                    items-center
                    justify-center
                    "
                  >
                    <Icon
                      size={22}
                      className={item.color}
                    />
                  </div>

                  <div>

                    <p className="text-slate-400 text-sm">
                      {item.title}
                    </p>

                    <h4 className="font-bold text-white mt-1">
                      {item.value}
                    </h4>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

        {/* Footer */}

        <div
          className="
          mt-8
          rounded-2xl
          border
          border-[#D4AF37]/20
          bg-[#D4AF37]/10
          p-4
          "
        >
          <div className="flex items-center justify-between">

            <div>

              <p className="text-[#D4AF37] font-bold">
                AI Reply Accuracy
              </p>

              <p className="text-slate-300 text-sm mt-1">
                Enterprise confidence score
              </p>

            </div>

            <div className="text-3xl font-black text-[#D4AF37]">
              99.1%
            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}
