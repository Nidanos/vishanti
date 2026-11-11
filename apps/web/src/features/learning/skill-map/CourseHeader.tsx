import { Signal } from "lucide-react";
import CourseBadgeLogo from "./CourseBadgeLogo";

type Props = {
  courseTitle: string;
  tagline: string;
  level: string;
  badgeText: string;
  badgeCode: string;
};

/** Hero header with centered badge cluster and inward shifted 3D logo matching Image 2. */
export default function CourseHeader({ courseTitle, tagline, level, badgeText, badgeCode }: Props) {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center pt-2 pb-1 pr-2 sm:pr-6 lg:pr-10 xl:pr-16">
      {/* Left: Course title & tagline */}
      <div className="space-y-1.5 min-w-0 lg:max-w-[42%]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#94a3b8]">
          <span>Learn</span>
          <span className="text-[#3b82f6] font-semibold">&gt;</span>
          <span className="text-[#60a5fa] font-medium">{courseTitle}</span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-[#67e8f9] via-[#c7d2fe] to-[#e879f9] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(168,85,247,0.35)]">
            {courseTitle}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#94a3b8]">{tagline}</p>
      </div>

      {/* Center: Info cluster with pill & description shifted towards centre */}
      <div className="hidden sm:flex flex-col items-start text-left lg:mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/40 bg-[#1e295a]/90 px-3.5 py-1 text-xs font-semibold text-[#93c5fd] shadow-sm backdrop-blur">
          <Signal className="size-3.5 text-[#38bdf8]" />
          <span>{level}</span>
        </div>
        <p className="mt-2.5 max-w-[270px] text-xs text-[#94a3b8] leading-relaxed text-left">
          {badgeText}
        </p>
      </div>

      {/* Right: 3D logo shifted inward towards left */}
      <div className="shrink-0 self-start lg:self-center">
        <CourseBadgeLogo code={badgeCode} />
      </div>
    </header>
  );
}
