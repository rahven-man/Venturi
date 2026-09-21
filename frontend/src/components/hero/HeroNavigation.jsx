// Top navigation bar. Sits inside the hero's dark upper gradient region, so
// the brand mark and links stay light for contrast. Links are anchors to
// future homepage sections - those sections don't exist yet, this just
// prepares the architecture for them.

const NAV_ITEMS = ["EXPLORE", "INTELLIGENCE", "ANALYTICS", "ABOUT"];

export default function HeroNavigation() {
  return (
    <nav
      data-anim="nav"
      className="absolute top-0 inset-x-0 z-20 flex items-center justify-end px-8 md:px-14 py-3 pointer-events-none"
    >
      <ul className="flex items-center gap-10 md:gap-16 md:px-8 pointer-events-auto">
        {NAV_ITEMS.map((item, i) => (
          <li key={item} data-anim="nav-item" className="relative">
            <a
              href={`#${item.toLowerCase()}`}
              className="group relative block py-2 text-xs transition-all duration-300"
              style={{
                fontFamily: "var(--font-technical)",
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)",
              }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{item}</span>
              <span
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ background: "linear-gradient(90deg, var(--color-red), transparent)" }}
              />
              <span
                className="absolute -bottom-1 left-0 h-px w-full origin-left opacity-0 blur-[3px] transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "var(--color-red)" }}
              />
              {i === 0 && (
                <span
                  className="absolute -bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{ background: "var(--color-red)", boxShadow: "0 0 8px rgba(225,6,0,0.8)" }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}