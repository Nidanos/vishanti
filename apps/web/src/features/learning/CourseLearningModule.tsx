import type { CourseSlug } from "@ai-tutor/types";
import { getCourse } from "@/lib/courses";
import { useCourseLearning } from "./hooks/useCourseLearning";
import { useCourseProgress } from "./hooks/useCourseProgress";
import SkillMapMainView from "./skill-map/SkillMapMainView";
import LearningHeader from "./shared/LearningHeader";
import LearningNavigation from "./shared/LearningNavigation";
import SubtopicsList from "./shared/SubtopicsList";
import LessonTabView from "./shared/LessonTabView";

type Props = { courseSlug: CourseSlug; initialSubtopic?: string; onBack?: () => void };

/** One course-independent learning engine; only metadata varies between subjects. */
export default function CourseLearningModule({ courseSlug, initialSubtopic, onBack }: Props) {
  const course = getCourse(courseSlug);
  const learning = useCourseLearning(course.topics, onBack, initialSubtopic);
  const data = useCourseProgress(courseSlug);
  const topic = course.topics[learning.selectedTopic] ?? course.topics[0];
  const selectedSkill = data.progress?.skills.find((s) => s.skill.name === learning.selectedSubtopic);
  const cleared = new Set(data.progress?.skills.filter((s) => s.status === "cleared").map((s) => s.skill.name));
  const completed = course.topics.flatMap((group) => group.subtopics).filter((name) => cleared.has(name));

  return (
    <div className="mx-auto min-w-0 max-w-[1600px] space-y-6 pb-8 text-white">
      {learning.screen === 1 && (
        <SkillMapMainView
          courseSlug={courseSlug}
          topics={course.topics}
          resources={course.resources}
          progress={data.progress}
          onSelectSubtopic={learning.selectSubtopic}
          onStartLearning={(name) => learning.selectSubtopic(name || course.topics[0]?.subtopics[0] || "")}
        />
      )}
      {learning.screen > 1 && learning.tab !== "practice" && (
        <>
          <LearningHeader
            screen={learning.screen} topicName={topic.name} topicDescription={topic.description}
            selectedSubtopic={learning.selectedSubtopic} courseTitle={course.shortTitle}
          />
          <LearningNavigation
            screen={learning.screen} onBack={learning.goBack}
            onStartFirstSubtopic={() => learning.selectSubtopic(topic.subtopics[0] ?? "")}
          />
        </>
      )}
      {learning.screen === 2 && (
        <SubtopicsList topicName={topic.name} subtopics={topic.subtopics} completed={completed} onOpenSubtopic={learning.selectSubtopic} />
      )}
      {learning.screen === 3 && (
        <LessonTabView
          tab={learning.tab} onChangeTab={learning.setTab} selectedSkill={selectedSkill}
          selectedSubtopic={learning.selectedSubtopic} topicName={topic.name} courseTitle={course.title}
          error={data.error} loading={data.loading} onRetry={data.retry} resources={course.resources}
          courseSlug={courseSlug}
        />
      )}
    </div>
  );
}
