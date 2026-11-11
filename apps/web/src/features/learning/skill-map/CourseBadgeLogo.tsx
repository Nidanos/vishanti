// 3D floating tilted badge with exact 6-ray pattern and luminous glow matching Image 2.
export default function CourseBadgeLogo({ code }: { code: string }) {
  return (
    <div className="relative flex size-36 shrink-0 items-center justify-center select-none">
      {/* Diffused atmospheric purple glow aura behind the entire badge */}
      <div
        className="pointer-events-none absolute size-32 rounded-full bg-gradient-to-tr from-[#7c3aed]/50 via-[#6366f1]/40 to-[#3b82f6]/30 blur-2xl"
        aria-hidden="true"
      />

      {/* The exact 6 radiant energy rays from Image 2 (long capsule rays with wide gap from the card) */}
      <svg
        className="pointer-events-none absolute inset-0 size-full text-[#c084fc]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* 1. Top-Left ray (angled up-left) */}
        <line x1="50" y1="50" x2="26" y2="28" className="opacity-90 drop-shadow-[0_0_8px_rgba(192,132,252,0.95)]" />

        {/* 2. Top-Right upper ray (angled up-right) */}
        <line x1="152" y1="42" x2="168" y2="18" className="opacity-90 drop-shadow-[0_0_8px_rgba(192,132,252,0.95)]" />

        {/* 3. Top-Right lower ray (angled shallow-right) */}
        <line x1="162" y1="68" x2="186" y2="58" className="opacity-85 drop-shadow-[0_0_8px_rgba(192,132,252,0.95)]" />

        {/* 4. Bottom-Left upper ray (angled shallow-left) */}
        <line x1="46" y1="134" x2="22" y2="144" className="opacity-85 drop-shadow-[0_0_8px_rgba(192,132,252,0.95)]" />

        {/* 5. Bottom-Left lower ray (angled down-left) */}
        <line x1="58" y1="156" x2="42" y2="178" className="opacity-85 drop-shadow-[0_0_8px_rgba(192,132,252,0.95)]" />

        {/* 6. Bottom-Right ray (angled down-right) */}
        <line x1="168" y1="142" x2="184" y2="156" className="opacity-85 drop-shadow-[0_0_8px_rgba(192,132,252,0.95)]" />
      </svg>

      {/* Floating 3D glossy rounded card matching Image 2 */}
      <div className="relative flex size-[86px] -rotate-[13deg] items-center justify-center rounded-[22px] border-[1.5px] border-white/35 bg-gradient-to-br from-[#7c3aed] via-[#6366f1] to-[#4338ca] shadow-[0_14px_36px_rgba(124,58,237,0.55),inset_0_2px_3px_rgba(255,255,255,0.5)] transition-transform hover:rotate-0 hover:scale-105">
        <span className="font-sans text-3xl font-black tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {code}
        </span>
      </div>
    </div>
  );
}
