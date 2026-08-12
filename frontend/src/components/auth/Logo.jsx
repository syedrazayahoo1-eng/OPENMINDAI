import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      className="flex flex-nowrap items-center gap-5 max-w-full"
    >

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          flex
          h-16
          w-16
          shrink-0
          items-center
          justify-center
          rounded-3xl
          bg-gradient-to-br
          from-sky-500
          via-blue-600
          to-violet-600
          shadow-[0_0_50px_rgba(59,130,246,.45)]
        "
      >
        <Sparkles
          className="text-white"
          size={30}
        />
      </motion.div>

      <div className="min-w-0 shrink-0">

        <h1 className="whitespace-nowrap text-5xl font-black tracking-[0.22em] text-white [overflow-wrap:normal] [word-break:keep-all]">

          DIGITECH

        </h1>

        <p className="mt-2 whitespace-nowrap text-sm uppercase tracking-[0.45em] text-slate-400">

          Enterprise AI Suite

        </p>

      </div>

    </motion.div>
  );
}