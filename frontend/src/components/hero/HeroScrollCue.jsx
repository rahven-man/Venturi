// Bottom-right scroll cue. A ring with a dot drifting downward reads
// universally as "scroll" without needing an icon library. The "01 / 05"
// label is a minimal progress marker for the future 5-section homepage.

export default function HeroScrollCue() {
  return (
    <div
      data-anim="scroll-cue"
      className="absolute bottom-10 right-8 md:right-14 z-20 flex flex-col items-end gap-4"
    >
      <span
        className="text-[10px] tracking-[0.3em]"
        style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
      >
        01 / 05
      </span>

      <div className="flex items-center gap-4">
        <span
          className="text-xs tracking-[0.25em]"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-offwhite)" }}
        >
          SCROLL TO EXPLORE
        </span>

        <div
          className="relative w-8 h-14 rounded-full flex justify-center pt-2"
          style={{ border: "1.5px solid rgba(242,242,239,0.35)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--color-red)",
              animation: "scroll-dot 2.2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}