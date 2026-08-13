"use client";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Store,
  Sparkles,
} from "lucide-react";

interface DiscoverBusinessCTAProps {
  onGetStarted?: () => void;
  defaultExpanded?: boolean;
}

const sectionStyle: CSSProperties = {
  position: "fixed",
  left: "max(12px, env(safe-area-inset-left))",
  right: "max(12px, env(safe-area-inset-right))",
  bottom: "calc(76px + env(safe-area-inset-bottom))",
  zIndex: 40,
  width: "auto",
  maxWidth: "560px",
  margin: "0 auto",
};

const panelStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  border: "1px solid rgba(249,115,22,0.27)",
  borderRadius: "20px",
  background:
    "linear-gradient(135deg, rgba(28,17,10,0.97), rgba(12,12,12,0.97))",
  boxShadow:
    "0 14px 42px rgba(0,0,0,0.46), 0 0 32px rgba(249,115,22,0.10)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const contentStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  minHeight: "82px",
  display: "grid",
  gridTemplateColumns: "42px minmax(0,1fr) auto",
  alignItems: "center",
  gap: "11px",
  padding: "13px 14px",
};

const glowStyle: CSSProperties = {
  position: "absolute",
  top: "-55px",
  right: "-35px",
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(249,115,22,0.22), transparent 68%)",
  filter: "blur(3px)",
  pointerEvents: "none",
  animation: "wolfBusinessGlow 3.8s ease-in-out infinite",
};

const shineStyle: CSSProperties = {
  position: "absolute",
  top: "-40%",
  bottom: "-40%",
  left: "-45%",
  width: "34%",
  transform: "skewX(-18deg)",
  background:
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
  pointerEvents: "none",
  animation: "wolfBusinessShine 5.5s ease-in-out infinite",
};

const iconStyle: CSSProperties = {
  position: "relative",
  width: "42px",
  height: "42px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(249,115,22,0.30)",
  borderRadius: "14px",
  background:
    "linear-gradient(145deg, rgba(249,115,22,0.17), rgba(249,115,22,0.06))",
  color: "#fb923c",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  animation: "wolfBusinessIcon 2.8s ease-in-out infinite",
};

const copyStyle: CSSProperties = {
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const eyebrowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  margin: 0,
  color: "rgba(255,255,255,0.42)",
  fontSize: "8px",
  lineHeight: 1.1,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: "13px",
  lineHeight: 1.2,
  fontWeight: 750,
  letterSpacing: "-0.015em",
  whiteSpace: "normal",
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.44)",
  fontSize: "9px",
  lineHeight: 1.2,
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const buttonStyle: CSSProperties = {
  position: "relative",
  minHeight: "38px",
  minWidth: "106px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  flexShrink: 0,
  overflow: "hidden",
  padding: "0 11px",
  border: "1px solid rgba(249,115,22,0.42)",
  borderRadius: "12px",
  background: "rgba(249,115,22,0.08)",
  color: "#fb923c",
  fontSize: "10px",
  lineHeight: 1,
  fontWeight: 750,
  cursor: "pointer",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  transition:
    "background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease",
  WebkitTapHighlightColor: "transparent",
};

const collapseButtonStyle: CSSProperties = {
  position: "absolute",
  top: "7px",
  right: "7px",
  width: "25px",
  height: "25px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 999,
  background: "rgba(255,255,255,0.045)",
  color: "rgba(255,255,255,0.48)",
  cursor: "pointer",
  zIndex: 4,
  WebkitTapHighlightColor: "transparent",
};

const collapsedStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  minHeight: "36px",
  padding: "0 12px",
  border: "1px solid rgba(249,115,22,0.30)",
  borderRadius: 999,
  background:
    "linear-gradient(135deg, rgba(28,17,10,0.96), rgba(12,12,12,0.96))",
  color: "rgba(255,255,255,0.82)",
  boxShadow:
    "0 10px 28px rgba(0,0,0,0.40), 0 0 20px rgba(249,115,22,0.09)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const styles = `
@keyframes wolfBusinessFloatIn {
  from {
    opacity: 0;
    transform: translateY(14px) scale(.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes wolfBusinessExpand {
  from {
    opacity: 0;
    transform: translateY(7px) scale(.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes wolfBusinessCollapse {
  from {
    opacity: 0;
    transform: translateY(5px) scale(.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes wolfBusinessGlow {
  0%, 100% {
    opacity: .55;
    transform: scale(.92);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes wolfBusinessShine {
  0%, 62% {
    transform: translateX(-145%) skewX(-18deg);
  }
  78%, 100% {
    transform: translateX(420%) skewX(-18deg);
  }
}

@keyframes wolfBusinessIcon {
  0%, 72%, 100% {
    transform: translateY(0);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 0 0 rgba(249,115,22,0);
  }
  80% {
    transform: translateY(-2px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 0 18px rgba(249,115,22,.18);
  }
}

.wolf-business-cta-panel {
  animation: wolfBusinessFloatIn 420ms cubic-bezier(.2,.8,.2,1) both;
}

.wolf-business-cta-collapsed {
  animation: wolfBusinessCollapse 260ms cubic-bezier(.2,.8,.2,1) both;
}

.wolf-business-cta-button:hover {
  background: rgba(249,115,22,0.14) !important;
  border-color: rgba(249,115,22,0.58) !important;
  color: #fff !important;
}

.wolf-business-cta-button:active,
.wolf-business-collapse:active,
.wolf-business-expand:active {
  transform: scale(.96);
}

.wolf-business-expand {
  transition:
    transform 160ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.wolf-business-expand:hover {
  border-color: rgba(249,115,22,.48) !important;
  background: rgba(249,115,22,.10) !important;
}

@media (prefers-reduced-motion: reduce) {
  .wolf-business-cta-panel,
  .wolf-business-cta-collapsed,
  .wolf-business-glow,
  .wolf-business-shine,
  .wolf-business-icon {
    animation: none !important;
  }

  .wolf-business-cta-button,
  .wolf-business-collapse,
  .wolf-business-expand {
    transition: none !important;
  }
}
`;

export default function DiscoverBusinessCTA({
  onGetStarted,
  defaultExpanded = true,
}: DiscoverBusinessCTAProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleGetStarted = () => {
    router.push("/restaurant/onboarding");
  };

  return (
    <>
      <style>{styles}</style>

      <section
        aria-label="Para restaurantes"
        style={sectionStyle}
      >
        {expanded ? (
          <div
            className="wolf-business-cta-panel"
            style={panelStyle}
          >
            <div
              className="wolf-business-glow"
              aria-hidden="true"
              style={glowStyle}
            />

            <div
              className="wolf-business-shine"
              aria-hidden="true"
              style={shineStyle}
            />

            <button
              type="button"
              aria-label="Ocultar promoción para restaurantes"
              className="wolf-business-collapse"
              onClick={() => setExpanded(false)}
              style={collapseButtonStyle}
            >
              <ChevronDown size={14} strokeWidth={2} />
            </button>

            <div style={contentStyle}>
              <span
                className="wolf-business-icon"
                aria-hidden="true"
                style={iconStyle}
              >
                <Store size={19} strokeWidth={1.9} />
              </span>

              <div style={copyStyle}>
                <p style={eyebrowStyle}>
                  <Sparkles size={9} strokeWidth={2} />
                  Para restaurantes
                </p>

                <h2 style={titleStyle}>
                  ¿Tienes un restaurante?
                </h2>

                <p style={descriptionStyle}>
                  Descubre cómo llevarlo a Wolf.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGetStarted}
                className="wolf-business-cta-button"
                style={buttonStyle}
              >
                <span>Activa tu App</span>
                <ArrowRight
                  size={14}
                  strokeWidth={2.1}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Mostrar información para restaurantes"
            aria-expanded={false}
            className="wolf-business-expand"
            onClick={() => setExpanded(true)}
            style={collapsedStyle}
          >
            <Store size={15} strokeWidth={1.9} />
            <span
              style={{
                fontSize: 9,
                lineHeight: 1,
                fontWeight: 750,
                letterSpacing: ".02em",
              }}
            >
              Para restaurantes
            </span>
            <span
              aria-hidden="true"
              style={{
                width: 5,
                height: 5,
                borderRadius: 999,
                background: "#f97316",
                boxShadow: "0 0 9px rgba(249,115,22,.55)",
              }}
            />
            <ChevronUp size={13} strokeWidth={2} />
          </button>
        )}
      </section>
    </>
  );
}