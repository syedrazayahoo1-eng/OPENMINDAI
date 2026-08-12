import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  icon: Icon,
  variant = "primary",
  full = false,
  className = "",
  type = "button",
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-[0_15px_40px_rgba(124,58,237,.45)]",

    secondary:
      "bg-[#171C28] border border-white/10 text-white hover:border-violet-500",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    ghost:
      "bg-transparent border border-white/10 text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.03,
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      type={type}
      onClick={onClick}
      className={`
      ${variants[variant]}
      ${full ? "w-full" : ""}
      h-12
      px-6
      rounded-2xl
      font-semibold
      transition-all
      duration-300
      flex
      items-center
      justify-center
      gap-3
      ${className}
      `}
    >
      {Icon && <Icon size={20} />}

      {children}
    </motion.button>
  );
}