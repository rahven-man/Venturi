import { ElasticText } from "@/components/godui/elastic-text";

export default function ExploreIntro() {
  return (
    <div className="grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(280px,5fr)]">
      <div>
        <div data-anim="explore-eyebrow" className="flex items-center gap-3 mb-6">
          <span
            className="text-xs tracking-[0.3em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-red)" }}
          >
            02 / 05
          </span>
          <span className="w-8 h-px" style={{ background: "var(--color-border)" }} />
          <span
            className="text-xs tracking-[0.9em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
          >
            EXPLORE VENTURI
          </span>
        </div>

        <div className="overflow-hidden">
          <h2
            data-anim="explore-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "var(--color-palette-ice)",
            }}
          >
            THE RACE
            <br />
            IS MORE THAN
            <br />
            THE RESULT.
          </h2>
        </div>
      </div>

      <div className="max-w-xl lg:justify-self-end lg:pt-6">
        <p
          data-anim="explore-paragraph"
          className="text-base leading-relaxed lg:text-right"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-palette-sky)" }}
        >
          Formula One generates an extraordinary volume of engineering data —
          lap times, tyre behaviour, pit stops, driver performance, circuit
          characteristics and race conditions. VENTURI transforms that data
          into systems you can explore, compare and understand.
        </p>

        <div className="mt-10 flex justify-end md:mt-12">
          <ElasticText className="text-base font-light tracking-wide md:text-lg lg:text-right" style={{ color: "var(--color-palette-ice)" }}>
            Designed by a Student
          </ElasticText>
        </div>
      </div>
    </div>
  );
}