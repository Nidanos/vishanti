import { ChevronRight } from "lucide-react";
import type { SkillMapNode } from "./types";
import SkillNodeStatusIcon from "./SkillNodeStatusIcon";
import SkillNodeSubtopics from "./SkillNodeSubtopics";
import YouAreHereBadge from "./YouAreHereBadge";

type Props = {
  node: SkillMapNode;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectSubtopic: (subtopic: string) => void;
};

/** Interactive card for a roadmap node with access control and inline subtopics. */
export default function SkillNodeCard({ node, isExpanded, onToggle, onSelectSubtopic }: Props) {
  const isCurrent = node.status === "current";
  const isCompleted = node.status === "completed";
  const isLocked = node.status === "locked";

  const containerClasses = isCurrent
    ? "relative border-2 border-[#a855f7] bg-gradient-to-r from-[#20104a]/70 via-[#151c4a]/60 to-[#1e1044]/60 shadow-[0_0_28px_rgba(168,85,247,0.38)] hover:border-[#c084fc]"
    : isCompleted
      ? "border border-[#1e2d6b]/50 bg-[#141b45]/70 hover:border-[#2563eb]/60 hover:bg-[#192256]/85"
      : "border border-[#19234e]/50 bg-[#0c1232]/50 opacity-60 cursor-not-allowed";

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={isLocked}
        onClick={isLocked ? undefined : onToggle}
        className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all ${containerClasses}`}
      >
        <SkillNodeStatusIcon status={node.status} />

        <div className="min-w-0 flex-1">
          <span className={`block font-semibold ${isCurrent ? "text-white font-bold" : isCompleted ? "text-white" : "text-[#94a3b8]"}`}>
            {node.number}. {node.title}
          </span>
          <p className={`mt-0.5 truncate text-xs sm:text-sm ${isCurrent ? "text-[#c4b5fd]" : isCompleted ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
            {isLocked ? "Complete previous topics to unlock" : node.description}
          </p>
        </div>

        {!isLocked && (
          <ChevronRight
            className={`size-5 shrink-0 transition-transform duration-200 ${
              isExpanded ? "rotate-90 text-[#a855f7]" : "group-hover:translate-x-1"
            } ${isCurrent ? "text-[#c084fc]" : "text-[#60a5fa]"}`}
          />
        )}
      </button>

      {isCurrent && !isExpanded && <YouAreHereBadge />}

      {isExpanded && !isLocked && (
        <SkillNodeSubtopics
          subtopics={node.subtopics}
          completedSubtopics={node.completedSubtopics}
          isCurrentTopic={isCurrent}
          onSelectSubtopic={onSelectSubtopic}
        />
      )}
    </div>
  );
}
