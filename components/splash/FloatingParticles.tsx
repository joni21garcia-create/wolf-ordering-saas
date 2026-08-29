"use client";

import { useMemo } from "react";

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  blur: number;
  glow: boolean;
}

function seeded01(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateParticles(): Particle[] {
  return Array.from({ length: 30 }, (_, i) => {
    const r1 = seeded01(i + 1);
    const r2 = seeded01(i + 101);
    const r3 = seeded01(i + 201);
    const r4 = seeded01(i + 301);
    const r5 = seeded01(i + 401);
    const r6 = seeded01(i + 501);

    return {
      id: i,
      left: r1 * 100,
      top: r2 * 100,
      size: 1 + r3 * 5,
      duration: 10 + r4 * 10,
      delay: r5 * 8,
      opacity: 0.08 + r6 * 0.35,
      blur: seeded01(i + 601) * 2,
      glow: seeded01(i + 701) > 0.65,
    };
  });
}

export default function FloatingParticles() {
  /*
   * The particle layout is deterministic on both SSR and the client.
   * This avoids hydration mismatches caused by Math.random().
   */
  const particles = useMemo(
    () => generateParticles(),
    []
  );

  return (

    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {particles.map((p) => (

        <span
          key={p.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            background:
              "radial-gradient(circle,#ffd28a 0%,#fb923c 55%,rgba(251,146,60,.15) 100%)",
            boxShadow: p.glow
              ? "0 0 12px rgba(249,115,22,.85)"
              : "0 0 4px rgba(249,115,22,.35)",
          }}
        />

      ))}

    </div>

  );

}