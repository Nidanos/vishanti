import type { SkillMapStatus } from "./types";

type Props = {
  fromStatus: SkillMapStatus;
  toStatus: SkillMapStatus;
};

/** Vertical connecting line between consecutive roadmap nodes matching Image 2. */
export default function SkillNodeConnector({ fromStatus, toStatus }: Props) {
  const isSolid = (fromStatus === "completed" && toStatus === "completed") || toStatus === "current";

  return (
    <div className="flex w-10 shrink-0 justify-center py-1">
      {isSolid ? (
        <div className="h-7 w-[2.5px] rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      ) : (
        <div className="h-7 w-0 border-l-2 border-dashed border-[#253366]" />
      )}
    </div>
  );
}
