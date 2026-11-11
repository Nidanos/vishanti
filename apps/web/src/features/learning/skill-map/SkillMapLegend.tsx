// Legend component showing node statuses on the skill map matching Image 2.
export default function SkillMapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-[#94a3b8]">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        <span>Completed</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="relative flex size-3.5 items-center justify-center">
          <span className="size-3.5 rounded-full border-2 border-[#a855f7] bg-[#1a0f3d]" />
          <span className="absolute size-1.5 rounded-full bg-[#e9d5ff] shadow-[0_0_8px_rgba(168,85,247,1)]" />
        </span>
        <span>Current</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-[#64748b]" />
        <span>Locked</span>
      </div>

      <div className="hidden items-center gap-1.5 sm:flex">
        <span className="h-[2px] w-5 rounded-full bg-[#334155]" />
        <span>Learning path</span>
      </div>
    </div>
  );
}
