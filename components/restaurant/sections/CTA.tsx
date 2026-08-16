"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { getTheme } from "@/lib/theme/getTheme";


interface Props {
  restaurant: any;
}

export default function CTA({
  restaurant,
}: Props) {

  const theme = getTheme(restaurant);

  const ctaEnabled =
    restaurant.show_cta === true ||
    restaurant.show_cta === 1 ||
    restaurant.show_cta === "true" ||
    restaurant.show_cta === "1";

  if (!ctaEnabled) return null;

  return (
    <section
      id="contact"
      className="restaurant-cta"
      aria-label="Llamado a la acción"
      style={
        {
          "--cta-bg": theme.background,
          "--cta-primary": theme.primary,
          "--cta-text": theme.text,
        } as React.CSSProperties
      }
    >
      <div className="cta-glow" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="cta-inner"
      >
        <div className="cta-copy">
          <span className="cta-eyebrow">LISTO PARA ORDENAR</span>

          <h2>
            {restaurant.cta_title || "¿Listo para ordenar?"}
          </h2>

          <p>
            {restaurant.cta_description ||
              "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar."}
          </p>
        </div>

        <div className="cta-action">
          {restaurant.is_open ? (
            <Link
              href={`/${restaurant.slug}/order`}
              className="cta-button"
              aria-label={restaurant.cta_button_text || "Ordenar ahora"}
            >
              <span>
                {restaurant.cta_button_text || "Ordenar Ahora 🚀"}
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="cta-button cta-closed"
              aria-disabled="true"
            >
              <span>🔒 Cerrado</span>
            </button>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .restaurant-cta {
          position:relative;
          width:100%;
          box-sizing:border-box;
          overflow:hidden;
          padding:clamp(42px,7vw,76px) 14px;
          background:var(--cta-bg);
          color:var(--cta-text);
          isolation:isolate;
        }

        .cta-glow {
          position:absolute;
          width:360px;
          height:360px;
          right:-180px;
          top:-210px;
          border-radius:50%;
          background:var(--cta-primary);
          filter:blur(130px);
          opacity:.10;
          pointer-events:none;
          z-index:-1;
        }

        .cta-inner {
          width:100%;
          max-width:760px;
          margin:0 auto;
          box-sizing:border-box;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
          padding:clamp(18px,3vw,28px);
          border:1px solid rgba(255,255,255,.08);
          border-radius:20px;
          background:rgba(0,0,0,.10);
          box-shadow:0 18px 60px rgba(0,0,0,.14);
        }

        .cta-copy {
          min-width:0;
          flex:1;
        }

        .cta-eyebrow {
          display:block;
          margin-bottom:6px;
          color:var(--cta-primary);
          font-size:9px;
          line-height:1;
          font-weight:900;
          letter-spacing:1.2px;
        }

        .cta-copy h2 {
          margin:0;
          max-width:650px;
          color:var(--cta-text);
          font-size:clamp(1.45rem,4vw,2.65rem);
          line-height:1.05;
          letter-spacing:-.045em;
          font-weight:850;
        }

        .cta-copy p {
          max-width:590px;
          margin:8px 0 0;
          color:var(--cta-text);
          opacity:.68;
          font-size:clamp(.76rem,1.7vw,.92rem);
          line-height:1.5;
        }

        .cta-action {
          flex:0 0 auto;
        }

        .cta-button {
          min-height:42px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          box-sizing:border-box;
          padding:0 15px;
          border:1px solid transparent;
          border-radius:${theme.buttonStyle === "rounded" ? "999px" : "12px"};
          background:var(--cta-primary);
          color:var(--cta-text);
          text-decoration:none;
          font:800 11px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          white-space:nowrap;
          cursor:pointer;
          transition:transform .16s ease, filter .16s ease;
        }

        .cta-button:hover {
          transform:translateY(-1px);
          filter:brightness(1.05);
        }

        .cta-button b {
          font-size:16px;
          line-height:1;
          font-weight:500;
        }

        .cta-closed {
          background:rgba(239,68,68,.10);
          color:#ef4444;
          border-color:rgba(239,68,68,.20);
          box-shadow:none;
          cursor:not-allowed;
        }

        @media(max-width:600px) {
          .restaurant-cta {
            padding:34px 10px;
          }

          .cta-inner {
            display:block;
            padding:16px;
            border-radius:16px;
          }

          .cta-eyebrow {
            font-size:7px;
            letter-spacing:1px;
          }

          .cta-copy h2 {
            font-size:clamp(1.35rem,7vw,1.8rem);
          }

          .cta-copy p {
            margin-top:7px;
            font-size:.75rem;
            line-height:1.45;
          }

          .cta-action {
            margin-top:13px;
          }

          .cta-button {
            width:100%;
            min-height:40px;
            border-radius:10px;
            font-size:10px;
          }

          .cta-button b {
            font-size:15px;
          }
        }

        @media(prefers-reduced-motion:reduce) {
          .cta-button {
            transition:none;
          }
        }
      `}</style>
    </section>
  );
}