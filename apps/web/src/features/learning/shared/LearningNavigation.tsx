import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LearningScreen } from "../hooks/useCourseLearning";

type Props = {
  screen: LearningScreen;
  onBack: () => void;
  onGoToPractice?: () => void;
  onStartFirstSubtopic?: () => void;
};

/** Screen-level navigation controls for lesson and practice views. */
export default function LearningNavigation({
  screen,
  onBack,
  onStartFirstSubtopic,
}: Props) {
  if (screen === 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className="group inline-flex items-center gap-2 text-sm font-medium text-[#93c5fd] transition-colors hover:text-white"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      {screen === 2 && onStartFirstSubtopic && (
        <button
          type="button"
          onClick={onStartFirstSubtopic}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold transition hover:brightness-110"
        >
          <span>Start First Subtopic</span>
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
}
