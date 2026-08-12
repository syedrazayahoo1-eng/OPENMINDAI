import {
  Star,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

const reviews = [
  {
    name: "John Smith",
    business: "Pizza Palace",
    rating: 5,
    review: "Amazing food and excellent customer service.",
    ai: "Reply Ready",
  },
  {
    name: "Sarah Johnson",
    business: "Coffee Hub",
    rating: 4,
    review: "Nice ambience. Loved the coffee.",
    ai: "Replied",
  },
  {
    name: "Michael Brown",
    business: "Royal Restaurant",
    rating: 5,
    review: "Highly recommended for family dinners.",
    ai: "Pending",
  },
];

export default function RecentReviews() {
  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-7">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-black">
          Recent Reviews
        </h2>

        <button className="text-[#D4AF37] font-semibold">
          View All
        </button>

      </div>

      <div className="mt-8 space-y-5">

        {reviews.map((item, index) => (

          <div
            key={index}
            className="rounded-2xl bg-[#171717] p-5 hover:bg-[#1d1d1d] transition"
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-bold text-lg">
                  {item.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {item.business}
                </p>

              </div>

              <div className="flex items-center gap-1">

                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}

              </div>

            </div>

            <p className="text-gray-300 mt-5 leading-7">
              {item.review}
            </p>

            <div className="flex justify-between items-center mt-6">

              <span
                className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-cyan-500/10
                text-cyan-400
                text-sm
                "
              >

                <Sparkles size={16} />

                {item.ai}

              </span>

              <button
                className="
                flex
                items-center
                gap-2
                px-5
                py-2
                rounded-xl
                bg-[#D4AF37]
                text-black
                font-semibold
                "
              >

                <ThumbsUp size={16} />

                AI Reply

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}