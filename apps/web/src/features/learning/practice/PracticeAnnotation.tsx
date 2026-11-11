// Handwritten annotation beneath "Exit Practice" matching Image 2 mock.
export default function PracticeAnnotation() {
  return (
    <div className="pointer-events-none hidden select-none flex-col items-center xl:flex">
      <span className="font-serif text-xs italic tracking-wide text-[#c084fc] drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] -rotate-6 text-center leading-tight">
        Practice<br />today<br />Build tomorrow
      </span>
      <svg
        className="w-14 h-3 mt-1 text-[#a855f7] drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]"
        viewBox="0 0 56 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M 2 6 Q 8 1, 14 6 T 26 6 T 38 6 T 50 6" />
      </svg>
    </div>
  );
}
