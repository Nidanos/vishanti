import CodeEditor from "@/components/editor/CodeEditor";
import type { Attempt, CourseSlug, Exercise } from "@ai-tutor/types";
import type { FeedbackProps, PracticeView } from "./practice.types";
import EditorHeader from "./EditorHeader";
import PracticeActions from "./PracticeActions";
import PracticeFeedback from "./PracticeFeedback";

type Props = {
  courseSlug: CourseSlug;
  exercise: Exercise | null;
  answer: string;
  setAnswer: (val: string) => void;
  disabled: boolean;
  attempt: Attempt | null;
  view: PracticeView;
  hintLoading: boolean;
  canSubmit: boolean;
  onHint: () => void;
  onSubmit: () => void;
  feedback: FeedbackProps;
};

/** Right card container hosting code editor, actions, and test results matching Image 2. */
export default function EditorCard({
  courseSlug, exercise, answer, setAnswer, disabled, attempt, view, hintLoading, canSubmit, onHint, onSubmit, feedback,
}: Props) {
  const prediction = exercise?.rung === 1;

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-[#1e2958]/60 bg-[#0d1435]/70 p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
      <div>
        <EditorHeader courseSlug={courseSlug} isPrediction={prediction} />

        <div className="mt-4 overflow-hidden rounded-2xl border border-[#1e2a5e]/50 bg-[#090f2b] shadow-inner">
          {prediction ? (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={disabled}
              placeholder="Type the predicted output…"
              className="min-h-56 w-full resize-y bg-[#090f2b] p-4 font-mono text-xs text-white outline-none"
            />
          ) : (
            <CodeEditor height="360px" value={answer} onChange={setAnswer} readOnly={disabled} />
          )}
        </div>

        <p className="mt-2 text-right text-[11px] text-[#94a3b8]">Write your code above</p>

        <PracticeFeedback
          view={view}
          error={feedback.error}
          result={feedback.result}
          retryRequest={feedback.retryRequest}
          pendingId={feedback.pendingId}
          onRetry={feedback.onRetry}
          onCheck={feedback.onCheck}
          onReload={feedback.onReload}
          onTryAgain={feedback.onTryAgain}
        />
      </div>

      <PracticeActions attempt={attempt} view={view} hintLoading={hintLoading} canSubmit={canSubmit} onHint={onHint} onSubmit={onSubmit} />
    </section>
  );
}
