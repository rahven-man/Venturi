import { driverTheme } from "@/components/analytics/theme";

// Shared stat-tile grid styled as recessed F1 telemetry instrument bezels.
// Solid #021024 deep-void inset with top indicator notches and crisp technical typography.
export default function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ label, value }, index) => {
        const slotCode = String(index + 1).padStart(2, "0");
        return (
          <div
            key={label}
            className="group relative px-5 py-4 rounded-[12px] transition-all duration-200 hover:border-[rgba(193,232,255,0.35)]"
            style={{
              background: "#021024",
              border: "1px solid rgba(193,232,255,0.15)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.65), 0 6px 16px rgba(0,0,0,0.3)",
            }}
          >
            {/* Top telemetry indicator notch */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="h-[2px] w-6 rounded-full"
                style={{ background: driverTheme.paleBlue }}
              />
              <span
                className="text-[9px] tracking-widest opacity-60 font-mono"
                style={{ color: driverTheme.skyLight }}
              >
                // {slotCode}
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "1.9rem",
                lineHeight: 1.1,
                color: driverTheme.paleBlue,
              }}
            >
              {value}
            </p>
            <p
              className="mt-1.5 text-[10px] tracking-[0.16em] uppercase font-semibold"
              style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}