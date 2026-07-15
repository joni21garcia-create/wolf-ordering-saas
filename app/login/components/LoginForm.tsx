"use client";

import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

type Props = {
  login: ReturnType<typeof useLogin>;
};

export function LoginForm({ login }: Props) {
  const [showPassword, setShowPassword] =
    useState(false);

  const inputContainer: React.CSSProperties = {
    position: "relative",
    marginBottom: "20px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px",
    paddingLeft: "48px",
    paddingRight: "48px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.03)",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "16px",
    transition: "all .25s ease",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#777",
    fontSize: "18px",
    pointerEvents: "none",
  };

  return (
    <>
      {/* EMAIL */}

      <label
        style={{
          color: "#B0B0B0",
          fontSize: "14px",
        }}
      >
        Correo electrónico
      </label>

      <div style={inputContainer}>
        <span style={iconStyle}>✉</span>

        <input
          type="email"
          value={login.email}
          onChange={(e) =>
            login.setEmail(e.target.value)
          }
          placeholder="correo@empresa.com"
          style={inputStyle}
        />
      </div>

      {/* PASSWORD */}

      <label
        style={{
          color: "#B0B0B0",
          fontSize: "14px",
        }}
      >
        Contraseña
      </label>

      <div style={inputContainer}>
        <span style={iconStyle}>🔒</span>

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={login.password}
          onChange={(e) =>
            login.setPassword(
              e.target.value
            )
          }
          placeholder="••••••••••••"
          style={inputStyle}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform:
              "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {showPassword
            ? "🙈"
            : "👁"}
        </button>
      </div>

      {/* FOOTER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            color: "#999",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <input
            type="checkbox"
            checked={
              login.rememberMe
            }
            onChange={(e) =>
              login.setRememberMe(
                e.target.checked
              )
            }
          />

          Recordarme
        </label>

        <button
          type="button"
          onClick={
            login.resetPassword
          }
          style={{
            background: "none",
            border: "none",
            color: "#f97316",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </>
  );
}