import { Send, Sparkles } from "lucide-react";
import type { Attempt } from "@ai-tutor/types";
import type { PracticeView } from "./practice.types";

type Props = {
  attempt: Attempt | null;
  view: PracticeView;
  hintLoading: boolean;
  canSubmit: boolean;
  onHint: () => void;
  onSubmit: () => void;
};

/** Action controls for requesting hints and submitting answers matching Image 2. */
export default function PracticeActions({ attempt, view, hintLoading, canSubmit, onHint, onSubmit }: Props) {
  const hintBlocked = !attempt || attempt.status !== "active" || hintLoading || view === "submitting" || view === "pending" || attempt.hintLevel >= attempt.hintCeiling;

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 pt-2">
      <button
        type="button"
        onClick={onHint}
        disabled={hintBlocked}
        className="flex items-center justify-center gap-2 rounded-2xl border border-[#253570] bg-[#12183c]/80 py-3.5 px-4 text-xs sm:text-sm font-semibold text-[#c084fc] shadow-md transition-all hover:border-[#a855f7] hover:bg-[#18204e] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Sparkles size={15} />
        <span>{hintLoading ? "Getting hint…" : "Need a Hint"}</span>
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#9333ea] py-3.5 px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] transition-all hover:opacity-95 hover:shadow-[0_4px_25px_rgba(147,51,234,0.55)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={14} />
        <span>{view === "submitting" ? "Testing…" : "Submit"}</span>
      </button>
    </div>
  );
}
