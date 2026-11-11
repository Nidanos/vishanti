import { useState } from "react";
import type { SkillMapNode } from "./types";
import SkillNodeCard from "./SkillNodeCard";
import SkillNodeConnector from "./SkillNodeConnector";

type Props = {
  nodes: SkillMapNode[];
  onSelectSubtopic: (subtopic: string) => void;
};

/** Connected roadmap nodes list managing inline subtopic dropdown expansion. */
export default function SkillNodeList({ nodes, onSelectSubtopic }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggle(nodeId: string) {
    setExpandedId((prev) => (prev === nodeId ? null : nodeId));
  }

  return (
    <div className="flex flex-col max-w-full md:max-w-[75%] lg:max-w-[78%]">
      {nodes.map((node, index) => {
        const nextNode = nodes[index + 1];
        return (
          <div key={node.id} className="flex flex-col">
            <SkillNodeCard
              node={node}
              isExpanded={expandedId === node.id}
              onToggle={() => handleToggle(node.id)}
              onSelectSubtopic={onSelectSubtopic}
            />
            {nextNode && (
              <SkillNodeConnector
                fromStatus={node.status}
                toStatus={nextNode.status}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
