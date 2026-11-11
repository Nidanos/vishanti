import { Check, Lock } from "lucide-react";
import type { SkillMapStatus } from "./types";

/** Circular status indicator icon for a roadmap node matching Image 2. */
export default function SkillNodeStatusIcon({ status }: { status: SkillMapStatus }) {
  if (status === "completed") {
    return (
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white shadow-[0_0_16px_rgba(37,99,235,0.6)]">
        <Check className="size-5 stroke-[3]" />
      </div>
    );
  }

  if (status === "current") {
    return (
      <div className="relative grid size-10 shrink-0 place-items-center rounded-full border-2 border-[#a855f7] bg-[#220d48] shadow-[0_0_20px_rgba(168,85,247,0.8)]">
        <span className="size-3.5 rounded-full bg-[#e9d5ff] shadow-[0_0_10px_rgba(233,213,255,1)]" />
      </div>
    );
  }

  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-full border border-[#222f60] bg-[#131b3e] text-[#64748b]">
      <Lock className="size-4" />
    </div>
  );
}
