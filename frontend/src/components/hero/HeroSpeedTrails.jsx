"use client";

import { useEffect, useRef } from "react";

export default function HeroSpeedTrails() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isTouchDevice) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    window.addEventListener("resize", resize);

    let particles = [];

    let mouseX = null;
    let mouseY = null;

    let velocityX = 0;
    let velocityY = 0;

    let rafId = null;
    let running = false;

    /*
     * ------------------------------------------------------------
     * AERODYNAMIC PARTICLE
     * ------------------------------------------------------------
     *
     * Each particle is not a simple line.
     *
     * It behaves more like a tiny airflow filament:
     *
     *      cursor  ---> velocity
     *                 \________
     *                   \_______
     *
     * It stretches according to velocity and slowly loses energy.
     */

    function createParticle(x, y, vx, vy, speed) {
      const angle = Math.atan2(vy, vx);

      const normalizedSpeed = Math.min(speed, 65);

      const length =
        70 +
        normalizedSpeed * 3.4 +
        Math.random() * 45;

      const spread =
        (Math.random() - 0.5) *
        (0.18 + normalizedSpeed * 0.002);

      return {
        x,
        y,

        angle: angle + spread,

        length,

        width:
          1.4 +
          Math.random() * 2.4 +
          normalizedSpeed * 0.025,

        life: 1,

        decay:
          0.018 +
          Math.random() * 0.012,

        curvature:
          (Math.random() - 0.5) *
          (8 + normalizedSpeed * 0.18),

        phase:
          Math.random() * Math.PI * 2,

        frequency:
          0.012 +
          Math.random() * 0.018,

        opacity:
          0.25 +
          Math.random() * 0.25,

        /*
         * Red is intentionally extremely rare.
         * It behaves more like a reflected rear-light accent
         * than a neon effect.
         */
        accent: Math.random() < 0.055,
      };
    }

    function spawnAirflow(x, y, vx, vy, speed) {
      if (speed < 4) return;

      const normalizedSpeed = Math.min(speed, 65);

      /*
       * The faster the cursor moves,
       * the denser the airflow becomes.
       */
      let count = 1;

      if (normalizedSpeed > 16) count = 2;
      if (normalizedSpeed > 32) count = 3;
      if (normalizedSpeed > 50) count = 4;

      for (let i = 0; i < count; i++) {
        /*
         * Spread particles around the cursor.
         * This creates the impression of air being displaced
         * around an object rather than lines being emitted
         * from the mouse pointer.
         */
        const offset =
          (Math.random() - 0.5) *
          (10 + normalizedSpeed * 0.35);

        const perpendicularX = -vy;
        const perpendicularY = vx;

        const magnitude = Math.max(
          Math.hypot(perpendicularX, perpendicularY),
          0.001
        );

        const ox =
          (perpendicularX / magnitude) * offset;

        const oy =
          (perpendicularY / magnitude) * offset;

        particles.push(
          createParticle(
            x + ox,
            y + oy,
            vx,
            vy,
            normalizedSpeed
          )
        );
      }

      /*
       * Safety limit for low-spec machines.
       */
      if (particles.length > 120) {
        particles.splice(
          0,
          particles.length - 120
        );
      }
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (mouseX !== null) {
        const dx = x - mouseX;
        const dy = y - mouseY;

        const distance = Math.hypot(dx, dy);

        /*
         * Smooth the velocity rather than directly using
         * mouse movement. This gives the trail a more
         * physical aerodynamic response.
         */
        velocityX =
          velocityX * 0.72 +
          dx * 0.28;

        velocityY =
          velocityY * 0.72 +
          dy * 0.28;

        const speed = Math.hypot(
          velocityX,
          velocityY
        );

        if (distance > 2.5) {
          spawnAirflow(
            x,
            y,
            velocityX,
            velocityY,
            speed
          );
        }

        if (!running && particles.length > 0) {
          running = true;
          rafId = requestAnimationFrame(render);
        }
      }

      mouseX = x;
      mouseY = y;
    }

    function drawAirflow(p) {
      const life = p.life;

      /*
       * The airflow becomes shorter as it loses energy.
       */
      const currentLength =
        p.length *
        (0.45 + life * 0.55);

      const cos = Math.cos(p.angle);
      const sin = Math.sin(p.angle);

      const headX = p.x;
      const headY = p.y;

      /*
       * Construct a curved path.
       *
       * This is the important part:
       * the trail is NOT a straight line.
       */
      const tailX =
        headX -
        cos * currentLength;

      const tailY =
        headY -
        sin * currentLength;

      const normalX = -sin;
      const normalY = cos;

      const curveAmount =
        p.curvature *
        Math.sin(
          p.phase +
          (1 - life) * 5
        );

      const controlX =
        headX -
        cos * currentLength * 0.52 +
        normalX * curveAmount;

      const controlY =
        headY -
        sin * currentLength * 0.52 +
        normalY * curveAmount;

      const color = p.accent
        ? "225, 6, 0"
        : "242, 242, 239";

      /*
       * ----------------------------------------------------------
       * OUTER AIRFLOW
       * ----------------------------------------------------------
       *
       * Large, soft layer.
       *
       * This makes the effect feel like atmospheric airflow
       * instead of a literal glowing line.
       */
      const outerGradient =
        ctx.createLinearGradient(
          headX,
          headY,
          tailX,
          tailY
        );

      outerGradient.addColorStop(
        0,
        `rgba(${color}, ${p.opacity * life * 0.22})`
      );

      outerGradient.addColorStop(
        0.25,
        `rgba(${color}, ${p.opacity * life * 0.10})`
      );

      outerGradient.addColorStop(
        0.7,
        `rgba(${color}, ${p.opacity * life * 0.025})`
      );

      outerGradient.addColorStop(
        1,
        `rgba(${color}, 0)`
      );

      ctx.beginPath();

      ctx.moveTo(headX, headY);

      ctx.quadraticCurveTo(
        controlX,
        controlY,
        tailX,
        tailY
      );

      ctx.strokeStyle = outerGradient;

      ctx.lineWidth =
        p.width * 5.5;

      ctx.lineCap = "round";

      ctx.stroke();

      /*
       * ----------------------------------------------------------
       * INNER AIRFLOW
       * ----------------------------------------------------------
       *
       * Sharper central filament.
       */
      const innerGradient =
        ctx.createLinearGradient(
          headX,
          headY,
          tailX,
          tailY
        );

      innerGradient.addColorStop(
        0,
        `rgba(${color}, ${p.opacity * life})`
      );

      innerGradient.addColorStop(
        0.12,
        `rgba(${color}, ${p.opacity * life * 0.72})`
      );

      innerGradient.addColorStop(
        0.42,
        `rgba(${color}, ${p.opacity * life * 0.30})`
      );

      innerGradient.addColorStop(
        0.78,
        `rgba(${color}, ${p.opacity * life * 0.07})`
      );

      innerGradient.addColorStop(
        1,
        `rgba(${color}, 0)`
      );

      ctx.beginPath();

      ctx.moveTo(headX, headY);

      ctx.quadraticCurveTo(
        controlX,
        controlY,
        tailX,
        tailY
      );

      ctx.strokeStyle = innerGradient;

      ctx.lineWidth = p.width;

      ctx.lineCap = "round";

      ctx.stroke();
    }

    function render() {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        /*
         * Airflow drifts slightly backwards.
         */
        p.x -= Math.cos(p.angle) * 0.55;
        p.y -= Math.sin(p.angle) * 0.55;

        /*
         * Gentle lateral movement creates natural
         * aerodynamic turbulence.
         */
        p.phase += p.frequency;

        drawAirflow(p);

        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        rafId = requestAnimationFrame(render);
      } else {
        running = false;

        ctx.clearRect(
          0,
          0,
          width,
          height
        );
      }
    }

    // Disabled cursor trails effect for cleaner UX
    // window.addEventListener(
    //   "mousemove",
    //   handleMouseMove
    // );

    return () => {
      // window.removeEventListener(
      //   "mousemove",
      //   handleMouseMove
      // );

      window.removeEventListener(
        "resize",
        resize
      );

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      particles = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[15] pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}