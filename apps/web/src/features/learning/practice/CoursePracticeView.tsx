import type { CourseSlug } from "@ai-tutor/types";
import PracticeHeader from "./PracticeHeader";
import ProblemCard from "./ProblemCard";
import EditorCard from "./EditorCard";
import { useExerciseLoader } from "./useExerciseLoader";
import { useSubmissionFlow } from "./useSubmissionFlow";
import { useHintFlow } from "./useHintFlow";

type Props = {
  courseSlug: CourseSlug;
  courseTitle: string;
  topicName: string;
  subtopicName: string;
  initialExerciseId?: string;
  onExit: () => void;
};

/** Full two-column practice experience exactly matching Image 2 mock. */
export default function CoursePracticeView({
  courseSlug, courseTitle, topicName, subtopicName, initialExerciseId, onExit,
}: Props) {
  const loader = useExerciseLoader(courseSlug, initialExerciseId);
  const sub = useSubmissionFlow();
  const hint = useHintFlow();
  const attempt = loader.attempt;
  const disabled = sub.view === "submitting" || sub.view === "pending" || attempt?.status !== "active";
  const canSubmit = Boolean(loader.exercise && attempt?.status === "active" && loader.answer.trim() && !disabled && !sub.result);

  const loadNext = async () => { sub.resetForNext(); hint.clear(); await loader.load(); };
  const getHint = () => hint.getHint(loader.exercise, attempt, loader.answer, disabled, sub.setError, (lvl) => loader.setAttempt((o) => o ? { ...o, hintLevel: lvl } : o));
  const tryAgain = () => { sub.setResult(null); sub.setError(""); sub.setView("ready"); };
  const feedback = {
    error: loader.error || sub.error, result: sub.result, retryRequest: Boolean(sub.retryRequest), pendingId: Boolean(sub.pendingId),
    onRetry: () => void sub.retry(), onCheck: sub.checkAgain, onReload: () => void loadNext(), onTryAgain: tryAgain,
  };

  return (
    <div className="space-y-6">
      <PracticeHeader
        courseTitle={courseTitle}
        topicName={topicName}
        subtopicName={subtopicName}
        exerciseTitle={loader.exercise?.title}
        promptSummary={loader.exercise?.skill.description ?? undefined}
        level={loader.exercise?.rung ?? 2}
        totalLevels={5}
        onExit={onExit}
      />

      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.15fr] xl:grid-cols-[1fr_1.2fr]">
        <ProblemCard exercise={loader.exercise} />
        <EditorCard
          courseSlug={courseSlug}
          exercise={loader.exercise}
          answer={loader.answer}
          setAnswer={loader.setAnswer}
          disabled={disabled}
          attempt={attempt}
          view={loader.loading ? "loading" : sub.view}
          hintLoading={hint.loading}
          canSubmit={canSubmit}
          onHint={() => void getHint()}
          onSubmit={() => void sub.submit(attempt, loader.answer)}
          feedback={feedback}
        />
      </div>
    </div>
  );
}
