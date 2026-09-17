"use client";

import TextScramble from "@/components/shared/TextScramble";

export default function LapTimeResult({ prediction, payload }) {
  if (!prediction) {
    return (
      <div className="flex min-h-[16rem] items-center justify-center rounded-2xl p-8 text-center" style={{ background: "linear-gradient(145deg, #010817, #052659)", border: "1px solid rgba(193,232,255,0.16)" }}>
        <div>
          <p className="text-[10px] tracking-[0.3em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>MODEL OUTPUT</p>
          <p className="mt-3 text-sm" style={{ color: "#c1e8ff", fontFamily: "var(--font-body)" }}>Configure a race scenario to generate the next-lap estimate.</p>
        </div>
      </div>
    );
  }

  const seconds = Number(prediction.predicted_lap_time_seconds);
  const minutes = Math.floor(seconds / 60);
  const remainder = (seconds % 60).toFixed(3).padStart(6, "0");
  const timeText = `${minutes}:${remainder}`;

  return (
    <div className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{ backgroundImage: "linear-gradient(120deg, rgba(1,8,23,0.9) 20%, rgba(5,38,89,0.75) 100%), url('/images/LapTimeImage.png')", backgroundSize: "cover", backgroundPosition: "center", border: "1px solid rgba(225,6,0,0.6)" }}>
      <div className="absolute right-8 top-8 h-3 w-3 rounded-full" style={{ background: "#e10600", boxShadow: "0 0 18px rgba(225,6,0,0.8)" }} />
      <p className="text-[10px] tracking-[0.3em]" style={{ color: "#ff6b61", fontFamily: "var(--font-technical)" }}>PREDICTION RETURN / SINGLE LAP</p>

      <div className="mt-5 flex items-end gap-3">
        <TextScramble key={timeText} text={timeText} trigger="mount" charset="binary" speed={22} spread={20} className="text-6xl md:text-8xl" style={{ color: "#ffffff", fontFamily: "var(--font-display)" }} />
        <span className="mb-2 text-xs tracking-[0.18em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>SECONDS</span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        {[["DRIVER", payload?.driver], ["COMPOUND", payload?.compound], ["LAP", payload?.lap_number], ["EST. RACE LENGTH", `${prediction.assumptions_used?.total_laps_estimated ?? "—"} LAPS`]].map(([label, value]) => (
          <div key={label}>
            <span className="block text-[10px] tracking-[0.15em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>{label}</span>
            <strong style={{ color: "#c1e8ff", fontFamily: "var(--font-body)" }}>{value}</strong>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 border-t pt-5 sm:grid-cols-2" style={{ borderColor: "rgba(193,232,255,0.16)" }}>
        <p className="text-xs" style={{ color: "#7da0ca", fontFamily: "var(--font-body)" }}>Weather: <span style={{ color: "#c1e8ff" }}>{prediction.assumptions_used?.weather_source}</span></p>
        <p className="text-xs" style={{ color: "#7da0ca", fontFamily: "var(--font-body)" }}>Pace: <span style={{ color: "#c1e8ff" }}>{prediction.assumptions_used?.driver_pace_source}</span></p>
      </div>
    </div>
  );
}