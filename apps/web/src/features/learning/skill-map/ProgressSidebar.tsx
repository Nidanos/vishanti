import type { NextUpItem, SkillMapProgressStats } from "./types";
import YourProgressCard from "./YourProgressCard";
import NextUpCard from "./NextUpCard";
import MotivationalQuoteCard from "./MotivationalQuoteCard";

type Props = {
  courseTitle: string;
  stats: SkillMapProgressStats;
  nextUp: NextUpItem;
  onContinue: () => void;
};

/** Right sidebar holding progress overview, next up action, and inspiration. */
export default function ProgressSidebar({ courseTitle, stats, nextUp, onContinue }: Props) {
  return (
    <aside className="flex h-full flex-col justify-between gap-6">
      <YourProgressCard courseTitle={courseTitle} stats={stats} />
      <NextUpCard item={nextUp} onContinue={onContinue} />
      <MotivationalQuoteCard />
    </aside>
  );
}
