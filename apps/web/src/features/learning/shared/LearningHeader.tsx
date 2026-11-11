
import type { LearningScreen } from "../hooks/useCourseLearning";

type Props = {
  screen: LearningScreen;
  topicName: string;
  topicDescription: string;
  selectedSubtopic: string;
  courseTitle: string;
  onBack?: () => void;
};

export default function LearningHeader({
  screen,
  topicName,
  topicDescription,
  selectedSubtopic,
  courseTitle,
}: Props) {
  const title =
    screen === 1
      ? `${courseTitle} Learning Path`
      : screen === 2
        ? topicName
        : selectedSubtopic;

  const description =
    screen === 1
      ? `Build your ${courseTitle} skills step by step.`
      : screen === 2
        ? topicDescription
        : "Explore the concepts, review examples, and practise your skills.";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-blue-300">
          Learn / {courseTitle}{screen > 1 ? ` / ${topicName}` : ""}
          {screen > 2 ? ` / ${selectedSubtopic}` : ""}
        </p>

        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 text-blue-200">{description}</p>
      </div>
    </div>
  );
}
