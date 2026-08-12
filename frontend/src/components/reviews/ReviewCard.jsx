import {
  Star,
  Sparkles,
  MessageSquare,
  MapPin,
} from "lucide-react";

export default function ReviewCard({ review }) {
  return (
    <div
      className="
      rounded-[28px]
      border
      border-[#232323]
      bg-[#101010]
      p-6
      hover:border-[#D4AF37]
      transition
      "
    >

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold">
            {review.name}
          </h2>

          <div className="flex items-center gap-2 text-gray-400 mt-2">

            <MapPin size={15} />

            {review.business}

          </div>

        </div>

        <div className="flex gap-1">

          {[...Array(review.rating)].map((_, i) => (

            <Star
              key={i}
              size={18}
              className="text-yellow-400 fill-yellow-400"
            />

          ))}

        </div>

      </div>

      <p className="text-gray-300 leading-7 mt-6">

        {review.review}

      </p>

      <div className="flex justify-between items-center mt-8">

        <div
          className="
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-xl
          bg-cyan-500/10
          text-cyan-400
          "
        >

          <Sparkles size={16} />

          AI Ready

        </div>

        <button
          className="
          flex
          items-center
          gap-2
          px-5
          py-3
          rounded-xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          text-white
          font-semibold
          "
        >

          <MessageSquare size={16} />

          Generate Reply

        </button>

      </div>

    </div>
  );
}