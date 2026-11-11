"use client";

import { useRouter } from "next/navigation";
import { useActiveCourse } from "@/features/shell/useActiveCourse";
import CoursePracticeView from "./practice/CoursePracticeView";

// Dedicated practice screen matching Image 2 mock; works across all courses.
export default function PracticeScreen({ exerciseId }: { exerciseId?: string }) {
  const router = useRouter();
  const course = useActiveCourse();
  const topicName = course.topics[0]?.name ?? "Foundations";
  const subtopicName = course.topics[0]?.subtopics[0] ?? "Practice";

  return (
    <CoursePracticeView
      key={exerciseId ?? "recommended"}
      courseSlug={course.slug}
      courseTitle={course.title}
      topicName={topicName}
      subtopicName={subtopicName}
      initialExerciseId={exerciseId}
      onExit={() => router.push("/learn")}
    />
  );
}
