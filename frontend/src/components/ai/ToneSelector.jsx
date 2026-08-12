import { useState } from "react";

const tones = [
  "Professional",
  "Friendly",
  "Formal",
  "Empathetic",
  "Apologetic",
  "Premium",
];

export default function ToneSelector() {
  const [selected, setSelected] = useState("Friendly");

  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-8">

      <h2 className="text-2xl font-black">
        Reply Tone
      </h2>

      <p className="text-gray-400 mt-2">
        Choose how DIGITECH AI should respond.
      </p>

      <div className="mt-8 space-y-3">

        {tones.map((tone) => (

          <button
            key={tone}
            onClick={() => setSelected(tone)}
            className={`
              w-full
              h-14
              rounded-2xl
              transition
              font-semibold

              ${
                selected === tone
                  ? "bg-[#D4AF37] text-black"
                  : "bg-[#171717] border border-[#2a2a2a] hover:border-[#D4AF37]"
              }
            `}
          >
            {tone}
          </button>

        ))}

      </div>

    </div>
  );
}