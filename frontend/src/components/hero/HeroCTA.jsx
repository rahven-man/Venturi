export default function HeroCTA() {
  return (
    <div
      data-anim="cta"
      className="absolute bottom-10 left-8 md:left-14 z-20 flex items-center gap-3 group cursor-default"
    >
      <span
        className="text-xs tracking-[0.2em]"
        style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
      >
        PROJECT
      </span>
      <span
        className="transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: "var(--color-red)" }}
      >
        →
      </span>
      <span
        className="text-xs tracking-[0.2em]"
        style={{ fontFamily: "var(--font-technical)", color: "var(--color-offwhite)" }}
      >
        PRODUCT
      </span>
    </div>
  );
}