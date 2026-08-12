export default function Badge({
  children,
  color = "purple",
}) {
  const colors = {
    purple: "bg-violet-500/20 text-violet-300",
    blue: "bg-blue-500/20 text-blue-300",
    green: "bg-green-500/20 text-green-300",
    gold: "bg-yellow-500/20 text-yellow-300",
    red: "bg-red-500/20 text-red-300",
  };

  return (
    <span
      className={`
      inline-flex
      items-center
      px-3
      py-1
      rounded-full
      text-xs
      font-semibold
      ${colors[color]}
      `}
    >
      {children}
    </span>
  );
}