import type { SkillMapProgressStats } from "./types";
import ProgressRing from "./ProgressRing";
import ProgressStats from "./ProgressStats";

type Props = {
  courseTitle: string;
  stats: SkillMapProgressStats;
};

/** Summary card showing overall course completion percentage and metrics matching Image 2. */
export default function YourProgressCard({ courseTitle, stats }: Props) {
  return (
    <section className="rounded-3xl border border-[#1e2958]/60 bg-[#0d1435]/70 p-6 sm:p-7 backdrop-blur-xl shadow-xl">
      <h2 className="text-base font-bold text-white tracking-wide">Your Progress</h2>

      <div className="my-6 sm:my-7 flex flex-col items-center text-center">
        <ProgressRing percentage={stats.percentage} />
        <h3 className="mt-3 text-base sm:text-lg font-bold text-white">{courseTitle}</h3>
        <p className="mt-0.5 text-xs sm:text-sm text-[#94a3b8]">
          {stats.completedTopics} of {stats.totalTopics} topics completed
        </p>
      </div>

      <ProgressStats
        timeSpent={stats.timeSpentFormatted}
        exercisesSolved={stats.exercisesSolved}
      />
    </section>
  );
}
