export default function Input({
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <div
      className="
      flex
      items-center
      gap-3
      h-14
      px-5
      rounded-2xl
      bg-[#171C28]
      border
      border-white/5
      focus-within:border-violet-500
      transition-all
      "
    >
      {Icon && (
        <Icon
          size={20}
          className="text-slate-400"
        />
      )}

      <input
        {...props}
        className={`
        flex-1
        bg-transparent
        outline-none
        text-white
        placeholder:text-slate-500
        ${className}
        `}
      />
    </div>
  );
}