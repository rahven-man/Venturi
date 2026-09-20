export default function LegalPage() {
  return (
    <main className="min-h-screen px-8 py-24 md:px-14" style={{ background: "linear-gradient(160deg, #021024 0%, #052659 55%, #021024 100%)" }}>
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>LEGAL & ATTRIBUTION</p>
        <h1 className="mt-4 text-4xl md:text-5xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#ffffff" }}>
          Disclaimer & Fair Use Notice
        </h1>
        <div className="mt-4 h-1 w-16" style={{ background: "#e10600" }} />

        <div className="mt-10 space-y-6 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#c1e8ff" }}>
          <p>© 2026 Abdur Rahman (Rahven). All Rights Reserved.</p>

          <p>
            This website (VENTURI) is an unofficial, 100% non-commercial student academic project created solely
            for educational purposes and as a resume portfolio piece. It generates zero revenue and is not affiliated
            with, endorsed by, or connected to Formula One Licensing BV, the FIA, or any Formula 1 team, driver, or
            sponsor in any way.
          </p>

          <p>
            Formula 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, Grand Prix, and all related logos, team
            names, and driver imagery are registered trademarks of Formula One Licensing BV and their respective
            owners.
          </p>

          <p>
            All media, photographs, and circuit layout diagrams used on this platform belong to their respective
            copyright holders and are utilized here under Fair Use guidelines for educational analysis and
            demonstration. No copyright infringement is intended.
          </p>

          <p>
            All predictive models, statistics, and analytics presented are generated from historical, publicly
            available race data for demonstrative purposes. Predictions should not be interpreted as official F1
            data, betting advice, or a guarantee of real-world outcomes.
          </p>

          <p>
            If you are a copyright owner and wish to have any content removed, please reach out via the contact
            details on the About section of this site.
          </p>
        </div>

        <div className="mt-14 rounded-lg p-6" style={{ background: "rgba(1,8,23,0.4)", border: "1px solid rgba(193,232,255,0.16)" }}>
          <p className="text-xs tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: "#7da0ca" }}>
            THIS IS A STUDENT PROJECT — BUILT FOR LEARNING, NOT FOR PROFIT.
          </p>
        </div>
      </div>
    </main>
  );
}