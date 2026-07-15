"use client";

import { useLogin } from "../hooks/useLogin";

type Props = {
  login: ReturnType<typeof useLogin>;
};

export function LoginButtons({ login }: Props) {
  return (
    <>
      <button
        onClick={login.login}
        disabled={login.loading}
        style={{
          width: "100%",
          padding: "18px",
          border: "none",
          borderRadius: "18px",
          background:
            "linear-gradient(90deg,#f97316,#fb923c)",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 700,
          cursor: login.loading
            ? "not-allowed"
            : "pointer",
          boxShadow:
            "0 10px 30px rgba(249,115,22,.35)",
          transition: "all .25s ease",
        }}
      >
        {login.loading
          ? "Ingresando..."
          : "INGRESAR"}
      </button>

      {/* Separador */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          margin: "28px 0",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "1px",
            background:
              "rgba(255,255,255,.08)",
          }}
        />

        <span
          style={{
            color: "#777",
            fontSize: "14px",
          }}
        >
          o
        </span>

        <div
          style={{
            flex: 1,
            height: "1px",
            background:
              "rgba(255,255,255,.08)",
          }}
        />
      </div>

      {/* GOOGLE */}

      <button
        onClick={login.loginWithGoogle}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "18px",
          border: "1px solid #E5E7EB",
          background: "#FFFFFF",
          color: "#111827",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          transition: "all .25s ease",
        }}
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={20}
          height={20}
        />

        Continuar con Google
      </button>
    </>
  );
}