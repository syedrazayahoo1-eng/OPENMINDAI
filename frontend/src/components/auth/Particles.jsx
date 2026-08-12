import { motion } from "framer-motion";

const particles = [...Array(45)].map((_, i) => ({
  id: i,
  size: Math.random() * 5 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
}));

export default function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 0,
            y: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [-40, -180],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
          className="absolute rounded-full bg-white"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            boxShadow: "0 0 12px rgba(255,255,255,.6)",
          }}
        />
      ))}

    </div>
  );
}