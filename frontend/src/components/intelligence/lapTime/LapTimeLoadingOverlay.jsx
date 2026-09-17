"use client";

import { useEffect, useRef, useState } from "react";

const STRAND_COUNT = 22;
const COLORS = ["#c1e8ff", "#7da0ca", "#5483b3", "#e10600", "#ff6b61"];
const DURATION = 4600;

export default function LapTimeLoadingOverlay({ active }) {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(active);
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (active) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [active]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function handleResize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    window.addEventListener("resize", handleResize);

    const strands = Array.from({ length: STRAND_COUNT }).map((_, i) => ({
      startY: Math.random() * height, endY: Math.random() * height,
      phase: Math.random() * Math.PI * 2, freq: 0.5 + Math.random() * 0.7, amp: 30 + Math.random() * 50,
      jitterSeed: Math.random() * Math.PI * 2, color: COLORS[i % COLORS.length], thick: Math.random() < 0.2,
    }));

    let rafId;
    const start = performance.now();

    function draw(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      const converge = Math.sin(t * Math.PI);
      const chaos = Math.pow(Math.sin(t * Math.PI), 3);

      ctx.fillStyle = "rgba(2,16,36,0.3)";
      ctx.fillRect(0, 0, width, height);
      const centerX = width / 2, centerY = height / 2;

      strands.forEach((s) => {
        const wobble = Math.sin(t * Math.PI * 2 * s.freq + s.phase) * s.amp * (0.6 + chaos * 0.8);
        const jitter1 = Math.sin(now * 0.006 + s.jitterSeed) * 40 * chaos;
        const jitter2 = Math.cos(now * 0.007 + s.jitterSeed) * 40 * chaos;
        const midY1 = s.startY + (centerY - s.startY) * converge + wobble + jitter1;
        const midY2 = s.endY + (centerY - s.endY) * converge - wobble + jitter2;

        ctx.beginPath();
        ctx.moveTo(0, s.startY);
        ctx.bezierCurveTo(centerX * 0.5, midY1, centerX * 1.5, midY2, width, s.endY);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 0.4 + converge * 0.35 + chaos * 0.15;
        ctx.lineWidth = (s.thick ? 2.4 : 1.3) + chaos * 1.5;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10 + chaos * 26 + converge * 6;
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      const pulse = 5 + chaos * 16;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#e10600";
      ctx.shadowColor = "#e10600";
      ctx.shadowBlur = 30;
      ctx.fill();

      if (elapsed < DURATION + 400) rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", handleResize); };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-500" style={{ background: "#010817", opacity: visible ? 1 : 0 }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-xs tracking-[0.35em]" style={{ color: "#7da0ca", fontFamily: "var(--font-technical)" }}>FEATURE VECTOR ASSEMBLED</p>
        <p className="mt-3 text-lg tracking-[0.15em]" style={{ color: "#c1e8ff", fontFamily: "var(--font-display)" }}>RUNNING XGBOOST REGRESSOR</p>
      </div>
    </div>
  );
}