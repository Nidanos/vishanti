import type { CourseSlug, ProgressResponse } from "@ai-tutor/types";
import type { LearningTab } from "../hooks/useCourseLearning";
import LessonTabs from "./LessonTabs";
import LessonContent from "./LessonContent";
import ResourcesTab from "./ResourcesTab";
import CoursePracticeView from "../practice/CoursePracticeView";

type SkillItem = ProgressResponse["skills"][number];
type Props = {
  tab: LearningTab;
  onChangeTab: (tab: LearningTab) => void;
  selectedSkill?: SkillItem;
  selectedSubtopic: string;
  topicName: string;
  courseTitle: string;
  error: string | null;
  loading: boolean;
  onRetry: () => void;
  resources: Array<{ title: string; description: string; url: string }>;
  courseSlug: CourseSlug;
};

/** Container hosting lesson markdown, external resources, and code practice tabs. */
export default function LessonTabView(props: Props) {
  const { tab, onChangeTab, selectedSkill, selectedSubtopic, topicName, courseTitle, error, loading, onRetry, resources, courseSlug } = props;

  if (tab === "practice") {
    return (
      <CoursePracticeView
        courseSlug={courseSlug}
        courseTitle={courseTitle}
        topicName={topicName}
        subtopicName={selectedSubtopic}
        onExit={() => onChangeTab("lesson")}
      />
    );
  }

  return (
    <>
      <LessonTabs activeTab={tab} onChange={onChangeTab} />
      {tab === "lesson" && (
        <LessonContent
          skill={selectedSkill} skillName={selectedSubtopic} error={error ?? ""}
          loading={loading} onRetry={onRetry} onPractice={() => onChangeTab("practice")}
        />
      )}
      {tab === "resources" && (
        <ResourcesTab selectedSubtopic={selectedSubtopic} resources={resources} onContinue={() => onChangeTab("practice")} />
      )}
    </>
  );
}
