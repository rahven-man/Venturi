"use client";

// Clean card wrapper for detail pages with smooth natural vertical spacing.
export default function StackCard({ innerRef, children }) {
  return (
    <div
      ref={innerRef}
      className="mb-8 md:mb-10 w-full"
    >
      {children}
    </div>
  );
}