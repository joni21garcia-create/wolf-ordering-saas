"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

export interface WolfSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
  dismissible?: boolean;
  showCloseButton?: boolean;
  maxWidth?: number;
  tone?: "dark" | "light";
}

export default function WolfSheet({
  open,
  onClose,
  children,
  title,
  subtitle,
  ariaLabel = "Panel",
  dismissible = true,
  showCloseButton = true,
  maxWidth = 520,
  tone = "dark",
}: WolfSheetProps) {
  const dragStartY = useRef<number | null>(null);
  const dragStartTime = useRef(0);
  const dragging = useRef(false);
  const historyPushed = useRef(false);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const light = tone === "light";

  useEffect(() => {
    if (!open || !dismissible) return;

    window.history.pushState(
      {
        ...(window.history.state ?? {}),
        wolfSheet: true,
      },
      "",
      window.location.href,
    );

    historyPushed.current = true;

    const handlePopState = () => {
      historyPushed.current = false;
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [open, dismissible, onClose]);

  useEffect(() => {
    if (!open || !dismissible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, dismissible, onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [open]);

  const closeSheet = useCallback(() => {
    if (!dismissible) return;

    if (historyPushed.current) {
      historyPushed.current = false;
      window.history.back();
      return;
    }

    onClose();
  }, [dismissible, onClose]);

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!dismissible) return;

    if (
      event.pointerType !== "touch" &&
      event.pointerType !== "pen"
    ) {
      return;
    }

    dragStartY.current = event.clientY;
    dragStartTime.current = performance.now();
    dragging.current = false;

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const start = dragStartY.current;

    if (start === null) return;

    const delta = event.clientY - start;

    if (delta <= 0) return;

    if (!dragging.current && delta < 6) return;

    dragging.current = true;
    setIsDragging(true);

    const resistance = delta < 120 ? 0.82 : 0.55;
    setDragY(Math.min(420, delta * resistance));
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const start = dragStartY.current;

    if (start === null) return;

    const delta = Math.max(0, event.clientY - start);
    const elapsed = Math.max(
      1,
      performance.now() - dragStartTime.current,
    );
    const velocity = delta / elapsed;

    dragStartY.current = null;
    dragging.current = false;
    setIsDragging(false);

    if (delta > 110 || velocity > 0.65) {
      setDragY(0);
      closeSheet();
      return;
    }

    setDragY(0);
  };

  const handlePointerCancel = () => {
    dragStartY.current = null;
    dragging.current = false;
    setIsDragging(false);
    setDragY(0);
  };

  if (!open) return null;

  const backdropOpacity = Math.max(0.08, 1 - dragY / 520);

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={closeSheet}
        className="absolute inset-0 border-0 p-0"
        style={{
          background: `rgba(0,0,0,${0.32 * backdropOpacity})`,
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
      />

      <aside
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth,
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: light ? "#FFFFFF" : "#0D0D0F",
          color: light ? "#18181B" : "#FFFFFF",
          boxShadow: light
            ? "-18px 0 60px rgba(0,0,0,.16)"
            : "-18px 0 60px rgba(0,0,0,.28)",
          transform: `translate3d(0, ${dragY}px, 0)`,
          transition: isDragging
            ? "none"
            : "transform 260ms cubic-bezier(.22,1,.36,1)",
          willChange: "transform",
          overflow: "hidden",
          touchAction: "pan-y",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            flexShrink: 0,
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 42,
                height: 4,
                borderRadius: 999,
                background: light
                  ? "rgba(24,24,27,.18)"
                  : "rgba(255,255,255,.22)",
              }}
            />
          </div>

          <div
            style={{
              minHeight: 64,
              padding: "0 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              borderBottom: light
                ? "1px solid rgba(24,24,27,.07)"
                : "1px solid rgba(255,255,255,.07)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              {title && (
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-.02em",
                    color: light ? "#18181B" : "#FFFFFF",
                  }}
                >
                  {title}
                </div>
              )}

              {subtitle && (
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11,
                    color: light
                      ? "#A1A1AA"
                      : "rgba(255,255,255,.42)",
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Cerrar"
                style={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: light
                    ? "1px solid rgba(24,24,27,.08)"
                    : "1px solid rgba(255,255,255,.08)",
                  borderRadius: "50%",
                  background: light
                    ? "#F4F4F5"
                    : "rgba(255,255,255,.07)",
                  color: light
                    ? "#52525B"
                    : "#FFFFFF",
                  fontSize: 25,
                  lineHeight: 1,
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "contain",
            touchAction: "pan-y",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {children}
        </div>
      </aside>
    </div>
  );
}