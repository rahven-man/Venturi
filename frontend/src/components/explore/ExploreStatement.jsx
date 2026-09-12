export default function ExploreStatement() {
  return (
    <div data-anim="explore-statement" className="max-w-3xl mt-24 md:mt-32 lg:ml-40">
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
          lineHeight: 1.3,
          color: "var(--color-grey)",
        }}
      >
        DATA TELLS YOU WHAT HAPPENED.
        <br />
        <span style={{ color: "var(--color-offwhite)" }}>
          ENGINEERING INTELLIGENCE
          <br />
          ASKS WHY.
        </span>
      </p>
    </div>
  );
}