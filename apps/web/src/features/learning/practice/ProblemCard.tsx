import { useState } from "react";
import type { Exercise } from "@ai-tutor/types";
import ProblemTabHeader, { type ProblemTab } from "./ProblemTabHeader";
import ProblemView from "./ProblemView";

type Props = {
  exercise: Exercise | null;
};

/** Left card container hosting problem specifications matching Image 2. */
export default function ProblemCard({ exercise }: Props) {
  const [activeTab, setActiveTab] = useState<ProblemTab>("problem");

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-[#1e2958]/60 bg-[#0d1435]/70 p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
      <ProblemTabHeader activeTab={activeTab} onChange={setActiveTab} />
      <ProblemView activeTab={activeTab} exercise={exercise} />
    </section>
  );
}
