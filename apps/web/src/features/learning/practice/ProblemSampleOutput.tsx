import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  sampleText?: string;
  sampleInput?: string | null;
  expectedOutput?: string | null;
};

/** Sample input/output preview card with one-click copy matching Image 2. */
export default function ProblemSampleOutput({ sampleText, sampleInput, expectedOutput }: Props) {
  const [copied, setCopied] = useState(false);
  const snippet = sampleText ?? (expectedOutput ? `${sampleInput ? `// Input: ${sampleInput}\n` : ""}// Output:\n${expectedOutput}` : "// Output: Correct result expected");

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between pb-1.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Sample Output</h4>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-[#94a3b8] hover:text-white transition-colors"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="relative rounded-xl border border-[#1e2a5e]/50 bg-[#090f2b] p-3.5 font-mono text-xs text-[#93c5fd]">
        <pre className="whitespace-pre-wrap leading-relaxed">{snippet}</pre>
      </div>
    </div>
  );
}
