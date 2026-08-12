"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { MapPin, UserRound, Sparkles } from "lucide-react";

interface DiscoverHeaderProps {
  city?: string;
  onProfileClick?: () => void;
}

interface LocationResult {
  city: string;
  country?: string;
}

const LOCATION_CACHE_KEY = "wolf-discover-location";
const LOCATION_CACHE_TTL = 30 * 60 * 1000;

const headerStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const topRowStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
};

const logoWrapStyle: CSSProperties = {
  position: "relative",
  width: "38px",
  height: "38px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: "13px",
  background:
    "radial-gradient(circle at 50% 45%, rgba(249,115,22,0.16), rgba(249,115,22,0.035) 58%, transparent 72%)",
  animation: "wolfLogoFloat 3.8s ease-in-out infinite",
};

const logoGlowStyle: CSSProperties = {
  position: "absolute",
  inset: "7px",
  borderRadius: "50%",
  background: "rgba(249,115,22,0.24)",
  filter: "blur(10px)",
  animation: "wolfLogoGlow 2.8s ease-in-out infinite",
  pointerEvents: "none",
};

const logoStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  width: "35px",
  height: "35px",
  objectFit: "contain",
  flexShrink: 0,
  filter: "drop-shadow(0 0 8px rgba(249,115,22,0.24))",
  animation: "wolfLogoPulse 3.8s ease-in-out infinite",
};

const brandCopyStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const brandTextStyle: CSSProperties = {
  position: "relative",
  width: "fit-content",
  margin: 0,
  color: "#ffffff",
  fontSize: "19px",
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.045em",
  textShadow: "0 0 20px rgba(249,115,22,0.12)",
};

const brandAccentStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: "-5px",
  width: "18px",
  height: "2px",
  borderRadius: "999px",
  background:
    "linear-gradient(90deg, #f97316, rgba(249,115,22,0))",
  animation: "wolfBrandAccent 3s ease-in-out infinite",
};

const locationStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  minWidth: 0,
  marginTop: "7px",
  color: "rgba(255,255,255,0.56)",
  fontSize: "11px",
  lineHeight: 1.2,
  fontWeight: 500,
};

const profileButtonStyle: CSSProperties = {
  position: "relative",
  minWidth: "44px",
  height: "44px",
  padding: "0 15px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  flexShrink: 0,
  overflow: "hidden",
  border: "1px solid rgba(249,115,22,0.28)",
  borderRadius: "15px",
  background:
    "linear-gradient(135deg, rgba(249,115,22,0.22), rgba(255,255,255,0.055) 48%, rgba(255,255,255,0.025))",
  color: "#ffffff",
  cursor: "pointer",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 30px rgba(0,0,0,0.24), 0 0 24px rgba(249,115,22,0.07)",
  transition:
    "transform 180ms cubic-bezier(.22,1,.36,1), border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
  WebkitTapHighlightColor: "transparent",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  margin: 0,
  color: "rgba(255,255,255,0.58)",
  fontSize: "13px",
  lineHeight: 1.4,
  fontWeight: 600,
};

const titleStyle: CSSProperties = {
  margin: "5px 0 0",
  maxWidth: "620px",
  color: "#ffffff",
  fontSize: "clamp(30px, 7.5vw, 44px)",
  lineHeight: 1.02,
  fontWeight: 850,
  letterSpacing: "-0.05em",
  textShadow:
    "0 1px 0 rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.22)",
};

const styles = `
@keyframes wolfLogoFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-2px) rotate(-1deg);
  }
}

@keyframes wolfLogoGlow {
  0%, 100% {
    opacity: .45;
    transform: scale(.88);
  }
  50% {
    opacity: .9;
    transform: scale(1.08);
  }
}

@keyframes wolfLogoPulse {
  0%, 72%, 100% {
    transform: scale(1);
  }
  78% {
    transform: scale(1.055);
  }
  84% {
    transform: scale(1);
  }
}

@keyframes wolfBrandAccent {
  0%, 100% {
    width: 14px;
    opacity: .45;
  }
  50% {
    width: 28px;
    opacity: 1;
  }
}

@keyframes wolfLocationPulse {
  0%, 100% {
    opacity: .48;
  }
  50% {
    opacity: .82;
  }
}

.wolf-profile-button::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 13px;
  background:
    linear-gradient(
      110deg,
      transparent 20%,
      rgba(255,255,255,.16) 42%,
      rgba(255,255,255,.34) 50%,
      rgba(255,255,255,.10) 58%,
      transparent 80%
    );
  transform: translateX(-130%);
  transition: transform 650ms cubic-bezier(.22,1,.36,1);
  pointer-events: none;
}

.wolf-profile-button::after {
  content: "";
  position: absolute;
  width: 62px;
  height: 62px;
  right: -28px;
  top: -32px;
  border-radius: 50%;
  background: rgba(249,115,22,.18);
  filter: blur(16px);
  opacity: .7;
  pointer-events: none;
  transition: opacity 220ms ease, transform 220ms ease;
}

.wolf-profile-button:hover {
  border-color: rgba(249,115,22,0.62);
  background:
    linear-gradient(135deg, rgba(249,115,22,0.32), rgba(255,255,255,0.075) 52%, rgba(255,255,255,0.035));
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.16),
    0 14px 34px rgba(0,0,0,0.28),
    0 0 28px rgba(249,115,22,0.14);
}

.wolf-profile-button:hover::before {
  transform: translateX(130%);
}

.wolf-profile-button:hover::after {
  opacity: 1;
  transform: scale(1.18);
}

.wolf-profile-button:active {
  transform: translateY(0) scale(.96);
}

.wolf-profile-button svg,
.wolf-login-label {
  position: relative;
  z-index: 2;
}

.wolf-login-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

@media (max-width: 520px) {
  .wolf-profile-button {
    width: 44px !important;
    min-width: 44px !important;
    padding: 0 !important;
    gap: 0 !important;
  }

  .wolf-login-label {
    display: none;
  }
}

.wolf-location-loading {
  animation: wolfLocationPulse 1.4s ease-in-out infinite;
}

@media (max-width: 380px) {
  .wolf-brand-text {
    font-size: 18px !important;
  }

  .wolf-title {
    font-size: 29px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wolf-logo-wrap,
  .wolf-logo-glow,
  .wolf-logo,
  .wolf-brand-accent,
  .wolf-location-loading {
    animation: none !important;
  }
}
`;

function readCachedLocation(fallback: string): LocationResult {
  if (typeof window === "undefined") {
    return { city: fallback };
  }

  try {
    const raw = window.localStorage.getItem(LOCATION_CACHE_KEY);

    if (!raw) {
      return { city: fallback };
    }

    const cached = JSON.parse(raw) as {
      city?: string;
      country?: string;
      timestamp?: number;
    };

    if (
      !cached.city ||
      !cached.timestamp ||
      Date.now() - cached.timestamp > LOCATION_CACHE_TTL
    ) {
      return { city: fallback };
    }

    return {
      city: cached.city,
      country: cached.country,
    };
  } catch {
    return { city: fallback };
  }
}

async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal: AbortSignal,
): Promise<LocationResult | null> {
  const url = new URL(
    "https://api.bigdatacloud.net/data/reverse-geocode-client",
  );

  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "es");

  const response = await fetch(url.toString(), {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la ubicación.");
  }

  const data = (await response.json()) as {
    city?: string;
    locality?: string;
    principalSubdivision?: string;
    countryName?: string;
  };

  const city =
    data.city?.trim() ||
    data.locality?.trim() ||
    data.principalSubdivision?.trim();

  if (!city) {
    return null;
  }

  return {
    city,
    country: data.countryName,
  };
}

function saveLocation(location: LocationResult) {
  try {
    window.localStorage.setItem(
      LOCATION_CACHE_KEY,
      JSON.stringify({
        ...location,
        timestamp: Date.now(),
      }),
    );
  } catch {
    // localStorage puede estar bloqueado; no afecta Discover.
  }
}

export default function DiscoverHeader({
  city = "Cuenca",
  onProfileClick,
}: DiscoverHeaderProps) {
  const router = useRouter();

  const [currentCity, setCurrentCity] = useState(() => {
    return readCachedLocation(city).city;
  });

  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const cached = readCachedLocation(city);

    if (cached.city !== city) {
      setCurrentCity(cached.city);
    }

    const requestLocation = () => {
      setLocating(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (cancelled) return;

          try {
            const result = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
              controller.signal,
            );

            if (!result || cancelled) {
              return;
            }

            setCurrentCity(result.city);
            saveLocation(result);
          } catch (error) {
            if (
              error instanceof DOMException &&
              error.name === "AbortError"
            ) {
              return;
            }

            // Si reverse geocoding falla, conservamos el último valor.
          } finally {
            if (!cancelled) {
              setLocating(false);
            }
          }
        },
        () => {
          if (!cancelled) {
            setLocating(false);
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 9000,
          maximumAge: 5 * 60 * 1000,
        },
      );
    };

    requestLocation();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [city]);

  const handleLoginClick = () => {
    if (onProfileClick) {
      onProfileClick();
      return;
    }

    router.push("/login");
  };

  return (
    <>
      <style>{styles}</style>

      <header style={headerStyle}>
        <div style={topRowStyle}>
          <div style={brandStyle}>
            <span
              className="wolf-logo-wrap"
              style={logoWrapStyle}
              aria-hidden="true"
            >
              <span
                className="wolf-logo-glow"
                style={logoGlowStyle}
              />

              <img
                className="wolf-logo"
                src="/wolf-log.png"
                alt=""
                style={logoStyle}
              />
            </span>

            <div style={brandCopyStyle}>
              <p
                className="wolf-brand-text"
                style={brandTextStyle}
              >
                WOLF
                <span
                  className="wolf-brand-accent"
                  style={brandAccentStyle}
                />
              </p>

              <span
                className={locating ? "wolf-location-loading" : undefined}
                style={locationStyle}
                aria-live="polite"
              >
                <MapPin
                  size={12}
                  strokeWidth={2.1}
                  aria-hidden="true"
                />

                <span>
                  {locating ? "Ubicando..." : currentCity}
                </span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLoginClick}
            className="wolf-profile-button"
            style={profileButtonStyle}
            aria-label="Iniciar sesión"
            title="Iniciar sesión"
          >
            <UserRound
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span className="wolf-login-label">
              Iniciar sesión
            </span>
          </button>
        </div>

        <div>
          <p style={eyebrowStyle}>
            <Sparkles
              size={12}
              strokeWidth={1.8}
              aria-hidden="true"
              style={{ color: "#f97316" }}
            />
            Todo lo que quieres, más cerca.
          </p>

          <h1
            className="wolf-title"
            style={titleStyle}
          >
            ¿Qué quieres comer hoy?
          </h1>
        </div>
      </header>
    </>
  );
}