// Circular SVG progress ring with vibrant cyan-indigo gradient matching Image 2.
export default function ProgressRing({ percentage }: { percentage: number }) {
  const size = 156;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex size-44 sm:size-48 items-center justify-center">
      <svg className="size-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#141d3b"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Dynamic progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
