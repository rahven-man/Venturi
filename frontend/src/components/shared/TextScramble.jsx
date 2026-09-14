"use client";

// Converted directly from the reference GodUI TextScramble (TSX -> JSX),
// logic and timing mechanics left untouched. Only the TypeScript types
// were removed - behaviour is identical to the original.

import { useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";

const CHARSETS = {
  alphanumeric:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  symbols: "!<>-_\\/[]{}—=+*^?#$%&",
  katakana: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ",
  binary: "01",
};

const TextScramble = forwardRef(
  (
    {
      text,
      trigger = "mount",
      charset = "alphanumeric",
      speed = 28,
      spread = 28,
      className,
      onPointerEnter,
      ...props
    },
    forwardedRef
  ) => {
    const ref = useRef(null);
    useImperativeHandle(forwardedRef, () => ref.current);

    const reduce = useReducedMotion();
    const pool = CHARSETS[charset] ?? charset;
    const poolRef = useRef(pool);
    poolRef.current = pool;

    const [cells, setCells] = useState(() =>
      Array.from(text).map((ch) => ({ ch, done: true }))
    );
    const displayed = useRef(text);
    const timer = useRef(null);
    const started = useRef(false);

    const run = useCallback(
      (toText) => {
        if (reduce) {
          displayed.current = toText;
          setCells(Array.from(toText).map((ch) => ({ ch, done: true })));
          return;
        }

        const from = displayed.current;
        const len = Math.max(from.length, toText.length);
        const queue = [];

        for (let i = 0; i < len; i++) {
          const start = Math.floor(Math.random() * spread);
          const end = start + 10 + Math.floor(Math.random() * spread);
          queue.push({ from: from[i] ?? "", to: toText[i] ?? "", start, end });
        }

        if (timer.current) clearInterval(timer.current);
        let frame = 0;

        timer.current = setInterval(() => {
          let complete = 0;
          const next = queue.map((c) => {
            if (frame >= c.end) {
              complete++;
              return { ch: c.to, done: true };
            }
            if (frame >= c.start) {
              const p = poolRef.current;
              const ch = p[Math.floor(Math.random() * p.length)];
              return { ch, done: false };
            }
            return { ch: c.from, done: true };
          });

          setCells(next);
          frame++;

          if (complete === queue.length && timer.current) {
            clearInterval(timer.current);
            timer.current = null;
            displayed.current = toText;
          }
        }, speed);
      },
      [reduce, speed, spread]
    );

    useEffect(() => {
      if (!started.current) {
        if (trigger === "mount") {
          started.current = true;
          run(text);
        } else if (trigger === "in-view") {
          const el = ref.current;
          if (!el) return;

          const io = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) {
                started.current = true;
                run(text);
                io.disconnect();
              }
            },
            { threshold: 0.4 }
          );
          io.observe(el);
          return () => io.disconnect();
        }
        return;
      }
      run(text);
    }, [text, trigger, run]);

    useEffect(
      () => () => {
        if (timer.current) clearInterval(timer.current);
      },
      []
    );

    return (
      <span
        ref={ref}
        onPointerEnter={(e) => {
          onPointerEnter?.(e);
          if (trigger === "hover") {
            started.current = true;
            run(text);
          }
        }}
        className={`inline-block tabular-nums ${className ?? ""}`}
        {...props}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {cells.map((cell, i) => (
            <span
              key={i}
              style={!cell.done ? { color: "var(--color-red)", transition: "color 120ms ease" } : undefined}
            >
              {cell.ch === " " ? "\u00A0" : cell.ch}
            </span>
          ))}
        </span>
      </span>
    );
  }
);

TextScramble.displayName = "TextScramble";

export default TextScramble;