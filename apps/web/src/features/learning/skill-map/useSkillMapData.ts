import { useMemo } from "react";
import type { ProgressResponse } from "@ai-tutor/types";
import type { CourseTopicGroup } from "@/lib/courses";
import type { NextUpItem, SkillMapNode, SkillMapProgressStats } from "./types";

/** Derives generic skill map nodes, progress, and next up item matching Image 2. */
export function useSkillMapData(topics: CourseTopicGroup[], progress: ProgressResponse | null) {
  const clearedSet = useMemo(
    () => new Set(progress?.skills.filter((s) => s.status === "cleared").map((s) => s.skill.name) ?? []),
    [progress],
  );

  const { nodes, nextUp, stats } = useMemo(() => {
    let currentAssigned = false;
    let nextItem: NextUpItem | null = null;
    let totalCompletedSubtopics = 0;
    const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);

    const calculatedNodes: SkillMapNode[] = topics.map((topic, index) => {
      const completedCount = topic.subtopics.filter((sub) => clearedSet.has(sub)).length;
      totalCompletedSubtopics += completedCount;
      const isComplete = completedCount === topic.subtopics.length && topic.subtopics.length > 0;

      let status: SkillMapNode["status"] = "locked";
      if (isComplete) {
        status = "completed";
      } else if (!currentAssigned) {
        status = "current";
        currentAssigned = true;
        const firstUnfinished = topic.subtopics.find((s) => !clearedSet.has(s)) ?? topic.subtopics[0];
        nextItem = { title: topic.name, description: `Learn how to write and use ${topic.name.toLowerCase()} in practice.`, subtopicName: firstUnfinished, topicIndex: index };
      }

      const summary = topic.subtopics.length > 0 ? topic.subtopics.slice(0, 3).join(", ") : topic.description;

      return {
        id: `topic-${index}`,
        number: index + 1,
        title: topic.name,
        description: summary,
        status,
        subtopicsCount: topic.subtopics.length,
        completedCount,
        firstSubtopic: topic.subtopics[0],
        subtopics: topic.subtopics,
        completedSubtopics: topic.subtopics.filter((s) => clearedSet.has(s)),
      };
    });

    const completedTopics = calculatedNodes.filter((n) => n.status === "completed").length;
    const percentage = totalSubtopics > 0 ? Math.round((totalCompletedSubtopics / totalSubtopics) * 100) : 0;
    const stats: SkillMapProgressStats = {
      completedTopics,
      totalTopics: topics.length,
      percentage,
      timeSpentFormatted: `${Math.max(1, Math.round(totalCompletedSubtopics * 0.4))}h ${Math.round((totalCompletedSubtopics * 17) % 60)}m`,
      exercisesSolved: Math.max(totalCompletedSubtopics * 2, totalCompletedSubtopics),
    };

    const fallbackNext: NextUpItem = { title: topics[0]?.name ?? "Basics", description: "Start learning step by step.", topicIndex: 0 };
    return { nodes: calculatedNodes, nextUp: nextItem ?? fallbackNext, stats };
  }, [topics, clearedSet]);

  return { nodes, nextUp, stats };
}
