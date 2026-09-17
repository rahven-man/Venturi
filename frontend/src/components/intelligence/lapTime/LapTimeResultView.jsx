"use client";

import TextScramble from "@/components/shared/TextScramble";

function DetailChip({ label, value, delay }) {
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{ background: "rgba(1,8,23,0.55)", border: "1px solid rgba(193,232,255,0.16)", animation: "lap-result-rise 600ms ease-out both", animationDelay: `${delay}ms` }}
    >
      <span className="block text-[10px] tracking-[0.15em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>{label}</span>
      <strong className="mt-1 block text-sm" style={{ color: "#c1e8ff", fontFamily: "var(--font-body)" }}>{value ?? "—"}</strong>
    </div>
  );
}

export default function LapTimeResultView({ prediction, payload, onReset }) {
  const seconds = Number(prediction.predicted_lap_time_seconds);
  const minutes = Math.floor(seconds / 60);
  const remainder = (seconds % 60).toFixed(3).padStart(6, "0");
  const timeText = `${minutes}:${remainder}`;
  const a = prediction.assumptions_used ?? {};

  const chips = [
    ["DRIVER", payload?.driver], ["TEAM", payload?.team], ["EVENT", payload?.event_name?.replaceAll("_", " ")],
    ["COMPOUND", payload?.compound], ["LAP NUMBER", payload?.lap_number], ["STINT", payload?.stint],
    ["TYRE LIFE", payload?.tyre_life], ["GRID POSITION", payload?.grid_position], ["SEASON", payload?.season],
    ["EST. RACE LENGTH", a.total_laps_estimated ? `${a.total_laps_estimated} LAPS` : "—"],
    ["WEATHER SOURCE", a.weather_source], ["PACE SOURCE", a.driver_pace_source],
  ];

  return (
    <main
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-16 md:px-16"
      style={{ backgroundImage: "linear-gradient(140deg, rgba(1,8,23,0.92) 15%, rgba(5,38,89,0.75) 100%), url('/images/LapTimeImage.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <style>{`@keyframes lap-result-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <button onClick={onReset} className="absolute left-6 top-8 flex items-center gap-2 text-xs tracking-[0.2em] transition-colors duration-200 hover:text-white md:left-14 md:top-10" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>
        ← NEW SCENARIO
      </button>

      <div className="mx-auto w-full max-w-5xl">
        <p className="text-center text-[10px] tracking-[0.35em] md:text-left" style={{ color: "#ff6b61", fontFamily: "var(--font-technical)" }}>PREDICTION RETURN / SINGLE LAP</p>

        <div className="mt-4 flex flex-col items-center gap-2 md:flex-row md:items-end md:gap-4">
          <TextScramble key={timeText} text={timeText} trigger="mount" charset="binary" speed={24} spread={26} className="text-7xl md:text-[9rem]" style={{ color: "#ffffff", fontFamily: "var(--font-display)", lineHeight: 1 }} />
          <span className="text-sm tracking-[0.2em] md:mb-4" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>SECONDS</span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {chips.map(([label, value], i) => <DetailChip key={label} label={label} value={value} delay={300 + i * 60} />)}
        </div>
      </div>
    </main>
  );
}