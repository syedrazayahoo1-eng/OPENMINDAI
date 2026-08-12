export default function BusinessHealth() {
  return (
    <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#101010] p-6">

      <h2 className="text-2xl font-bold mb-6">
        Business Health
      </h2>

      <div className="space-y-5">

        <Item title="Overall Rating" value="4.8 ⭐" />
        <Item title="Response Time" value="3 min" />
        <Item title="Pending Reviews" value="14" />
        <Item title="AI Success" value="98%" />

      </div>

    </div>
  );
}

function Item({ title, value }) {
  return (
    <div className="flex justify-between border-b border-[#D4AF37]/10 pb-3">

      <span className="text-gray-400">
        {title}
      </span>

      <span className="font-bold text-[#D4AF37]">
        {value}
      </span>

    </div>
  );
}