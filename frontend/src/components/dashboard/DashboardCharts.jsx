import RevenueChart from "../charts/RevenueChart";
import ReviewChart from "../charts/ReviewsChart";

export default function DashboardCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">

      <div
        className="
        rounded-3xl
        border
        border-[#D4AF37]/20
        bg-[#101010]
        p-6
        "
      >
        <h2 className="text-xl font-bold mb-5">
          Business Growth
        </h2>

        <RevenueChart />
      </div>

      <div
        className="
        rounded-3xl
        border
        border-[#D4AF37]/20
        bg-[#101010]
        p-6
        "
      >
        <h2 className="text-xl font-bold mb-5">
          Reviews Overview
        </h2>

        <ReviewChart />
      </div>

    </div>
  );
}