// Top navigation bar. Sits inside the hero's dark upper gradient region, so
// the brand mark and links stay light for contrast. Links are anchors to
// future homepage sections - those sections don't exist yet, this just
// prepares the architecture for them.

const NAV_ITEMS = ["EXPLORE", "INTELLIGENCE", "ANALYTICS", "ABOUT"];

export default function HeroNavigation() {
  return (
    <nav
      data-anim="nav"
      className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-8 md:px-14 py-8"
    >
      <div data-anim="brand" className="flex items-center gap-3" style={{ opacity: 0.95 }}>
        
        <div className="flex flex-col leading-none">
          <span
            className="text-lg tracking-[0.40em]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "#071522",
              opacity: 0.95,
            }}
          >
            VENTURI
          </span>
          <span
            className="hidden md:block text-[10px] tracking-[0.3em] mt-1"
            style={{ fontFamily: "var(--font-technical)", color: "#071522", opacity: 0.75, fontWeight:700 }}
          >
            ENGINEERING INTELLIGENCE — FORMULA ONE
          </span>
        </div>
      </div>

      <ul
        className="flex items-center gap-1 rounded-full px-2 py-1"
        style={{
          background: "rgba(20,22,25,0.45)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(154,157,162,0.15)",
        }}
      >
        {NAV_ITEMS.map((item, i) => (
          <li key={item} data-anim="nav-item" className="relative">
            <a
              href={`#${item.toLowerCase()}`}
              className="group relative block px-4 py-2 text-sm transition-all duration-300 hover:tracking-[0.14em]"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                color: "var(--color-offwhite)",
                opacity: i === 0 ? 1 : 0.85,
              }}
            >
              {item}
              <span
                className="absolute left-4 right-4 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: "var(--color-red)" }}
              />
              {i === 0 && (
                <span
                  className="absolute left-1/2 -bottom-2 w-1 h-1 -translate-x-1/2 rounded-full"
                  style={{ background: "var(--color-red)" }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}