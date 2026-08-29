"use client";

import { CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import { useMemo } from "react";

type RestaurantLike = {
  id?: string;
  slug?: string;
  name?: string;
  primary_color?: string | null;
  themeSettings?: {
    primary_color?: string | null;
  } | null;
};

interface Props {
  restaurant?: RestaurantLike | null;
  slug?: string;
  restaurantId?: string;
  enabled?: boolean;
  label?: string;
}

function normalizeHex(value?: string | null, fallback = "#f97316") {
  const candidate = String(value ?? "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(candidate) ? candidate : fallback;
}

export default function FloatingReservationButton({
  restaurant,
  slug,
  restaurantId,
  enabled = true,
  label = "Reservar",
}: Props) {
  if (!enabled) return null;

  const target = slug ?? restaurant?.slug ?? restaurantId ?? restaurant?.id;
  if (!target) return null;

  const accent = normalizeHex(
    restaurant?.themeSettings?.primary_color ?? restaurant?.primary_color,
  );

  const href = `/reserve/${encodeURIComponent(target)}`;

  const css = useMemo(
    () =>
      ({
        "--wolf-reserve-accent": accent,
      }) as React.CSSProperties,
    [accent],
  );

  return (
    <a
      href={href}
      className="wolf-reserve-float"
      style={css}
      aria-label={`${label}${restaurant?.name ? ` en ${restaurant.name}` : ""}`}
    >
      <span className="wolf-reserve-orbit" aria-hidden="true" />
      <span className="wolf-reserve-sheen" aria-hidden="true" />

      <span className="wolf-reserve-icon">
        <CalendarDays size={15} strokeWidth={1.8} />
      </span>

      <span className="wolf-reserve-copy">
        <strong>{label}</strong>
      </span>

      <span className="wolf-reserve-arrow">
        <ChevronRight size={13} strokeWidth={2} />
      </span>

      <span className="wolf-reserve-spark" aria-hidden="true">
        <Sparkles size={7} strokeWidth={1.8} />
      </span>

      <style jsx>{`
        .wolf-reserve-float {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 90;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 42px;
          padding: 4px 6px 4px 5px;
          border: 1px solid color-mix(
            in srgb,
            var(--wolf-reserve-accent) 36%,
            rgba(255,255,255,.09)
          );
          border-radius: 13px;
          color: #fff;
          text-decoration: none;
          background:
            linear-gradient(
              135deg,
              color-mix(
                in srgb,
                var(--wolf-reserve-accent) 11%,
                rgba(7,8,10,.93)
              ),
              rgba(11,13,17,.94)
            );
          box-shadow:
            0 10px 28px rgba(0,0,0,.27),
            0 0 0 1px rgba(255,255,255,.02);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          overflow: hidden;
          isolation: isolate;
          transition:
            transform .24s ease,
            border-color .24s ease,
            box-shadow .24s ease;
        }

        .wolf-reserve-float:hover {
          transform: translateY(-3px);
          border-color: color-mix(
            in srgb,
            var(--wolf-reserve-accent) 65%,
            rgba(255,255,255,.1)
          );
          box-shadow:
            0 14px 34px rgba(0,0,0,.31),
            0 0 24px color-mix(
              in srgb,
              var(--wolf-reserve-accent) 16%,
              transparent
            );
        }

        .wolf-reserve-float:active {
          transform: translateY(-1px) scale(.985);
        }

        .wolf-reserve-orbit {
          position: absolute;
          inset: -1px;
          z-index: -1;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 228deg,
            var(--wolf-reserve-accent) 266deg,
            transparent 302deg,
            transparent 360deg
          );
          opacity: .68;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          animation: wolfReserveOrbit 5.8s linear infinite;
          pointer-events: none;
        }

        .wolf-reserve-sheen {
          position: absolute;
          width: 70px;
          height: 9px;
          left: -72px;
          top: 0;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(
              in srgb,
              var(--wolf-reserve-accent) 72%,
              transparent
            ),
            transparent
          );
          filter: blur(7px);
          opacity: .42;
          transform: rotate(24deg);
          animation: wolfReserveSheen 4.4s ease-in-out infinite;
          pointer-events: none;
        }

        .wolf-reserve-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid color-mix(
            in srgb,
            var(--wolf-reserve-accent) 38%,
            rgba(255,255,255,.08)
          );
          border-radius: 9px;
          color: var(--wolf-reserve-accent);
          background: color-mix(
            in srgb,
            var(--wolf-reserve-accent) 9%,
            rgba(255,255,255,.02)
          );
          transition:
            color .22s ease,
            border-color .22s ease,
            transform .22s ease;
        }

        .wolf-reserve-float:hover .wolf-reserve-icon {
          color: #fff;
          border-color: var(--wolf-reserve-accent);
          transform: rotate(-3deg) scale(1.03);
        }

        .wolf-reserve-copy {
          min-width: auto;
          display: block;
        }

        .wolf-reserve-copy strong {
          color: #fff;
          font-size: 9px;
          line-height: 1;
          font-weight: 820;
          letter-spacing: -.01em;
          white-space: nowrap;
        }

        .wolf-reserve-arrow {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 7px;
          background: color-mix(
            in srgb,
            var(--wolf-reserve-accent) 13%,
            transparent
          );
          color: var(--wolf-reserve-accent);
          transition:
            transform .22s ease,
            background .22s ease;
        }

        .wolf-reserve-float:hover .wolf-reserve-arrow {
          transform: translateX(2px);
          background: color-mix(
            in srgb,
            var(--wolf-reserve-accent) 20%,
            transparent
          );
        }

        .wolf-reserve-spark {
          position: absolute;
          top: 3px;
          right: 29px;
          width: 12px;
          height: 12px;
          display: grid;
          place-items: center;
          color: var(--wolf-reserve-accent);
          filter: drop-shadow(
            0 0 5px color-mix(
              in srgb,
              var(--wolf-reserve-accent) 70%,
              transparent
            )
          );
          opacity: .76;
          animation: wolfReserveSpark 2.8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes wolfReserveOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wolfReserveSheen {
          0%, 28% {
            transform: translateX(0) rotate(24deg);
            opacity: 0;
          }
          45% { opacity: .52; }
          60%, 100% {
            transform: translateX(185px) rotate(24deg);
            opacity: 0;
          }
        }

        @keyframes wolfReserveSpark {
          0%, 100% {
            transform: translateY(0) scale(.86);
            opacity: .34;
          }
          50% {
            transform: translateY(-2px) scale(1);
            opacity: .9;
          }
        }

        @media (max-width: 560px) {
          .wolf-reserve-float {
            right: 12px;
            bottom: 12px;
            min-height: 40px;
            gap: 6px;
            padding: 3px 5px 3px 4px;
            border-radius: 12px;
          }

          .wolf-reserve-icon {
            width: 29px;
            height: 29px;
            border-radius: 8px;
          }

          .wolf-reserve-copy strong {
            font-size: 8.5px;
          }

          .wolf-reserve-arrow {
            width: 21px;
            height: 21px;
            border-radius: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wolf-reserve-orbit,
          .wolf-reserve-sheen,
          .wolf-reserve-spark {
            animation: none !important;
          }

          .wolf-reserve-float,
          .wolf-reserve-icon,
          .wolf-reserve-arrow {
            transition: none !important;
          }
        }
      `}</style>
    </a>
  );
}
