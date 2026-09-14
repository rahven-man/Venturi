import Link from "next/link";

// TEAMS/CIRCUITS/CHAMPIONSHIP don't have their own pages yet, so they
// point back to the homepage's Analytics section rather than a dead route.
const ITEMS = [
  { label: "DRIVERS", href: "/analytics/drivers", key: "drivers" },
  { label: "TEAMS", href: "/#analytics", key: "teams" },
  { label: "CIRCUITS", href: "/#analytics", key: "circuits" },
  { label: "CHAMPIONSHIP", href: "/#analytics", key: "championship" },
];

export default function AnalyticsNav({ active }) {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center gap-8 px-8 md:px-14 py-5"
      style={{
        background: "rgba(11,12,14,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Link
        href="/"
        className="text-sm tracking-[0.15em] mr-4"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-offwhite)" }}
      >
        VENTURI
      </Link>

      {ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="text-xs tracking-[0.2em] transition-colors duration-300"
          style={{
            fontFamily: "var(--font-technical)",
            color: active === item.key ? "var(--color-red)" : "var(--color-grey)",
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}