export type ProblemTab = "problem" | "examples" | "constraints";

type Props = {
  activeTab: ProblemTab;
  onChange: (tab: ProblemTab) => void;
};

const TABS: Array<{ id: ProblemTab; label: string }> = [
  { id: "problem", label: "Problem" },
  { id: "examples", label: "Examples" },
  { id: "constraints", label: "Constraints" },
];

/** Sleek navigation bar for problem specification matching Image 2. */
export default function ProblemTabHeader({ activeTab, onChange }: Props) {
  return (
    <div className="border-b border-[#1e2958]/50 pb-2">
      <nav aria-label="Problem Details" className="flex space-x-6 sm:space-x-8">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative pb-2.5 text-xs sm:text-sm font-semibold transition-colors ${
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
