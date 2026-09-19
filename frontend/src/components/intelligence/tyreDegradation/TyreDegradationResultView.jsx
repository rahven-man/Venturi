"use client";

import TextScramble from "@/components/shared/TextScramble";

function DetailChip({ label, value, delay }) {
  return (
    <div className="rounded-lg px-4 py-3" style={{ background: "rgba(1,8,23,0.55)", border: "1px solid rgba(193,232,255,0.16)", animation: "tyre-result-rise 600ms ease-out both", animationDelay: `${delay}ms` }}>
      <span className="block text-[10px] tracking-[0.15em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>{label}</span>
      <strong className="mt-1 block text-sm" style={{ color: "#c1e8ff", fontFamily: "var(--font-body)" }}>{value ?? "—"}</strong>
    </div>
  );
}

export default function TyreDegradationResultView({ prediction, payload, onReset }) {
  const delta = Number(prediction.predicted_laptime_delta_seconds);
  const isSlower = delta > 0;
  const sign = isSlower ? "+" : "";
  const deltaText = `${sign}${delta.toFixed(3)}s`;
  const accentColor = isSlower ? "#e10600" : "#5ee6a8";
  const a = prediction.assumptions_used ?? {};

  const chips = [
    ["DRIVER", payload?.driver], ["TEAM", payload?.team], ["EVENT", payload?.event_name?.replaceAll("_", " ")],
    ["COMPOUND", payload?.compound], ["LAP NUMBER", payload?.lap_number], ["STINT", payload?.stint],
    ["TYRE LIFE", payload?.tyre_life], ["GRID POSITION", payload?.grid_position], ["CURRENT POSITION", payload?.current_position],
    ["SAFETY CAR", payload?.is_safety_car_active ? "ACTIVE" : "NO"],
    ["WEATHER SOURCE", a.weather_source], ["PACE SOURCE", a.driver_pace_source],
  ];

  return (
    <main
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-16 md:px-16"
      style={{ backgroundImage: "linear-gradient(140deg, rgba(1,8,23,0.92) 15%, rgba(5,38,89,0.75) 100%), url('/images/LapTimeImage.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <style>{`@keyframes tyre-result-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <button onClick={onReset} className="absolute left-6 top-8 flex items-center gap-2 text-xs tracking-[0.2em] transition-colors duration-200 hover:text-white md:left-14 md:top-10" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>
        ← NEW SCENARIO
      </button>

      <div className="mx-auto w-full max-w-5xl">
        <p className="text-center text-[10px] tracking-[0.35em] md:text-left" style={{ color: "#ff6b61", fontFamily: "var(--font-technical)" }}>PREDICTION RETURN / TYRE DEGRADATION</p>

        <div className="mt-4 flex flex-col items-center gap-3 md:flex-row md:items-end md:gap-6">
          <TextScramble key={deltaText} text={deltaText} trigger="mount" charset="binary" speed={24} spread={26} className="text-7xl md:text-[8.5rem]" style={{ color: accentColor, fontFamily: "var(--font-display)", lineHeight: 1 }} />
          <span
            className="rounded-full px-5 py-2 text-sm tracking-[0.2em] md:mb-5"
            style={{ background: isSlower ? "rgba(225,6,0,0.2)" : "rgba(94,230,168,0.15)", border: `1px solid ${accentColor}`, color: accentColor, fontFamily: "var(--font-technical)" }}
          >
            {isSlower ? "SLOWER THAN BASELINE" : "FASTER THAN BASELINE"}
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed" style={{ color: "#7da0ca", fontFamily: "var(--font-body)" }}>
          {prediction.interpretation}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {chips.map(([label, value], i) => <DetailChip key={label} label={label} value={value} delay={300 + i * 60} />)}
        </div>
      </div>
    </main>
  );
}