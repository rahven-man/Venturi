const GITHUB_URL = "https://github.com/YOUR-USERNAME/venturi";

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b py-3" style={{ borderColor: "rgba(193,232,255,0.1)" }}>
      <span className="text-xs tracking-[0.1em]" style={{ fontFamily: "var(--font-technical)", color: "#7da0ca" }}>{label}</span>
      <strong style={{ fontFamily: "var(--font-body)", color: "#c1e8ff" }}>{value}</strong>
    </div>
  );
}

function ModelBlock({ index, title, tagline, metrics, story, limitations }) {
  return (
    <div className="rounded-2xl p-8 md:p-10" style={{ background: "linear-gradient(135deg, rgba(84,131,179,0.15) 0%, rgba(2,16,36,0.4) 100%)", border: "1px solid rgba(193,232,255,0.14)" }}>
      <div className="flex items-center gap-3">
        <span className="text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>MODEL {index}</span>
        <span className="h-px flex-1" style={{ background: "rgba(193,232,255,0.15)" }} />
      </div>
      <h3 className="mt-4 text-2xl md:text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#ffffff" }}>{title}</h3>
      <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-body)", color: "#7da0ca" }}>{tagline}</p>

      <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
        {metrics.map((m) => <MetricRow key={m.label} {...m} />)}
      </div>

      <div className="mt-6 space-y-4 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#c1e8ff", opacity: 0.9 }}>
        {story.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {limitations && (
        <div className="mt-6 rounded-lg p-5" style={{ background: "rgba(225,6,0,0.08)", border: "1px solid rgba(225,6,0,0.25)" }}>
          <p className="text-[10px] tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: "#ff6b61" }}>KNOWN LIMITATIONS — DOCUMENTED, NOT HIDDEN</p>
          <ul className="mt-3 space-y-2 text-sm" style={{ fontFamily: "var(--font-body)", color: "#c1e8ff", opacity: 0.85 }}>
            {limitations.map((l, i) => <li key={i}>• {l}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-8 py-24 md:px-14" style={{ background: "linear-gradient(160deg, #021024 0%, #052659 55%, #021024 100%)" }}>
      <div className="mx-auto max-w-4xl">
        <p className="text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>HOW IT WORKS</p>
        <h1 className="mt-4 text-4xl md:text-6xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>METHODOLOGY</h1>
        <div className="mt-4 h-1 w-16" style={{ background: "#e10600" }} />

        <p className="mt-8 max-w-2xl text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#c1e8ff", opacity: 0.9 }}>
          VENTURI is built on two data sources spanning 76 years of Formula 1: the FastF1 telemetry archive
          (2018–2025, ~72GB) and the Jolpica relational dataset (1950–present, 18 tables). The full pipeline —
          data collection, cleaning, feature engineering, and model training — is documented across 9 Jupyter
          notebooks, open on GitHub.
        </p>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 inline-flex items-center gap-3 rounded-full px-6 py-3 text-xs tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: "rgba(193,232,255,0.08)", border: "1px solid rgba(193,232,255,0.3)", color: "#c1e8ff", fontFamily: "var(--font-technical)" }}
        >
          VIEW ALL 9 NOTEBOOKS ON GITHUB
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>

        <div className="mt-16 space-y-8">
          <ModelBlock
            index="01"
            title="Lap Time Prediction"
            tagline="XGBoost regression — the foundation model"
            metrics={[
              { label: "MAE", value: "1.720s" },
              { label: "RMSE", value: "4.199s" },
              { label: "R²", value: "0.896" },
              { label: "EVAL SET", value: "2025 holdout" },
            ]}
            story={[
              "An untuned XGBoost baseline (300 estimators, max depth 6, learning rate 0.05) trained on the full engineered feature set outperformed tuned variants — the real lever here was feature engineering, not hyperparameter search.",
              "The model, its label encoders, and the exact feature column order are all saved together, so the web app can reconstruct any user input into the same shape the model was trained on.",
            ]}
            limitations={[
              "Safety car, VSC, and out-laps carry higher error (5–10s vs ~1.4s for normal laps) — real-time gap and position telemetry isn't available to the model.",
              "Lap 1 of races starting under safety car or a rolling start is systematically underpredicted, since the shift-based track-status feature has no way to know the race-start type in advance.",
            ]}
          />

          <ModelBlock
            index="02"
            title="Pit Stop Prediction"
            tagline="XGBoost binary classifier — probability, not a verdict"
            metrics={[
              { label: "PR-AUC", value: "0.700" },
              { label: "PRECISION @ 0.5", value: "~65%" },
              { label: "RECALL @ 0.5", value: "~62%" },
              { label: "EVAL SET", value: "2025 holdout" },
            ]}
            story={[
              "This model caught a real data leakage bug during development: IsAccurate, a FastF1 data-quality flag, turned out to be 100% correlated with pit laps — every single pit lap had IsAccurate == False. The first training run gave an inflated PR-AUC of 0.929 purely from this leak. Dropping the column brought it down to a real 0.670, the honest starting point.",
              "A second round of feature engineering (opponent tyre context, teammate pit reactions, cascade pit counts, track-specific pit rate priors) pushed PR-AUC to a promising 0.82+ — but repeated data integrity issues surfaced along the way: row duplication from a merge on null keys, a lagging bug that leaked current-lap information, and a stale variable reference giving inconsistent results.",
              "Rather than ship a number that couldn't be fully verified, the model reverted to this simpler, thoroughly checked 0.700 baseline. A verified 0.70 beats an unverified 0.82. The richer feature set remains a candidate to revisit with more careful implementation.",
              "The output is a probability (0–100%), not a hard yes/no — deliberately, so the tool supports what-if strategy exploration rather than dictating one fixed cutoff.",
            ]}
          />

          <ModelBlock
            index="03"
            title="Tyre Degradation"
            tagline="XGBoost regression — isolating a genuinely small signal"
            metrics={[
              { label: "MAE", value: "0.968s" },
              { label: "RMSE", value: "1.932s" },
              { label: "R²", value: "0.253" },
              { label: "EVAL SET", value: "2025 holdout, dry compounds" },
            ]}
            story={[
              "Same baseline configuration as the lap time model — no hyperparameter tuning, consistent with the earlier finding that tuning wasn't the lever, feature engineering was.",
              "R² is much lower here than the lap time model's 0.896, and that's expected rather than a modeling flaw. Once safety car, VSC, yellow flag, and out-laps are removed, what's left is a genuinely small and noisy signal — degradation on a clean lap is usually a fraction of a second to a couple of seconds, competing against driver-to-driver pace variance and residual fuel-burn effects that aren't fully separable from degradation in a single lap. Real tyre models in motorsport engineering face the same difficulty. An MAE under 1 second is the more meaningful number, since predictions land close in absolute terms even though the variance explained is modest.",
              "A feature-importance check confirmed the model is picking up a genuine tyre-related signal rather than noise: TyreLife, its squared and sqrt transforms, stint lap number, and the compound-interaction terms are highly correlated with each other (TyreLife and stint_lap_number alone correlate at 0.987), so importance splits across the family instead of concentrating in one feature. Summed together, this tyre-life family accounts for roughly 13.9% of total importance — more than any single other feature.",
            ]}
          />
        </div>
      </div>
    </main>
  );
}