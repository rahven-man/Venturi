"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ElasticText({ children, className = "" }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current.textContent;
    const chars = text.split("");

    // Clear the text and create spans for each character with space preservation
    textRef.current.innerHTML = chars
      .map((char) => {
        if (char === " ") {
          return "<span style=\"display: inline-block; width: 0.3em;\"> </span>";
        }
        return `<span style="display: inline-block; margin: 0 0.05em;">${char}</span>`;
      })
      .join("");

    const spans = textRef.current.querySelectorAll("span");

    // Create a looping animation
    const animateElastic = () => {
      gsap.fromTo(
        spans,
        {
          opacity: 0,
          scale: 0.3,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "elastic.out(1.2, 0.8)",
          stagger: 0.08,
          onComplete: () => {
            // Loop the animation after a delay
            gsap.delayedCall(3, () => {
              animateElastic();
            });
          },
        }
      );
    };

    animateElastic();
  }, []);

  return (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );
}
