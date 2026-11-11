import { Lightbulb } from "lucide-react";

type Props = {
  tipText?: string | null;
};

/** Pro tip callout card at the bottom of the problem panel matching Image 2. */
export default function ProblemTipCard({ tipText }: Props) {
  const content = tipText?.trim() || "Focus on writing clean, modular code with descriptive variable names and edge-case awareness.";

  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#253570]/40 bg-[#12183c]/60 p-4 shadow-lg">
      <Lightbulb className="size-5 shrink-0 text-amber-400 fill-amber-400/20" />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Tip</h4>
        <p className="mt-1 text-xs leading-relaxed text-[#cbd5e1]">{content}</p>
      </div>
    </div>
  );
}
