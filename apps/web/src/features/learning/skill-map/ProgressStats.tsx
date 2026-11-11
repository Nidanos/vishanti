import { Hourglass, Zap } from "lucide-react";

type Props = {
  timeSpent: string;
  exercisesSolved: number;
};

/** Metric tiles for time spent and exercises completed matching Image 2. */
export default function ProgressStats({ timeSpent, exercisesSolved }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <div className="flex items-center gap-3.5 rounded-2xl border border-[#1e2a5e]/50 bg-[#12183c]/80 p-3.5 sm:p-4">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#1e2a5a]/60 text-[#60a5fa]">
          <Hourglass className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm sm:text-base font-bold text-white">{timeSpent}</p>
          <p className="truncate text-[11px] sm:text-xs text-[#94a3b8]">Time Spent</p>
        </div>
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-[#1e2a5e]/50 bg-[#12183c]/80 p-3.5 sm:p-4">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#3a2210]/60 text-[#fbbf24]">
          <Zap className="size-4.5 fill-[#fbbf24]/20" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm sm:text-base font-bold text-white">{exercisesSolved}</p>
          <p className="truncate text-[11px] sm:text-xs text-[#94a3b8]">Exercises Solved</p>
        </div>
      </div>
    </div>
  );
}
