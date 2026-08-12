import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Building2,
  MessageSquare,
  Star,
  TrendingUp
} from "lucide-react";

export default function FloatingCards() {

  return (

    <motion.div

      initial={{
        opacity: 0,
        x: 80
      }}

      animate={{
        opacity: 1,
        x: 0,
        y: [-12, 12, -12],
        rotate: [-6, -4, -6]
      }}

      transition={{
        opacity: {
          duration: 1
        },
        x: {
          duration: 1
        },
        y: {
          repeat: Infinity,
          duration: 7
        },
        rotate: {
          repeat: Infinity,
          duration: 7
        }
      }}

      className="
      w-[560px]
      rounded-[36px]
      border
      border-white/10
      bg-white/[0.05]
      backdrop-blur-3xl
      p-8
      shadow-[0_50px_120px_rgba(0,0,0,.6)]
      "

    >

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-white">

            Enterprise Dashboard

          </h2>

          <p className="text-slate-400 mt-2">

            Live AI Overview

          </p>

        </div>

        <div className="rounded-full bg-blue-500/20 p-4">

          <Activity className="text-blue-400" />

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-5 mt-8">

        <Stat
          icon={Building2}
          title="Businesses"
          value="286"
          color="text-sky-400"
        />

        <Stat
          icon={MessageSquare}
          title="Reviews"
          value="14.2K"
          color="text-violet-400"
        />

        <Stat
          icon={Bot}
          title="AI Replies"
          value="98%"
          color="text-cyan-400"
        />

        <Stat
          icon={Star}
          title="Rating"
          value="4.9"
          color="text-yellow-400"
        />

      </div>

      {/* CHART */}

      <div className="mt-8 rounded-3xl bg-black/20 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-white font-semibold">

            Review Growth

          </h3>

          <TrendingUp className="text-green-400" />

        </div>

        <div className="mt-6 flex items-end justify-between h-36">

          {[40, 70, 55, 90, 80, 120, 150].map((h, i) => (

            <motion.div

              key={i}

              initial={{
                height: 0
              }}

              animate={{
                height: h
              }}

              transition={{
                delay: i * .08
              }}

              className="
              w-10
              rounded-full
              bg-gradient-to-t
              from-blue-600
              via-sky-500
              to-cyan-300
              "

            />

          ))}

        </div>

      </div>

    </motion.div>

  );

}

function Stat({
  icon: Icon,
  title,
  value,
  color
}) {

  return (

    <motion.div

      whileHover={{
        y: -5,
        scale: 1.02
      }}

      className="
      rounded-3xl
      border
      border-white/10
      bg-black/20
      p-5
      "

    >

      <Icon className={`${color} mb-4`} size={26} />

      <p className="text-slate-400">

        {title}

      </p>

      <h2 className="mt-2 text-4xl font-black text-white">

        {value}

      </h2>

    </motion.div>

  );

}