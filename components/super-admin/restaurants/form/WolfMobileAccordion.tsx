"use client";

import { ReactNode, useState } from "react";

type WolfMobileAccordionProps = {
  index?: string | number;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  mobileOnly?: boolean;
};

export default function WolfMobileAccordion({
  index,
  title,
  description,
  icon,
  children,
  defaultOpen = false,
  disabled = false,
  mobileOnly = true,
}: WolfMobileAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className={`wolf-accordion ${open ? "is-open" : ""} ${
        mobileOnly ? "mobile-only" : ""
      }`}
      data-disabled={disabled || undefined}
    >
      <button
        type="button"
        className="wolf-accordion-trigger"
        onClick={() => !disabled && setOpen((value) => !value)}
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="wolf-accordion-index">
          {icon ?? index ?? "•"}
        </span>

        <span className="wolf-accordion-heading">
          <strong>{title}</strong>

          {description && (
            <small>{description}</small>
          )}
        </span>

        <span
          className="wolf-accordion-toggle"
          aria-hidden="true"
        >
          {open ? "−" : "+"}
        </span>
      </button>

      <div
        className="wolf-accordion-content"
        data-open={open || undefined}
      >
        <div className="wolf-accordion-body">
          {children}
        </div>
      </div>

      <style jsx>{`
        .wolf-accordion {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow: hidden;

          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: #101010;

          transition:
            border-color 180ms ease,
            background 180ms ease;
        }

        .wolf-accordion.is-open {
          border-color: rgba(255, 107, 0, 0.22);
        }

        /*
         * Mobile-first accordion:
         * - Mobile: collapsible.
         * - Desktop: stays open when mobileOnly is enabled.
         */
        @media (min-width: 821px) {
          .mobile-only .wolf-accordion-trigger {
            cursor: default;
          }

          .mobile-only .wolf-accordion-toggle {
            display: none;
          }

          .mobile-only .wolf-accordion-content {
            grid-template-rows: 1fr;
          }

          .mobile-only .wolf-accordion-body {
            padding: 4px 16px 18px;
            opacity: 1;
          }
        }

        .wolf-accordion-trigger {
          appearance: none;
          width: 100%;
          min-height: 68px;
          padding: 12px 14px;

          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) 38px;
          align-items: center;
          gap: 12px;

          border: 0;
          background: transparent;
          color: #fff;

          text-align: left;
          cursor: pointer;
        }

        .wolf-accordion-trigger:disabled {
          cursor: default;
          opacity: 0.55;
        }

        .wolf-accordion-index {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 12px;
          background: rgba(255, 107, 0, 0.08);
          border: 1px solid rgba(255, 107, 0, 0.08);

          color: #ff6b00;
          font-size: 11px;
          font-weight: 900;

          flex-shrink: 0;
        }

        .wolf-accordion-heading {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .wolf-accordion-heading strong {
          display: block;

          color: #fff;
          font-size: 13px;
          line-height: 1.25;
          font-weight: 800;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wolf-accordion-heading small {
          display: block;

          color: #666;
          font-size: 9px;
          line-height: 1.35;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wolf-accordion-toggle {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 10px;
          background: rgba(255, 255, 255, 0.035);

          color: #999;
          font-size: 18px;
          line-height: 1;

          transition:
            background 180ms ease,
            color 180ms ease;
        }

        .wolf-accordion.is-open .wolf-accordion-toggle {
          background: rgba(255, 107, 0, 0.09);
          color: #ff6b00;
        }

        .wolf-accordion-content {
          display: grid;
          grid-template-rows: 0fr;

          transition: grid-template-rows 220ms ease;
        }

        .wolf-accordion-content[data-open] {
          grid-template-rows: 1fr;
        }

        .wolf-accordion-body {
          min-height: 0;
          overflow: hidden;

          padding: 0 16px;

          transition:
            padding 220ms ease,
            opacity 180ms ease;
          opacity: 0;
        }

        .wolf-accordion-content[data-open] .wolf-accordion-body {
          padding: 4px 16px 18px;
          opacity: 1;
        }

        @media (max-width: 520px) {
          .wolf-accordion {
            border-radius: 14px;
          }

          .wolf-accordion-trigger {
            min-height: 60px;
            padding: 10px 11px;

            grid-template-columns: 34px minmax(0, 1fr) 34px;
            gap: 9px;
          }

          .wolf-accordion-index {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            font-size: 9px;
          }

          .wolf-accordion-heading strong {
            font-size: 12px;
          }

          .wolf-accordion-heading small {
            font-size: 8.5px;
          }

          .wolf-accordion-toggle {
            width: 32px;
            height: 32px;
            border-radius: 9px;
            font-size: 17px;
          }

          .wolf-accordion-body {
            padding-left: 12px;
            padding-right: 12px;
          }

          .wolf-accordion-content[data-open] .wolf-accordion-body {
            padding: 2px 12px 14px;
          }
        }
      `}</style>
    </section>
  );
}