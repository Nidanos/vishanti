import { ArrowRight, Code2 } from "lucide-react";
import type { NextUpItem } from "./types";

type Props = {
  item: NextUpItem;
  onContinue: () => void;
};

/** Action card pointing the learner to their next recommended lesson matching Image 2. */
export default function NextUpCard({ item, onContinue }: Props) {
  return (
    <section className="rounded-3xl border border-[#1e2958]/60 bg-[#0d1435]/70 p-6 sm:p-7 backdrop-blur-xl shadow-xl">
      <h2 className="text-base font-bold text-white tracking-wide">Next Up</h2>

      <div className="mt-5 flex items-start gap-4 rounded-2xl border border-[#1e2a5e]/50 bg-[#12183c]/80 p-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#6366f1]/30 bg-[#201848] text-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.25)]">
          <Code2 className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white text-sm sm:text-base">{item.title}</h3>
          <p className="mt-1 text-xs sm:text-sm text-[#94a3b8] line-clamp-2 leading-relaxed">{item.description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#9333ea] py-4 px-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] transition-all hover:opacity-95 hover:shadow-[0_4px_25px_rgba(147,51,234,0.55)] active:scale-[0.99]"
      >
        <span>Continue Learning</span>
        <ArrowRight className="size-4" />
      </button>
    </section>
  );
}
