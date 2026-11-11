// Shared types for the reusable Skill Map component layout.
// Designed to be domain-agnostic: works for C++, DSA, JS, Python, etc.

export type SkillMapStatus = "completed" | "current" | "locked";

export type SkillMapNode = {
  id: string;
  number: number;
  title: string;
  description: string;
  status: SkillMapStatus;
  subtopicsCount: number;
  completedCount: number;
  firstSubtopic?: string;
  subtopics: string[];
  completedSubtopics: string[];
};

export type SkillMapTab = "skill-map" | "resources" | "projects" | "notes";

export type SkillMapProgressStats = {
  completedTopics: number;
  totalTopics: number;
  percentage: number;
  timeSpentFormatted: string;
  exercisesSolved: number;
};

export type NextUpItem = {
  title: string;
  description: string;
  subtopicName?: string;
  topicIndex: number;
};
