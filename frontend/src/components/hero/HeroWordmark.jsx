// VENTURI hero wordmark.
// Designed as a monumental automotive-style identity rather than a normal heading.
// The wordmark stays in the upper atmospheric region and remains visually separate
// from the F1 car below.

export default function HeroWordmark() {
  return (
    <div className="relative flex items-center justify-center px-8 md:px-12 py-6 pointer-events-none select-none">
      <h1
        data-anim="wordmark"
        aria-label="VENTURI"
        className="relative whitespace-nowrap"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(4rem, 8.8vw, 9.5rem)",
          lineHeight: 0.88,
          letterSpacing: "-0.055em",
          transform: "scaleX(1.08)",
          transformOrigin: "center center",

          // Deep graphite / black-metal treatment.
          backgroundImage:
            "linear-gradient(180deg, #454A51 0%, #292D32 34%, #171A1D 68%, #090B0D 100%)",

          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",

          // Creates separation from the bright sky without looking like a glow.
          filter:
            "drop-shadow(0 1px 0 rgba(255,255,255,0.22)) drop-shadow(0 4px 2px rgba(0,0,0,0.45)) drop-shadow(0 12px 24px rgba(0,0,0,0.28))",
        }}
      >
        VENTURI

        {/* Restrained metallic light sweep */}
        <span
          data-anim="wordmark-sweep"
          aria-hidden="true"
          className="absolute inset-0 whitespace-nowrap"
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.04) 44%, rgba(255,255,255,0.34) 50%, rgba(255,255,255,0.04) 56%, transparent 62%)",
            backgroundSize: "260% 100%",
            backgroundPosition: "-130% 0",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            mixBlendMode: "screen",
          }}
        >
          VENTURI
        </span>
      </h1>
    </div>
  );
}