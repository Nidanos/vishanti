import { BarChart2, ChevronRight, X } from "lucide-react";
import PracticeAnnotation from "./PracticeAnnotation";

type Props = {
  courseTitle: string;
  topicName: string;
  subtopicName: string;
  exerciseTitle?: string;
  promptSummary?: string;
  level?: number;
  totalLevels?: number;
  onExit: () => void;
};

/** Dedicated practice header with breadcrumbs, level meter, and exit button matching Image 2. */
export default function PracticeHeader({
  courseTitle,
  topicName,
  subtopicName,
  exerciseTitle,
  promptSummary,
  level = 2,
  totalLevels = 5,
  onExit,
}: Props) {
  const percentage = Math.min(100, Math.max(10, Math.round((level / totalLevels) * 100)));

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
          <span>Learn</span><ChevronRight size={13} className="text-[#475569]" />
          <span>{courseTitle}</span><ChevronRight size={13} className="text-[#475569]" />
          <span>{topicName}</span><ChevronRight size={13} className="text-[#475569]" />
          <span className="font-medium text-[#60a5fa]">Practice</span>
        </nav>

        <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          {courseTitle} {topicName}
        </h1>
        <h2 className="mt-1 text-base sm:text-lg font-bold text-white">{exerciseTitle ?? subtopicName}</h2>
        <p className="mt-0.5 text-xs text-[#94a3b8]">{promptSummary ?? "Write code to solve the challenge step by step."}</p>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2563eb]/30 bg-[#162054]/80 px-3 py-1 text-xs font-medium text-[#93c5fd]">
            <BarChart2 className="size-3.5 text-[#38bdf8]" /> Beginner Friendly
          </span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-semibold text-white">{level} / {totalLevels}</span>
            <div className="h-1.5 w-24 rounded-full bg-[#131b40]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] shadow-[0_0_10px_rgba(168,85,247,0.8)]" style={{ width: `${percentage}%` }} />
            </div>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-xl border border-[#253570] bg-[#12183c]/70 px-3.5 py-2 text-xs font-semibold text-[#cbd5e1] hover:border-[#a855f7] hover:text-white transition-colors"
          >
            <X size={14} /> Exit Practice
          </button>
        </div>
        <PracticeAnnotation />
      </div>
    </header>
  );
}
