"use client";

import type {
  ButtonHTMLAttributes,
} from "react";

export interface WolfSwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange"
  > {

  checked: boolean;

  onChange?: (
    checked: boolean
  ) => void;

  disabled?: boolean;

  label?: string;

  description?: string;

}

export default function WolfSwitch({

  checked,

  onChange,

  disabled = false,

  label,

  description,

  style,

  ...props

}: WolfSwitchProps) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        width: "100%",
      }}
    >

      <div
        style={{
          flex: 1,
        }}
      >

        {label && (

          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 4,
            }}
          >

            {label}

          </div>

        )}

        {description && (

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: "#7f7f7f",
            }}
          >

            {description}

          </div>

        )}

      </div>

      <button

        type="button"

        disabled={disabled}

        onClick={() => {

          if (disabled) return;

          onChange?.(!checked);

        }}

        style={{

          position: "relative",

          width: 58,

          height: 32,

          border: "none",

          outline: "none",

          cursor: disabled
            ? "not-allowed"
            : "pointer",

          borderRadius: 999,

          background: checked
            ? "#F97316"
            : "#2A2A2A",

          transition:
            "all .25s cubic-bezier(.22,.61,.36,1)",

          opacity: disabled
            ? 0.5
            : 1,

          flexShrink: 0,

          ...style,

        }}

        {...props}

      >

        <div

          style={{

            position: "absolute",

            top: 3,

            left: checked
              ? 29
              : 3,

            width: 26,

            height: 26,

            borderRadius: "50%",

            background: "#fff",

            transition:
              "all .25s cubic-bezier(.22,.61,.36,1)",

            boxShadow:
              "0 4px 10px rgba(0,0,0,.25)",

          }}

        />

      </button>

    </div>

  );

}