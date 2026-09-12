import Image from "next/image";
import HeroAtmosphere from "./HeroAtmosphere";

// The background photograph and its atmosphere layers. Pure visual markup -
// the entrance animation and mouse parallax are both driven from
// HeroSection via the data-anim="scene-image" attribute, so this component
// doesn't need any animation logic of its own.

export default function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div data-anim="scene-image" className="absolute inset-0">
        <Image
          src="/images/HeroSection.png"
          alt="Formula One car under a sunset sky, rear tyre smoke rising off a wet track"
          fill
          priority
          className="object-cover"
        />
      </div>

      <HeroAtmosphere />

      <div
        data-anim="veil"
        className="absolute inset-0 z-10"
        style={{ background: "var(--color-graphite)" }}
      />

      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,12,14,0.55) 0%, rgba(11,12,14,0) 25%, rgba(11,12,14,0) 65%, rgba(11,12,14,0.65) 100%)",
        }}
      />
    </div>
  );
}