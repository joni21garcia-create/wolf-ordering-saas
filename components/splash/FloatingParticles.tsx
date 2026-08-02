"use client";

import { useEffect, useState } from "react";

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

function generateParticles(): Particle[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 5,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 8,
    opacity: 0.08 + Math.random() * 0.35,
    blur: Math.random() * 2,
    glow: Math.random() > 0.65,
  }));
}

export default function FloatingParticles() {

  const [particles, setParticles] =
    useState<Particle[]>([]);

  useEffect(() => {

    setParticles(
      generateParticles()
    );

  }, []);

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