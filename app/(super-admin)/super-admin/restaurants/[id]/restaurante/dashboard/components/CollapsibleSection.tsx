"use client";

import { useState } from "react";

type CollapsibleSectionProps = {
  title: string;
  subtitle?: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function CollapsibleSection({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={sectionContainer}>
      {/* HEADER DEL ACORDEÓN */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={headerBtn}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, width: "100%" }}>
          <span style={iconSpan}>{icon}</span>
          <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
            <h2 style={titleStyle}>{title}</h2>
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
          
          {/* Indicador de flecha con rotación */}
          <span style={{ 
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            fontSize: "12px",
            color: isOpen ? "#f97316" : "#666",
            fontWeight: "bold",
            paddingRight: "4px"
          }}>
            ▼
          </span>
        </div>
      </button>

      {/* CONTENIDO DESLIZABLE CON CSS GRID */}
      <div 
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden"
        }}
      >
        <div style={{ minHeight: 0 }}>
          <div style={gridContent}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ESTILOS DE LA SECCIÓN
const sectionContainer = {
  background: "rgba(10, 10, 10, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "20px",
  marginBottom: "16px",
  overflow: "hidden",
};

const headerBtn = {
  width: "100%",
  background: "rgba(18, 18, 18, 0.7)",
  border: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
  padding: "16px 18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  outline: "none",
};

const iconSpan = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
};

const titleStyle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "800",
  color: "#fff",
};

const subtitleStyle = {
  margin: "3px 0 0 0",
  fontSize: "12px",
  color: "#777",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap" as const,
};

const gridContent = {
  padding: "16px",
};