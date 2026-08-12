import { motion } from "framer-motion";

const nodes = [
  { top: "15%", left: "18%" },
  { top: "32%", left: "45%" },
  { top: "20%", left: "72%" },
  { top: "58%", left: "30%" },
  { top: "72%", left: "58%" },
  { top: "48%", left: "82%" },
];

export default function AnimatedNetwork() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* NETWORK LINES */}

      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        preserveAspectRatio="none"
      >
        <line x1="18%" y1="15%" x2="45%" y2="32%" stroke="#38bdf8" strokeWidth="1" />
        <line x1="45%" y1="32%" x2="72%" y2="20%" stroke="#7c3aed" strokeWidth="1" />
        <line x1="45%" y1="32%" x2="30%" y2="58%" stroke="#38bdf8" strokeWidth="1" />
        <line x1="30%" y1="58%" x2="58%" y2="72%" stroke="#38bdf8" strokeWidth="1" />
        <line x1="72%" y1="20%" x2="82%" y2="48%" stroke="#7c3aed" strokeWidth="1" />
        <line x1="58%" y1="72%" x2="82%" y2="48%" stroke="#38bdf8" strokeWidth="1" />
      </svg>

      {/* GLOWING NODES */}

      {nodes.map((node, index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
          }}
          className="
            absolute
            h-3
            w-3
            rounded-full
            bg-cyan-400
            shadow-[0_0_20px_rgba(56,189,248,.8)]
          "
          style={{
            top: node.top,
            left: node.left,
          }}
        />
      ))}

    </div>
  );
}