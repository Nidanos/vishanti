import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import YouAreHereBadge from "./YouAreHereBadge";

type Props = {
  subtopic: string;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  onSelect: (subtopic: string) => void;
};

/** Individual interactive subtopic row in the dropdown matching Image 2 theme. */
export default function SkillSubtopicItem({ subtopic, index, isCompleted, isCurrent, isLocked, onSelect }: Props) {
  const containerClasses = isCurrent
    ? "border-[#a855f7] bg-[#1a1344]/80 shadow-[0_0_18px_rgba(168,85,247,0.25)] hover:border-[#c084fc]"
    : isCompleted
      ? "border-[#1e2d6b]/40 bg-[#10173e]/70 hover:border-[#38bdf8]/60 hover:bg-[#162054]/90"
      : "border-[#182046]/40 bg-[#0c1230]/40 opacity-50 cursor-not-allowed";

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={isLocked}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLocked) onSelect(subtopic);
        }}
        className={`group flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${containerClasses}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-semibold ${
              isCurrent ? "bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.8)]" : isCompleted ? "bg-[#1a2354] text-[#60a5fa]" : "bg-[#131b40] text-[#64748b]"
            }`}
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <span className={`block truncate text-sm font-semibold ${isLocked ? "text-[#64748b]" : "text-white"}`}>{subtopic}</span>
            <span className="block truncate text-xs text-[#94a3b8]">{isLocked ? "Complete previous subtopic to unlock" : "Study concept and solve related problems"}</span>
          </div>
        </div>
        <div className="ml-2 flex shrink-0 items-center gap-2">
          {isCompleted && <CheckCircle2 className="size-4 text-emerald-400" />}
          {isLocked && <Lock className="size-4 text-[#475569]" />}
          {!isLocked && <ArrowRight className={`size-4 transition-transform group-hover:translate-x-1 ${isCurrent ? "text-[#c084fc]" : "text-[#60a5fa]"}`} />}
        </div>
      </button>
      {isCurrent && <YouAreHereBadge className="absolute left-full ml-4 top-1/2 -translate-y-1/2 hidden md:flex" />}
    </div>
  );
}
