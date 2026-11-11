import type { ProgressResponse } from "@ai-tutor/types";
import { getCourse, type CourseTopicGroup } from "@/lib/courses";
import type { CourseSlug } from "@ai-tutor/types";
import type { SkillMapNode } from "./types";
import { useSkillMapData } from "./useSkillMapData";
import CourseHeader from "./CourseHeader";
import CourseTabs from "./CourseTabs";
import SkillMapTabContent from "./SkillMapTabContent";

type Props = {
  courseSlug: CourseSlug;
  topics: CourseTopicGroup[];
  resources?: Array<{ title: string; description: string; url: string }>;
  progress: ProgressResponse | null;
  onOpenTopic?: (topicIndex: number) => void;
  onSelectSubtopic: (subtopic: string) => void;
  onStartLearning: (subtopicName?: string) => void;
};

/** Reusable top-level view implementing the visual Skill Map layout from Image 2. */
export default function SkillMapMainView({
  courseSlug,
  topics,
  progress,
  onSelectSubtopic,
  onStartLearning,
}: Props) {
  const course = getCourse(courseSlug);
  const { nodes, nextUp, stats } = useSkillMapData(topics, progress);

  return (
    <div className="space-y-6">
      <CourseHeader
        courseTitle={course.title}
        tagline={course.tagline ?? "Build the foundation. One concept at a time."}
        level={course.level ?? "Beginner Friendly"}
        badgeText={course.badgeText ?? "Master skills step by step with a structured learning path."}
        badgeCode={course.badgeCode ?? "C++"}
      />

      <CourseTabs />

      <SkillMapTabContent
        courseTitle={course.shortTitle}
        nodes={nodes}
        stats={stats}
        nextUp={nextUp}
        onSelectSubtopic={onSelectSubtopic}
        onContinue={() => onStartLearning(nextUp.subtopicName)}
      />
    </div>
  );
}
