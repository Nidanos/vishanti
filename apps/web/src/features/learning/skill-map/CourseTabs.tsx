import type { SkillMapTab } from "./types";

type Props = {
  activeTab?: SkillMapTab;
  onChange?: (tab: SkillMapTab) => void;
  showSingleTab?: boolean;
};

const TABS: Array<{ id: SkillMapTab; label: string }> = [
  { id: "skill-map", label: "Skill Map" },
];

/** Course section tabs matching the sleek underline navigation in Image 2. */
export default function CourseTabs({
  activeTab = "skill-map",
  onChange,
  showSingleTab = false,
}: Props) {
  if (TABS.length <= 1 && !showSingleTab) {
    return null;
  }

  return (
    <div className="border-b border-[#1e2954]/50">
      <nav aria-label="Course Sections" className="-mb-px flex space-x-8">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange?.(tab.id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                isActive ? "text-white" : "text-[#94a3b8] hover:text-white"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] shadow-[0_0_12px_rgba(168,85,247,0.9)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
