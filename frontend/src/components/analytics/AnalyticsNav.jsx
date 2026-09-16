import Link from "next/link";
import { driverTheme } from "./theme";

const ITEMS = [
  { label: "DRIVERS", href: "/analytics/drivers", key: "drivers" },
  { label: "TEAMS", href: "/analytics/teams", key: "teams" },
  { label: "CIRCUITS", href: "/#analytics", key: "circuits" },
  { label: "CHAMPIONSHIP", href: "/#analytics", key: "championship" },
];

export default function AnalyticsNav({ active }) {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center gap-8 px-8 md:px-14 py-5"
      style={{
        background: "rgba(2,16,36,0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(193,232,255,0.12)",
      }}
    >
      <Link
        href="/"
        className="text-sm tracking-[0.15em] mr-4"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: driverTheme.paleBlue }}
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
            color: active === item.key ? driverTheme.red : driverTheme.skyLight,
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}