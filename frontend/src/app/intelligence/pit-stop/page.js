"use client";

import { useState } from "react";
import AnalyticsNav from "@/components/analytics/AnalyticsNav";
import PitStopForm from "@/components/intelligence/pitStop/PitStopForm";
import PitStopResultView from "@/components/intelligence/pitStop/PitStopResultView";
import PitStopLoadingOverlay from "@/components/intelligence/pitStop/PitStopLoadingOverlay";
import usePitStopModel from "@/hooks/usePitStopModel";

export default function PitStopPage() {
  const { options, loadingOptions, prediction, phase, predicting, error, runPrediction, resetPrediction } = usePitStopModel();
  const [lastPayload, setLastPayload] = useState(null);

  async function handleSubmit(payload) {
    setLastPayload(payload);
    await runPrediction(payload);
  }

  if (phase === "revealed" && prediction) {
    return <PitStopResultView prediction={prediction} payload={lastPayload} onReset={resetPrediction} />;
  }

  return (
    <main className="min-h-screen" style={{ background: "#021024" }}>
      <AnalyticsNav active="teams" />
      <PitStopLoadingOverlay active={phase === "loading"} />

      <section className="relative w-full">
        <img src="/images/lap-time/LapTimeHero.png" alt="" className="block h-auto w-full select-none" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(2,16,36,0.85) 0%, rgba(2,16,36,0.5) 38%, rgba(2,16,36,0.2) 58%, rgba(2,16,36,0.75) 100%)" }} />

        <div className="absolute left-6 top-10 max-w-md md:left-14 md:top-16">
          <div className="flex items-center gap-3 text-xs tracking-[0.3em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>
            <span>INTELLIGENCE</span><span>›</span><span style={{ color: "#e10600" }}>PIT STOP</span>
          </div>
          <h1 className="mt-4 text-4xl leading-[0.95] md:text-6xl" style={{ color: "#ffffff", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            PIT STOP<br /><span style={{ color: "#c1e8ff" }}>PREDICTION</span>
          </h1>
          <div className="mt-4 h-1 w-16" style={{ background: "#e10600" }} />
          <p className="mt-5 text-sm uppercase tracking-[0.2em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>Same data. A deeper perspective.</p>
          <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: "#c1e8ff", fontFamily: "var(--font-body)", opacity: 0.85 }}>
            Predict the pit stop call using real race context and classifier confidence. Build a scenario and let the model decide.
          </p>
        </div>

        <div className="mx-6 mt-6 md:absolute md:right-8 md:top-6 md:bottom-6 md:mx-0 md:mt-0 md:w-[57rem] md:overflow-y-auto lg:right-14 lg:w-[47rem]">
          <PitStopForm options={options} onSubmit={handleSubmit} predicting={predicting} loadingOptions={loadingOptions} />
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-4xl px-8 pb-16 pt-8">
          <div className="rounded-md border px-4 py-3 text-sm" style={{ borderColor: "#e10600", background: "rgba(225,6,0,0.12)", color: "#ff6b61", fontFamily: "var(--font-body)" }}>{error}</div>
        </div>
      )}
    </main>
  );
}