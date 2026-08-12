import { X, Sparkles, Copy, RefreshCw, Send } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

export default function ReplyAIDrawer({
  open,
  onClose,
  review,
}) {
  const [tone, setTone] = useState("Professional");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">

      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* DRAWER */}

      <div
        className="
        absolute
        right-0
        top-0
        h-screen
        w-[550px]
        bg-[#090909]
        border-l
        border-yellow-500/20
        shadow-2xl
        p-8
        overflow-auto
        "
      >

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-3xl font-black text-white">
              DIGITECH AI
            </h2>

            <p className="text-yellow-400">
              Powered by EDULEEM AI
            </p>

          </div>

          <button onClick={onClose}>

            <X
              className="text-gray-400 hover:text-white"
            />

          </button>

        </div>

        <div className="mt-10">

          <h3 className="text-xl font-bold text-white">

            Customer Review

          </h3>

          <div className="mt-5 rounded-2xl bg-[#111] p-6">

            <p className="text-gray-300">

              {review?.review}

            </p>

          </div>

        </div>

        {/* Tone */}

        <div className="mt-10">

          <label className="text-gray-400">

            Reply Tone

          </label>

          <select
            value={tone}
            onChange={(e)=>setTone(e.target.value)}
            className="
            mt-3
            w-full
            h-14
            rounded-xl
            bg-[#111]
            border
            border-yellow-500/20
            px-4
            "
          >

            <option>Professional</option>
            <option>Friendly</option>
            <option>Luxury</option>
            <option>Short</option>
            <option>Detailed</option>

          </select>

        </div>

        {/* AI */}

        <div className="mt-10">

          <div className="flex items-center gap-3">

            <Sparkles className="text-yellow-400"/>

            <h3 className="text-xl font-bold">

              AI Generated Reply

            </h3>

          </div>

          <div
            className="
            mt-5
            rounded-2xl
            bg-[#111]
            p-6
            leading-8
            min-h-[220px]
            "
          >

            <TypeAnimation
              sequence={[
                "Thank you for taking the time to share your valuable feedback. We truly appreciate your support and look forward to serving you again soon.",
              ]}
              cursor={true}
              speed={70}
            />

          </div>

        </div>

        {/* ACTIONS */}

        <div className="grid grid-cols-2 gap-4 mt-10">

          <button
            className="
            h-14
            rounded-xl
            bg-yellow-500
            text-black
            font-bold
            flex
            items-center
            justify-center
            gap-3
            "
          >

            <Send size={18}/>

            Post Reply

          </button>

          <button
            className="
            h-14
            rounded-xl
            border
            border-yellow-500
            flex
            items-center
            justify-center
            gap-3
            "
          >

            <RefreshCw size={18}/>

            Regenerate

          </button>

          <button
            className="
            h-14
            rounded-xl
            border
            border-yellow-500
            flex
            items-center
            justify-center
            gap-3
            col-span-2
            "
          >

            <Copy size={18}/>

            Copy Response

          </button>

        </div>

      </div>

    </div>
  );
}