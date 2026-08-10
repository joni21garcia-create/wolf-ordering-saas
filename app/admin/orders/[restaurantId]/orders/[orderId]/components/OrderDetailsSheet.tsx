"use client";

import { useState, useEffect } from "react";

import CustomerCard from "./CustomerCard";
import DeliveryCard from "./DeliveryCard";
import ProductsCard from "./ProductsCard";
import PaymentCard from "./PaymentCard";
import ProofCard from "./ProofCard";
import NotesCard from "./NotesCard";
import MapCard from "./MapCard";
import TimelineCard from "./TimelineCard";
import RestaurantCard from "./RestaurantCard";
import TechnicalCard from "./TechnicalCard";

interface Props {
  order: any;
  hasDelivery?: boolean;
  hasMap?: boolean;
  hasNotes?: boolean;
  hasProof?: boolean;
}

type SectionKey =
  | "menu"
  | "customer"
  | "delivery"
  | "products"
  | "payment"
  | "proof"
  | "notes"
  | "map"
  | "timeline"
  | "restaurant"
  | "technical";

export default function OrderDetailsSheet({
  order,
  hasDelivery = false,
  hasMap = false,
  hasNotes = false,
  hasProof = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [section, setSection] =
    useState<SectionKey>("menu");

  useEffect(() => {
    if (!open) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open]);

  function openSection(
    nextSection: SectionKey
  ) {
    setSection(nextSection);
  }

  function closeSheet() {
    setOpen(false);
    setSection("menu");
  }

  function backToMenu() {
    setSection("menu");
  }

  return (
    <>
      {/* ==================================================
          TRIGGER
      ================================================== */}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setSection("menu");
        }}
        style={triggerStyle}
      >
        <div>
          <div style={triggerTitle}>
            Información del pedido
          </div>

          <div style={triggerDescription}>
            Cliente, productos, pago y más
          </div>
        </div>

        <span style={triggerChevron}>
          ›
        </span>
      </button>

      {/* ==================================================
          SHEET
      ================================================== */}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={overlayStyle}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeSheet();
            }
          }}
        >
          <section
            style={sheetStyle}
            onTouchStart={(event) => {
              touchStartX.current =
                event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              const endX =
                event.changedTouches[0].clientX;

              const delta =
                endX - touchStartX.current;

              /*
               * Swipe hacia la izquierda
               */
              if (delta < -80) {
                closeSheet();
              }
            }}
          >
            {/* HANDLE */}

            <div style={handleAreaStyle}>
              <div style={handleStyle} />
            </div>

            {/* HEADER */}

            <header style={headerStyle}>
              <button
                type="button"
                onClick={
                  section === "menu"
                    ? closeSheet
                    : backToMenu
                }
                style={headerButtonStyle}
                aria-label={
                  section === "menu"
                    ? "Cerrar"
                    : "Volver"
                }
              >
                {section === "menu" ? "×" : "‹"}
              </button>

              <div style={headerTitleStyle}>
                {section === "menu"
                  ? "Información"
                  : sectionTitle(section)}
              </div>

              <div style={headerSpacerStyle} />
            </header>

            {/* CONTENT */}

            <div style={contentStyle}>
              {section === "menu" ? (
                <Menu
                  order={order}
                  hasDelivery={hasDelivery}
                  hasMap={hasMap}
                  hasNotes={hasNotes}
                  hasProof={hasProof}
                  onSelect={openSection}
                />
              ) : (
                <DetailView
                  section={section}
                  order={order}
                />
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

/* =========================================================
   TOUCH
========================================================= */

const touchStartX = {
  current: 0,
};

/* =========================================================
   MENU
========================================================= */

function Menu({
  order,
  hasDelivery,
  hasMap,
  hasNotes,
  hasProof,
  onSelect,
}: {
  order: any;
  hasDelivery: boolean;
  hasMap: boolean;
  hasNotes: boolean;
  hasProof: boolean;
  onSelect: (section: SectionKey) => void;
}) {
  return (
    <div>
      <div style={introStyle}>
        <div style={trackingStyle}>
          #{order.tracking_code}
        </div>

        <div style={introTextStyle}>
          Consulta rápidamente la información
          de este pedido.
        </div>
      </div>

      <div style={menuStyle}>
        <MenuItem
          icon="person"
          label="Cliente"
          onClick={() => onSelect("customer")}
        />

        {hasDelivery && (
          <MenuItem
            icon="truck"
            label="Entrega"
            onClick={() => onSelect("delivery")}
          />
        )}

        <MenuItem
          icon="box"
          label="Productos"
          onClick={() => onSelect("products")}
        />

        <MenuItem
          icon="card"
          label="Pago"
          onClick={() => onSelect("payment")}
        />

        {hasProof && (
          <MenuItem
            icon="receipt"
            label="Comprobante"
            onClick={() => onSelect("proof")}
          />
        )}

        {hasNotes && (
          <MenuItem
            icon="note"
            label="Notas"
            onClick={() => onSelect("notes")}
          />
        )}

        {hasMap && (
          <MenuItem
            icon="pin"
            label="Ubicación"
            onClick={() => onSelect("map")}
          />
        )}

        <MenuItem
          icon="clock"
          label="Seguimiento"
          onClick={() => onSelect("timeline")}
        />

        <MenuItem
          icon="store"
          label="Restaurante"
          onClick={() =>
            onSelect("restaurant")
          }
        />

        <div style={technicalDividerStyle} />

        <MenuItem
          icon="code"
          label="Información técnica"
          onClick={() =>
            onSelect("technical")
          }
          muted
        />
      </div>
    </div>
  );
}

/* =========================================================
   MENU ITEM
========================================================= */

function MenuItem({
  icon,
  label,
  onClick,
  muted = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={muted ? mutedMenuItemStyle : menuItemStyle}
    >
      <span style={iconBoxStyle}>
        <Icon type={icon} />
      </span>

      <span style={menuLabelStyle}>
        {label}
      </span>

      <span style={chevronStyle}>
        ›
      </span>
    </button>
  );
}

/* =========================================================
   DETAIL VIEW
========================================================= */

function DetailView({
  section,
  order,
}: {
  section: Exclude<
    SectionKey,
    "menu"
  >;
  order: any;
}) {
  switch (section) {
    case "customer":
      return <CustomerCard order={order} />;

    case "delivery":
      return <DeliveryCard order={order} />;

    case "products":
      return <ProductsCard order={order} />;

    case "payment":
      return <PaymentCard order={order} />;

    case "proof":
      return <ProofCard order={order} />;

    case "notes":
      return <NotesCard order={order} />;

    case "map":
      return <MapCard order={order} />;

    case "timeline":
      return <TimelineCard order={order} />;

    case "restaurant":
      return <RestaurantCard order={order} />;

    case "technical":
      return <TechnicalCard order={order} />;

    default:
      return null;
  }
}

/* =========================================================
   TITLE
========================================================= */

function sectionTitle(
  section: SectionKey
) {
  const titles: Record<
    Exclude<SectionKey, "menu">,
    string
  > = {
    customer: "Cliente",
    delivery: "Entrega",
    products: "Productos",
    payment: "Pago",
    proof: "Comprobante",
    notes: "Notas",
    map: "Ubicación",
    timeline: "Seguimiento",
    restaurant: "Restaurante",
    technical: "Información técnica",
  };

  return titles[
    section as Exclude<
      SectionKey,
      "menu"
    >
  ];
}

/* =========================================================
   ICONS
========================================================= */

function Icon({
  type,
}: {
  type: string;
}) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "person":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 20c.8-3.4 3-5.2 6.5-5.2s5.7 1.8 6.5 5.2" />
        </svg>
      );

    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.7" />
          <circle cx="18" cy="18" r="1.7" />
        </svg>
      );

    case "box":
      return (
        <svg {...common}>
          <path d="m4 7 8-4 8 4-8 4-8-4Z" />
          <path d="M4 7v10l8 4 8-4V7" />
          <path d="M12 11v10" />
        </svg>
      );

    case "card":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path d="M3 10h18" />
        </svg>
      );

    case "receipt":
      return (
        <svg {...common}>
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );

    case "note":
      return (
        <svg {...common}>
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M14 3v4h4" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      );

    case "pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "store":
      return (
        <svg {...common}>
          <path d="M4 10h16v10H4z" />
          <path d="M3 10 5 4h14l2 6" />
          <path d="M8 14h8v6H8z" />
        </svg>
      );

    case "code":
      return (
        <svg {...common}>
          <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   STYLES
========================================================= */

const triggerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "15px 2px",
  border: "none",
  borderTop:
    "1px solid rgba(255,255,255,.07)",
  borderBottom:
    "1px solid rgba(255,255,255,.07)",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  textAlign: "left",
};

const triggerTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 650,
  letterSpacing: "-.15px",
};

const triggerDescription: React.CSSProperties = {
  marginTop: 4,
  color: "#666",
  fontSize: 12,
};

const triggerChevron: React.CSSProperties = {
  color: "#555",
  fontSize: 22,
  lineHeight: 1,
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  background:
    "rgba(0,0,0,.68)",
  backdropFilter: "blur(12px)",
};

const sheetStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 760,
  height: "min(88vh, 760px)",
  maxHeight: "88vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  background: "#090909",
  border:
    "1px solid rgba(255,255,255,.07)",
  borderBottom: "none",
  borderRadius: "28px 28px 0 0",
  boxShadow:
    "0 -24px 80px rgba(0,0,0,.65)",
};

const handleAreaStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  paddingTop: 9,
};

const handleStyle: React.CSSProperties = {
  width: 36,
  height: 4,
  borderRadius: 999,
  background:
    "rgba(255,255,255,.18)",
};

const headerStyle: React.CSSProperties = {
  minHeight: 60,
  display: "grid",
  gridTemplateColumns: "42px 1fr 42px",
  alignItems: "center",
  padding: "0 12px",
  borderBottom:
    "1px solid rgba(255,255,255,.055)",
};

const headerButtonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 11,
  background:
    "rgba(255,255,255,.045)",
  color: "#aaa",
  fontSize: 24,
  lineHeight: 1,
  cursor: "pointer",
};

const headerTitleStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#f2f2f2",
  fontSize: 15,
  fontWeight: 650,
  letterSpacing: "-.2px",
};

const headerSpacerStyle: React.CSSProperties = {
  width: 42,
};

const contentStyle: React.CSSProperties = {
  overflowY: "auto",
  overscrollBehavior: "contain",
  padding: "18px 18px 32px",
  WebkitOverflowScrolling: "touch",
};

const introStyle: React.CSSProperties = {
  padding: "3px 2px 15px",
};

const trackingStyle: React.CSSProperties = {
  color: "#f97316",
  fontSize: 12,
  fontWeight: 750,
  letterSpacing: 1.1,
};

const introTextStyle: React.CSSProperties = {
  marginTop: 6,
  color: "#666",
  fontSize: 12,
};

const menuStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const menuItemStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 58,
  display: "grid",
  gridTemplateColumns: "32px 1fr 18px",
  alignItems: "center",
  gap: 11,
  padding: "5px 0",
  border: "none",
  borderBottom:
    "1px solid rgba(255,255,255,.045)",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  textAlign: "left",
};

const mutedMenuItemStyle: React.CSSProperties = {
  ...menuItemStyle,
  color: "#888",
};

const technicalDividerStyle: React.CSSProperties = {
  height: 18,
  margin: "3px 0 0",
  borderTop:
    "1px solid rgba(255,255,255,.055)",
};

const iconBoxStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 9,
  background:
    "rgba(255,255,255,.035)",
  color: "#888",
};

const menuLabelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "-.1px",
};

const chevronStyle: React.CSSProperties = {
  color: "#444",
  fontSize: 19,
  textAlign: "right",
};