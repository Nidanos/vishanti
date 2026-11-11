// Motivational quote card matching the bottom sidebar design mock in Image 2.
export default function MotivationalQuoteCard() {
  return (
    <section className="flex flex-1 flex-col justify-between rounded-3xl border border-[#1e2958]/60 bg-[#0d1435]/70 p-6 sm:p-7 backdrop-blur-xl shadow-xl min-h-[150px]">
      <div>
        <span className="select-none font-serif text-3xl sm:text-4xl font-black leading-none text-[#c084fc] drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]">
          &ldquo;&ldquo;
        </span>

        <p className="mt-2.5 text-sm sm:text-base font-medium leading-relaxed text-[#cbd5e1]">
          A little progress every day adds up to big results.
        </p>
      </div>

      <div className="mt-5 h-[2.5px] w-7 rounded-full bg-[#6366f1]" />
    </section>
  );
}
