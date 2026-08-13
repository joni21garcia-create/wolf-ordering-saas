"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

interface WolfSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;

  title?: string;
  ariaLabel?: string;

  /**
   * Si está activo:
   * - tocar fuera cierra
   * - gesto hacia abajo cierra
   * - botón Back de Android cierra
   * - Escape cierra en navegador
   */
  dismissible?: boolean;

  /**
   * Mostrar el botón X del header.
   */
  showCloseButton?: boolean;

  /**
   * Ancho máximo en desktop.
   */
  maxWidth?: number;
}

export default function WolfSheet({
  open,
  onClose,
  children,
  title,
  ariaLabel = "Panel",
  dismissible = true,
  showCloseButton = true,
  maxWidth = 520,
}: WolfSheetProps) {
  const sheetRef =
    useRef<HTMLElement | null>(null);

  const dragStartY =
    useRef<number | null>(null);

  const dragStartTime =
    useRef(0);

  const dragging =
    useRef(false);

  const historyPushed =
    useRef(false);

  const [dragY, setDragY] =
    useState(0);

  const [isDragging, setIsDragging] =
    useState(false);

  /*
  ==========================================================
  ANDROID / BROWSER BACK
  ==========================================================
  */

  useEffect(() => {
    if (!open || !dismissible) return;

    /*
     * Creamos una entrada temporal en el historial.
     *
     * Así, cuando Android pulsa "Atrás", recibimos popstate
     * y cerramos primero el Sheet en lugar de abandonar la
     * pantalla actual.
     */
    const state = {
      ...(window.history.state ?? {}),
      wolfSheet: true,
    };

    window.history.pushState(
      state,
      "",
      window.location.href
    );

    historyPushed.current = true;

    const handlePopState = () => {
      historyPushed.current = false;
      onClose();
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [open, dismissible, onClose]);

  /*
  ==========================================================
  ESCAPE
  ==========================================================
  */

  useEffect(() => {
    if (!open || !dismissible) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, dismissible, onClose]);

  /*
  ==========================================================
  BODY SCROLL LOCK
  ==========================================================
  */

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    const previousTouchAction =
      document.body.style.touchAction;

    document.body.style.overflow =
      "hidden";

    document.body.style.touchAction =
      "none";

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.body.style.touchAction =
        previousTouchAction;
    };
  }, [open]);

  /*
  ==========================================================
  CLOSE
  ==========================================================
  */

  const closeSheet = useCallback(() => {
    if (!dismissible) return;

    /*
     * Si nosotros agregamos una entrada al historial,
     * usamos history.back() para eliminarla.
     *
     * El popstate se encargará de llamar onClose().
     */
    if (historyPushed.current) {
      historyPushed.current = false;
      window.history.back();
      return;
    }

    onClose();
  }, [dismissible, onClose]);

  /*
  ==========================================================
  DRAG START
  ==========================================================
  */

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (!dismissible) return;

    /*
     * Solo táctil / stylus.
     * Mouse conserva el comportamiento normal de desktop.
     */
    if (
      event.pointerType !== "touch" &&
      event.pointerType !== "pen"
    ) {
      return;
    }

    dragStartY.current =
      event.clientY;

    dragStartTime.current =
      performance.now();

    dragging.current = false;

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );
  };

  /*
  ==========================================================
  DRAG MOVE
  ==========================================================
  */

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    const start =
      dragStartY.current;

    if (start === null) return;

    const delta =
      event.clientY - start;

    /*
     * Solo permitimos swipe hacia abajo.
     */
    if (delta <= 0) return;

    if (
      !dragging.current &&
      delta < 6
    ) {
      return;
    }

    dragging.current = true;
    setIsDragging(true);

    /*
     * Resistencia progresiva.
     *
     * Esto evita que parezca que estamos simplemente
     * moviendo un div.
     */
    const resistance =
      delta < 120
        ? 0.82
        : 0.55;

    const next =
      Math.min(
        420,
        delta * resistance
      );

    setDragY(next);
  };

  /*
  ==========================================================
  DRAG END
  ==========================================================
  */

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    const start =
      dragStartY.current;

    if (start === null) return;

    const delta =
      Math.max(
        0,
        event.clientY - start
      );

    const elapsed =
      Math.max(
        1,
        performance.now() -
          dragStartTime.current
      );

    const velocity =
      delta / elapsed;

    dragStartY.current = null;
    dragging.current = false;

    setIsDragging(false);

    /*
     * Distancia o velocidad.
     *
     * Esto hace que un gesto corto pero rápido
     * también cierre el Sheet.
     */
    if (
      delta > 110 ||
      velocity > 0.65
    ) {
      setDragY(0);
      closeSheet();
      return;
    }

    /*
     * No alcanzó el umbral:
     * vuelve suavemente a su posición.
     */
    setDragY(0);
  };

  const handlePointerCancel = () => {
    dragStartY.current = null;
    dragging.current = false;

    setIsDragging(false);
    setDragY(0);
  };

  /*
  ==========================================================
  RENDER
  ==========================================================
  */

  if (!open) {
    return null;
  }

  const backdropOpacity =
    Math.max(
      0.08,
      1 - dragY / 520
    );

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {/* ==================================================
          BACKDROP
          ================================================== */}

      <button
        type="button"
        aria-label="Cerrar"
        onClick={closeSheet}
        className="absolute inset-0 border-0"
        style={{
          background:
            `rgba(0,0,0,${0.32 * backdropOpacity})`,
          backdropFilter:
            "blur(3px)",
          WebkitBackdropFilter:
            "blur(3px)",
          padding: 0,
          margin: 0,
        }}
      />

      {/* ==================================================
          SHEET
          ================================================== */}

      <aside
        ref={sheetRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth,
          height: "100dvh",

          display: "flex",
          flexDirection: "column",

          background:
            "#0D0D0F",

          color: "#FFFFFF",

          boxShadow:
            "-18px 0 60px rgba(0,0,0,.28)",

          transform:
            `translate3d(0, ${dragY}px, 0)`,

          transition:
            isDragging
              ? "none"
              : "transform 260ms cubic-bezier(.22,1,.36,1)",

          willChange:
            "transform",

          overflow:
            "hidden",

          /*
           * El contenido interno controla su propio scroll.
           * El gesto de cerrar se inicia en el handle/header.
           */
          touchAction:
            "pan-y",

          paddingTop:
            "env(safe-area-inset-top)",

          paddingBottom:
            "env(safe-area-inset-bottom)",
        }}
      >
        {/* ==================================================
            DRAG HANDLE + HEADER
            ================================================== */}

        <div
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerCancel
          }
          style={{
            flexShrink: 0,

            /*
             * IMPORTANTE:
             * aquí sí permitimos el gesto personalizado.
             * El contenido no se pelea con él.
             */
            touchAction:
              "none",

            cursor:
              "grab",

            userSelect:
              "none",

            WebkitUserSelect:
              "none",
          }}
        >
          {/* Handle móvil */}

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
                background:
                  "rgba(255,255,255,.22)",
              }}
            />
          </div>

          {/* Header */}

          <div
            style={{
              minHeight: 64,

              padding:
                "0 18px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              borderBottom:
                "1px solid rgba(255,255,255,.07)",
            }}
          >
            <div
              style={{
                minWidth: 0,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing:
                  "-.02em",
              }}
            >
              {title}
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
                  justifyContent:
                    "center",

                  border: 0,
                  borderRadius:
                    "50%",

                  background:
                    "rgba(255,255,255,.07)",

                  color:
                    "#FFFFFF",

                  fontSize: 25,
                  lineHeight: 1,

                  cursor:
                    "pointer",

                  WebkitTapHighlightColor:
                    "transparent",
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            CONTENT
            ================================================== */}

        <div
          style={{
            flex: 1,
            minHeight: 0,

            overflowY: "auto",
            overflowX: "hidden",

            WebkitOverflowScrolling:
              "touch",

            overscrollBehaviorY:
              "contain",

            touchAction:
              "pan-y",

            paddingBottom:
              "env(safe-area-inset-bottom)",
          }}
        >
          {children}
        </div>
      </aside>
    </div>
  );
}