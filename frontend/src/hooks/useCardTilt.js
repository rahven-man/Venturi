"use client";

import { useRef } from "react";

// Shared 3D tilt behaviour for the Explore cards. VENTURI wanted a more
// dramatic tilt here than a typical subtle premium micro-tilt - up to
// ~16 degrees - while still resetting smoothly on mouse leave so the
// card never feels stuck at an angle.

const MAX_TILT_DEG = 16;

export default function useCardTilt() {
  const cardRef = useRef(null);

  function handleMouseMove(e) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const relX = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
    const relY = (e.clientY - top) / height - 0.5;

    const rotateY = relX * MAX_TILT_DEG * 2;
    const rotateX = relY * MAX_TILT_DEG * -2;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }

  return { cardRef, handleMouseMove, handleMouseLeave };
}