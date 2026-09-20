export default function HeroBrand() {
  return (
    <div
      data-anim="brand"
      className="absolute top-0 left-0 z-20 flex items-center px-8 md:px-3 py-1"
      style={{ opacity: 1 }}
    >
      <div className="relative flex items-center">
        <img
          src="/images/logo.png"
          alt="VENTURI"
          className="relative z-10"
          style={{ height: "98px", width: "auto", maxWidth: "none" }}
        />
        <img
          src="/images/car_trail.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -translate-y-1/2"
          style={{ left: "0%", height: "150px", width: "auto", maxWidth: "none", opacity: 1 }}
        />
      </div>
    </div>
  );
}