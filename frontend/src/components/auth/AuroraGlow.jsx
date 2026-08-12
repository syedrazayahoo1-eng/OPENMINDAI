import { motion } from "framer-motion";

export default function AuroraGlow() {
  return (
    <>
      <motion.div
        animate={{
          x: [-120, 120, -120],
          y: [-80, 80, -80],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
        absolute
        -left-72
        top-[-220px]
        h-[700px]
        w-[700px]
        rounded-full
        bg-violet-600/20
        blur-[150px]
        pointer-events-none
        "
      />

      <motion.div
        animate={{
          x: [100, -100, 100],
          y: [60, -60, 60],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
        absolute
        right-[-260px]
        bottom-[-260px]
        h-[760px]
        w-[760px]
        rounded-full
        bg-sky-500/20
        blur-[160px]
        pointer-events-none
        "
      />

      <motion.div
        animate={{
          opacity: [.2, .5, .2],
          scale: [.9, 1.1, .9],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
        absolute
        left-1/2
        top-1/2
        h-[420px]
        w-[420px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-cyan-400/10
        blur-[120px]
        pointer-events-none
        "
      />
    </>
  );
}