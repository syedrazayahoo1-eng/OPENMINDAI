import { useState } from "react";
import {
  Wand2,
  Copy,
  RefreshCw,
  Send,
} from "lucide-react";

export default function ReplyEditor() {
  const [review] = useState(
    "Amazing food and excellent customer service. Highly recommended."
  );

  const [reply, setReply] = useState(
    "Thank you so much for your wonderful review! We're delighted to hear that you enjoyed our food and customer service. We truly appreciate your support and look forward to serving you again soon."
  );

  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-8">

      <h2 className="text-2xl font-black">
        AI Reply Workspace
      </h2>

      <p className="text-gray-400 mt-2">
        Review
      </p>

      <div className="mt-4 rounded-2xl bg-[#171717] p-6 leading-8 text-gray-300">

        {review}

      </div>

      <p className="text-gray-400 mt-8">
        Generated Reply
      </p>

      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="
        mt-4
        w-full
        min-h-[220px]
        rounded-2xl
        bg-[#171717]
        border
        border-[#2a2a2a]
        p-5
        text-white
        outline-none
        resize-none
        focus:border-[#D4AF37]
        "
      />

      <div className="flex flex-wrap gap-4 mt-8">

        <button
          className="
          h-12
          px-6
          rounded-xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          font-semibold
          flex
          items-center
          gap-2
          "
        >
          <Wand2 size={18} />

          Generate Again

        </button>

        <button
          className="
          h-12
          px-6
          rounded-xl
          bg-[#171717]
          border
          border-[#2a2a2a]
          flex
          items-center
          gap-2
          "
        >
          <RefreshCw size={18} />

          Improve

        </button>

        <button
          className="
          h-12
          px-6
          rounded-xl
          bg-[#171717]
          border
          border-[#2a2a2a]
          flex
          items-center
          gap-2
          "
        >
          <Copy size={18} />

          Copy

        </button>

        <button
          className="
          h-12
          px-6
          rounded-xl
          bg-[#D4AF37]
          text-black
          font-bold
          flex
          items-center
          gap-2
          "
        >
          <Send size={18} />

          Publish Reply

        </button>

      </div>

    </div>
  );
}