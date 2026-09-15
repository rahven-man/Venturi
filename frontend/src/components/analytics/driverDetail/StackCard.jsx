"use client";

// Thin sticky wrapper that gives every card in the detail page the same
// "stack and overlap" scroll behaviour used on the Drivers directory page.
// GSAP dims/shrinks a card as the next one comes to rest on top of it.

export default function StackCard({ innerRef, zIndex, children }) {
  return (
    <div
      ref={innerRef}
      className="sticky will-change-transform"
      style={{ top: "96px", zIndex, marginBottom: "2.5rem" }}
    >
      {children}
    </div>
  );
}