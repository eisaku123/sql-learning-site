"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#667eea", "#764ba2", "#34d399", "#fbbf24",
  "#f472b6", "#60a5fa", "#fb923c", "#a78bfa",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export default function Fireworks({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cw = canvas.width;
    const ch = canvas.height;

    const particles: Particle[] = [];

    function burst(x: number, y: number) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 70 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 1.5 + Math.random() * 5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          alpha: 1,
          color,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    }

    const schedule = [
      [cw * 0.2, ch * 0.25],
      [cw * 0.5, ch * 0.18],
      [cw * 0.8, ch * 0.25],
      [cw * 0.35, ch * 0.38],
      [cw * 0.65, ch * 0.32],
      [cw * 0.5, ch * 0.22],
      [cw * 0.15, ch * 0.42],
      [cw * 0.85, ch * 0.38],
    ];

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    schedule.forEach(([x, y], i) => {
      timeouts.push(setTimeout(() => burst(x, y), i * 240));
    });

    // Banner fades after 2.2s
    timeouts.push(setTimeout(() => setBannerVisible(false), 2200));

    const FADE_START = 2600;
    const FADE_DURATION = 1000;
    const startTime = Date.now();
    let animId: number;

    function draw() {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, cw, ch);

      const canvasAlpha =
        elapsed > FADE_START
          ? Math.max(0, 1 - (elapsed - FADE_START) / FADE_DURATION)
          : 1;

      let anyAlive = false;
      for (const p of particles) {
        if (p.alpha <= 0) continue;
        anyAlive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.alpha -= 0.014;

        ctx.globalAlpha = canvasAlpha * Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (canvasAlpha > 0 && (anyAlive || elapsed < FADE_START)) {
        animId = requestAnimationFrame(draw);
      } else {
        onDone();
      }
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      timeouts.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {bannerVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10000,
            textAlign: "center",
            pointerEvents: "none",
            animation: "fireworks-pop 0.5s cubic-bezier(0.17,0.89,0.32,1.28) forwards",
          }}
        >
          <div
            style={{
              fontSize: "3.5rem",
              marginBottom: "0.25rem",
              filter: "drop-shadow(0 0 20px rgba(102,126,234,0.8))",
            }}
          >
            🎉
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #667eea, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
            }}
          >
            全問正解！
          </div>
          <div
            style={{
              fontSize: "0.95rem",
              color: "#8888aa",
              marginTop: "0.5rem",
            }}
          >
            お見事です！次のレッスンへ進みましょう
          </div>
        </div>
      )}
      <style>{`
        @keyframes fireworks-pop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}
