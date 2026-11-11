import { ChevronDown, Code } from "lucide-react";
import type { CourseSlug } from "@ai-tutor/types";

type Props = {
  courseSlug: CourseSlug;
  isPrediction?: boolean;
};

/** Header bar for code editor with dynamic language indicator matching Image 2. */
export default function EditorHeader({ courseSlug, isPrediction }: Props) {
  const isCpp = courseSlug === "cpp-basics";
  const badgeText = isCpp ? "C++" : "DSA";
  const labelText = isPrediction ? "Predicted Output" : isCpp ? "C++20" : "Algorithms";
  const badgeBg = isCpp ? "bg-[#2563eb] text-white" : "bg-purple-600 text-white";

  return (
    <div className="flex items-center justify-between border-b border-[#1e2958]/50 pb-3">
      <div className="flex items-center gap-2">
        <div className="grid size-7 place-items-center rounded-lg bg-[#201848] text-[#c084fc] shadow-[0_0_10px_rgba(192,132,252,0.3)]">
          <Code size={16} />
        </div>
        <h3 className="text-sm font-bold text-white">Code Editor</h3>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-[#253570] bg-[#12183c]/80 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold ${badgeBg}`}>
          {badgeText}
        </span>
        <span>{labelText}</span>
        <ChevronDown size={13} className="text-[#94a3b8]" />
      </div>
    </div>
  );
}
