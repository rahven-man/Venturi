// Subtle non-user-triggered atmosphere layered over the hero photo:
// a warm sunlight glow (left), a red glow near the car's rear light,
// and a handful of sparse drifting particles. All CSS-driven (cheap)
// so they keep running smoothly without JS animation loops.
//
// NOTE: red-glow position (top/left %) is an approximation - nudge these
// percentages after looking at HeroSection.png in the browser so it sits
// exactly over the rear light.

const PARTICLES = [
  { top: "30%", left: "20%", delay: "0s", duration: "14s" },
  { top: "55%", left: "70%", delay: "3s", duration: "18s" },
  { top: "40%", left: "45%", delay: "6s", duration: "16s" },
  { top: "65%", left: "30%", delay: "2s", duration: "20s" },
];

export default function HeroAtmosphere() {
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* warm sunlight, upper-left */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,140,0.18) 0%, transparent 70%)",
          animation: "glow-breathe 10s ease-in-out infinite",
        }}
      />



      {/* sparse drifting particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full"
          style={{
            top: p.top,
            left: p.left,
            background: "rgba(242,242,239,0.35)",
            animation: `drift-up ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}