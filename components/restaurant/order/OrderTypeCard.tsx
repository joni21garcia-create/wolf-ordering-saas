"use client";

import { motion } from "framer-motion";
import { card, chip } from "./order-type.styles";

interface Props {
  title: string;
  icon: string;
  selected: boolean;
  primaryColor: string;
  chips: string[];
  footer: string;
  onClick: () => void;
}

export default function OrderTypeCard({
  title,
  icon,
  selected,
  primaryColor,
  chips,
  footer,
  onClick,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -3,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      style={card(selected, primaryColor)}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            fontSize: "36px",
            lineHeight: 1,
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: 0,
            color: "#FFF",
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginTop: "18px",
          marginBottom: "18px",
        }}
      >
        {chips.map((item) => (
          <span key={item} style={chip}>
            {item}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,.08)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          color: selected
            ? primaryColor
            : "rgba(255,255,255,.6)",

          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        {footer}
      </div>
    </motion.div>
  );
}


