import Markdown from "@/components/ui/Markdown";
import type { Exercise } from "@ai-tutor/types";
import type { ProblemTab } from "./ProblemTabHeader";
import ProblemSampleOutput from "./ProblemSampleOutput";
import ProblemTipCard from "./ProblemTipCard";

type Props = {
  activeTab: ProblemTab;
  exercise: Exercise | null;
};

/** Detail view switching between Problem description, Examples, and Constraints. */
export default function ProblemView({ activeTab, exercise }: Props) {
  if (activeTab === "examples") {
    return (
      <div className="mt-4 space-y-3">
        {exercise?.sampleTests.length ? (
          exercise.sampleTests.map((t) => (
            <div key={t.seq} className="rounded-xl border border-[#1e2a5e]/50 bg-[#090f2b] p-3 text-xs font-mono">
              <p className="font-semibold text-white">{t.name}</p>
              {t.input !== null && <p className="mt-1 text-[#93c5fd]">Input: {t.input}</p>}
              {t.expectedOutput !== null && <p className="mt-0.5 text-emerald-300">Expected: {t.expectedOutput}</p>}
            </div>
          ))
        ) : (
          <p className="text-xs text-[#94a3b8]">Run standard inputs to see sample behavior.</p>
        )}
      </div>
    );
  }

  if (activeTab === "constraints") {
    return (
      <div className="mt-4 space-y-2.5 text-xs text-[#cbd5e1]">
        <div className="rounded-xl border border-[#1e2a5e]/40 bg-[#0c1334]/60 p-3">
          <p className="font-semibold text-white">Execution Time Limit: <span className="text-[#38bdf8]">1000 ms</span></p>
        </div>
        <div className="rounded-xl border border-[#1e2a5e]/40 bg-[#0c1334]/60 p-3">
          <p className="font-semibold text-white">Memory Overhead Limit: <span className="text-[#a855f7]">256 MB</span></p>
        </div>
        <div className="rounded-xl border border-[#1e2a5e]/40 bg-[#0c1334]/60 p-3">
          <p className="font-semibold text-white">Standard: <span className="text-emerald-400">Strict idiomatic syntax</span></p>
        </div>
      </div>
    );
  }

  const firstTest = exercise?.sampleTests[0];

  return (
    <div className="mt-4 flex flex-1 flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-white">{exercise?.title ?? "Practice Challenge"}</h3>
        <div className="mt-2 text-xs leading-relaxed text-[#cbd5e1]">
          {exercise ? <Markdown text={exercise.promptMd} className="text-xs leading-relaxed text-[#cbd5e1]" /> : <p>Loading exercise challenge details…</p>}
        </div>
        <ProblemSampleOutput sampleInput={firstTest?.input} expectedOutput={firstTest?.expectedOutput} />
      </div>
      <ProblemTipCard tipText={exercise?.skill.description} />
    </div>
  );
}
