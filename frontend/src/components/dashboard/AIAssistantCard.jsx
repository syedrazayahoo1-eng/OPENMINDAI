import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Cpu,
  Zap,
} from "lucide-react";

export default function AIAssistantCard() {
  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-7 h-full flex flex-col">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-400 text-sm">
            AI Assistant
          </p>

          <h2 className="text-3xl font-black mt-2">
            DIGITECH AI
          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">

          <BrainCircuit
            size={30}
            className="text-[#D4AF37]"
          />

        </div>

      </div>

      <div className="mt-8 space-y-4 flex-1">

        <div className="flex items-center gap-4 rounded-2xl bg-[#161616] p-4">

          <Cpu className="text-cyan-400" />

          <div>

            <h3 className="font-semibold">
              AI Reply Engine
            </h3>

            <p className="text-gray-400 text-sm">
              213 replies generated today
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#161616] p-4">

          <Sparkles className="text-yellow-400" />

          <div>

            <h3 className="font-semibold">
              Smart Suggestions
            </h3>

            <p className="text-gray-400 text-sm">
              12 businesses need attention
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#161616] p-4">

          <Zap className="text-green-400" />

          <div>

            <h3 className="font-semibold">
              Automation
            </h3>

            <p className="text-gray-400 text-sm">
              Running without interruption
            </p>

          </div>

        </div>

      </div>

      <button
        className="
        mt-8
        h-14
        rounded-2xl
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        flex
        items-center
        justify-center
        gap-3
        font-bold
        hover:scale-[1.02]
        transition
        "
      >
        Open AI Assistant

        <ArrowRight size={18} />

      </button>

    </div>
  );
}