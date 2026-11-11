type Props = {
  className?: string;
};

/**
 * Handwritten "You're here!" pointer matching Image 2.
 * Features rotated script text and a hand-drawn C-curve arrow pointing left at the target.
 */
export default function YouAreHereBadge({ className }: Props) {
  return (
    <div
      className={`pointer-events-none z-10 hidden select-none flex-col items-start md:flex ${
        className ?? "absolute left-full ml-4 top-1/2 -translate-y-1/2"
      }`}
    >
      <span className="translate-x-3 -rotate-12 font-serif text-sm font-bold italic tracking-wide text-[#c084fc] drop-shadow-[0_0_10px_rgba(192,132,252,0.9)] sm:text-base whitespace-nowrap">
        You&apos;re here!
      </span>
      <svg
        className="-mt-1 ml-1 h-9 w-11 text-[#c084fc] drop-shadow-[0_0_8px_rgba(192,132,252,0.85)]"
        viewBox="0 0 52 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 44 4 C 40 20, 24 34, 6 35" />
        <path d="M 16 26 L 5 35 L 16 43" />
      </svg>
    </div>
  );
}
