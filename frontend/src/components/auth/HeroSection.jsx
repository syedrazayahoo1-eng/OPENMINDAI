import { motion } from "framer-motion";
import Logo from "./Logo";

export default function HeroSection() {
  return (
    <div className="hidden lg:flex flex-1 items-center relative z-20">
      <div className="max-w-[720px]">

        <Logo />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .2 }}
          className="mt-8 text-7xl font-black leading-none"
        >
          Enterprise
          <br />

          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            AI Platform
          </span>

          <br />

          <span className="text-slate-300">
            For Google Business
          </span>

        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .5 }}
          className="mt-8 text-2xl leading-10 text-slate-400 max-w-[650px]"
        >
          Automate review management. Generate intelligent AI replies.
          Publish business content. Track enterprise analytics.
          Manage hundreds of locations from one intelligent workspace.
        </motion.p>

      </div>
    </div>
  );
}