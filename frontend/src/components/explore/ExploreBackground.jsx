// Navy engineering-lab backdrop with restrained red and steel accent
// glows. No grid - a plain gradient plus two soft radial washes gives
// enough atmosphere without looking like graph paper.

export default function ExploreBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, var(--color-navy) 0%, var(--color-navy-mid) 55%, var(--color-navy) 100%)",
        }}
      />

      <div
        className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(225,6,0,0.08) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(213,217,222,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}