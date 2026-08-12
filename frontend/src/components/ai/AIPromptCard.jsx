import {
  Sparkles,
  Zap,
  BrainCircuit,
} from "lucide-react";

export default function AIPromptCard() {
  return (
    <div className="
      rounded-[32px]
      border
      border-[#232323]
      bg-[#101010]
      p-8
    ">

      <div className="flex items-center gap-4">

        <div className="
          w-14
          h-14
          rounded-2xl
          bg-[#D4AF37]/10
          flex
          items-center
          justify-center
        ">
          <BrainCircuit
            size={28}
            className="text-[#D4AF37]"
          />
        </div>

        <div>

          <h2 className="text-2xl font-black">
            AI Reply Generator
          </h2>

          <p className="text-gray-400 mt-1">
            Generate professional responses instantly
          </p>

        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

        <div className="rounded-2xl bg-[#171717] p-5">

          <Sparkles className="text-yellow-400" />

          <h3 className="font-bold mt-4">
            Smart Replies
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            AI understands customer sentiment and creates suitable replies.
          </p>

        </div>


        <div className="rounded-2xl bg-[#171717] p-5">

          <Zap className="text-cyan-400" />

          <h3 className="font-bold mt-4">
            Instant Response
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            Generate replies in seconds for multiple reviews.
          </p>

        </div>


        <div className="rounded-2xl bg-[#171717] p-5">

          <BrainCircuit className="text-green-400" />

          <h3 className="font-bold mt-4">
            Brand Voice
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            Maintain your business communication style.
          </p>

        </div>

      </div>

    </div>
  );
}