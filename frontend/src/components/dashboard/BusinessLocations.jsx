import {
  Building2,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";

const businesses = [
  {
    name: "Pizza Palace",
    city: "Bangalore",
    rating: "4.9",
    reviews: "1,284",
  },
  {
    name: "Coffee Hub",
    city: "Hyderabad",
    rating: "4.8",
    reviews: "842",
  },
  {
    name: "Royal Restaurant",
    city: "Chennai",
    rating: "4.7",
    reviews: "1,012",
  },
  {
    name: "Burger House",
    city: "Mumbai",
    rating: "4.9",
    reviews: "2,148",
  },
];

export default function BusinessLocations() {
  return (
    <div className="rounded-[32px] border border-[#232323] bg-[#101010] p-7 h-full">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-black">
          Business Locations
        </h2>

        <button className="text-[#D4AF37] font-semibold">
          View All
        </button>

      </div>

      <div className="mt-8 space-y-4">

        {businesses.map((item, index) => (

          <div
            key={index}
            className="
            rounded-2xl
            bg-[#171717]
            hover:bg-[#1E1E1E]
            transition
            p-5
            cursor-pointer
            "
          >

            <div className="flex justify-between">

              <div className="flex gap-4">

                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">

                  <Building2
                    className="text-[#D4AF37]"
                    size={24}
                  />

                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400 mt-2">

                    <MapPin size={15} />

                    {item.city}

                  </div>

                  <div className="flex items-center gap-2 mt-2">

                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />

                    <span className="font-semibold">
                      {item.rating}
                    </span>

                    <span className="text-gray-500">
                      ({item.reviews} reviews)
                    </span>

                  </div>

                </div>

              </div>

              <ChevronRight className="text-gray-500" />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}