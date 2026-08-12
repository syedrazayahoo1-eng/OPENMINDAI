export default function ReviewFeed() {
  const reviews = [
    {
      name: "John Smith",
      rating: "★★★★★",
      review: "Amazing support and quick service.",
    },
    {
      name: "Sarah",
      rating: "★★★★☆",
      review: "Very good experience overall.",
    },
    {
      name: "Michael",
      rating: "★★★★★",
      review: "Highly recommended business.",
    },
  ];

  return (
    <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#101010] p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Live Reviews
        </h2>

        <button className="bg-[#D4AF37] text-black px-4 py-2 rounded-xl font-semibold">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {reviews.map((r) => (
          <div
            key={r.name}
            className="rounded-2xl bg-[#181818] p-5 border border-[#D4AF37]/10"
          >

            <div className="flex justify-between">

              <div>

                <h3 className="font-bold">
                  {r.name}
                </h3>

                <p className="text-[#D4AF37]">
                  {r.rating}
                </p>

              </div>

              <button className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold">
                AI Reply
              </button>

            </div>

            <p className="text-gray-400 mt-4">
              {r.review}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}