export default function ExploreStatement() {
  return (
    <div data-anim="explore-statement" className="mt-24 max-w-3xl md:mt-32">
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
          lineHeight: 1.3,
          color: "var(--color-palette-sky)",
        }}
      >
        DATA TELLS YOU WHAT HAPPENED.
        <br />
        <span style={{ color: "var(--color-palette-ice)" }}>
          ENGINEERING INTELLIGENCE
          <br />
          ASKS WHY.
        </span>
      </p>
    </div>
  );
}