import { driverTheme } from "@/components/analytics/theme";

// Shared stat-tile grid used by both Season and Career cards, so numbers
// spread across the card's full width instead of stacking vertically.
export default function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="px-4 py-5"
          style={{
            background: "rgba(2,16,36,0.35)",
            border: "1px solid rgba(193,232,255,0.12)",
            borderRadius: "10px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.9rem",
              color: driverTheme.paleBlue,
            }}
          >
            {value}
          </p>
          <p
            className="mt-1 text-[11px] tracking-[0.15em]"
            style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}