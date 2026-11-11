import type { SkillMapNode } from "./types";
import SkillMapLegend from "./SkillMapLegend";
import SkillNodeList from "./SkillNodeList";

type Props = {
  courseTitle: string;
  nodes: SkillMapNode[];
  onSelectSubtopic: (subtopic: string) => void;
};

/** Primary card container hosting the roadmap path and status legend. */
export default function SkillMapCard({ courseTitle, nodes, onSelectSubtopic }: Props) {
  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-[#1e2958]/60 bg-[#0d1435]/70 p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
      <div>
        <div className="flex flex-col gap-4 border-b border-[#1e2958]/50 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Skill Map</h2>
            <p className="mt-1 text-xs text-[#94a3b8]">
              Your learning path for {courseTitle}
            </p>
          </div>

          <SkillMapLegend />
        </div>

        <div className="mt-6">
          <SkillNodeList nodes={nodes} onSelectSubtopic={onSelectSubtopic} />
        </div>
      </div>
    </section>
  );
}
