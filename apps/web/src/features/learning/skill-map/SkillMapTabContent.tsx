import type { NextUpItem, SkillMapNode, SkillMapProgressStats } from "./types";
import SkillMapCard from "./SkillMapCard";
import ProgressSidebar from "./ProgressSidebar";

type Props = {
  courseTitle: string;
  nodes: SkillMapNode[];
  stats: SkillMapProgressStats;
  nextUp: NextUpItem;
  onSelectSubtopic: (subtopic: string) => void;
  onContinue: () => void;
};

/** Primary grid layout for the Skill Map tab matching Image 2. */
export default function SkillMapTabContent({
  courseTitle,
  nodes,
  stats,
  nextUp,
  onSelectSubtopic,
  onContinue,
}: Props) {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.55fr_1fr] xl:grid-cols-[1.65fr_1fr]">
      <SkillMapCard
        courseTitle={courseTitle}
        nodes={nodes}
        onSelectSubtopic={onSelectSubtopic}
      />
      <ProgressSidebar
        courseTitle={courseTitle}
        stats={stats}
        nextUp={nextUp}
        onContinue={onContinue}
      />
    </div>
  );
}
