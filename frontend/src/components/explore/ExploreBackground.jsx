// Layered blue backdrop based on the VENTURI palette.

export default function ExploreBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "var(--color-explore-surface)",
        }}
      />

      <div
        className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(125,160,202,0.18) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(193,232,255,0.12) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}