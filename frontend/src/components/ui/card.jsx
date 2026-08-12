import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = true,
}) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              scale: 1.01,
            }
          : {}
      }
      transition={{
        duration: 0.25,
      }}
      className={`
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/5
      bg-[#121826]/90
      backdrop-blur-2xl
      shadow-[0_20px_60px_rgba(0,0,0,.35)]
      ${className}
      `}
    >
      {/* Glow Effect */}

      <div
        className="
        absolute
        inset-0
        opacity-0
        hover:opacity-100
        transition
        duration-500
        bg-gradient-to-br
        from-violet-500/10
        via-transparent
        to-blue-500/10
        pointer-events-none
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}