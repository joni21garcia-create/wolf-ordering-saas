"use client";

import { useEffect, useState } from "react";

type Particle = {
  left: number;
  top: number;
  duration: number;
  delay: number;
};

export default function ParticlesBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 60 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 25 + Math.random() * 25,
        delay: Math.random() * 10,
      }))
    );
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="wolf-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}