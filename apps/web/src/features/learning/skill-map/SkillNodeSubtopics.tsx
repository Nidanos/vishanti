import SkillSubtopicItem from "./SkillSubtopicItem";

type Props = {
  subtopics: string[];
  completedSubtopics: string[];
  isCurrentTopic: boolean;
  onSelectSubtopic: (subtopic: string) => void;
};

/** Inline dropdown list displaying subtopics beneath an expanded roadmap topic. */
export default function SkillNodeSubtopics({ subtopics, completedSubtopics, isCurrentTopic, onSelectSubtopic }: Props) {
  if (subtopics.length === 0) {
    return (
      <div className="mt-2.5 rounded-2xl border border-[#1e2a5e]/50 bg-[#090f2c]/80 p-4 text-xs text-[#94a3b8]">
        No subtopics available for this topic yet.
      </div>
    );
  }

  let foundCurrent = false;

  return (
    <div className="mt-2.5 space-y-2 rounded-2xl border border-[#1e2a5e]/70 bg-[#090f2c]/95 p-3 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      {subtopics.map((subtopic, index) => {
        const isCompleted = completedSubtopics.includes(subtopic);
        const isCurrent = isCurrentTopic && !isCompleted && !foundCurrent;
        if (isCurrent) foundCurrent = true;
        const isLocked = isCurrentTopic ? !isCompleted && !isCurrent : !isCompleted;

        return (
          <SkillSubtopicItem
            key={subtopic}
            subtopic={subtopic}
            index={index}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            isLocked={isLocked}
            onSelect={onSelectSubtopic}
          />
        );
      })}
    </div>
  );
}
