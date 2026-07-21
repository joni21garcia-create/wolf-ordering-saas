"use client";

import InstallSection from "./InstallSection";
import GoogleButton from "./GoogleButton";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;

  password: string;
  setPassword: (value: string) => void;

  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;

  loading: boolean;

  login: () => void;
  resetPassword: () => void;
  loginWithGoogle: () => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  loading,
  login,
  resetPassword,
  loginWithGoogle,
}: LoginFormProps) {
  return (
    <aside
      style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        padding: "60px 50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: 40,
        }}
      >
        <span
          style={{
            color: "#f97316",
            fontWeight: 800,
            letterSpacing: 4,
            fontSize: 12,
          }}
        >
          WOLF ORDERING OS
        </span>

        <h2
          style={{
            color: "#fff",
            fontSize: 38,
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          Bienvenido
        </h2>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.7,
            fontSize: 15,
          }}
        >
          Inicia sesión para acceder a tu restaurante.
        </p>
      </div>

      {/* EMAIL */}

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            color: "#b5b5b5",
            display: "block",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          Correo electrónico
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@empresa.com"
          style={{
            width: "100%",
            height: 58,
            padding: "0 18px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.03)",
            color: "#fff",
            outline: "none",
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* PASSWORD */}

      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            color: "#b5b5b5",
            display: "block",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          Contraseña
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: "100%",
            height: 58,
            padding: "0 18px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.03)",
            color: "#fff",
            outline: "none",
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          fontSize: 14,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#9ca3af",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Recordarme
        </label>

        <button
          onClick={resetPassword}
          type="button"
          style={{
            border: "none",
            background: "transparent",
            color: "#f97316",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        onClick={login}
        disabled={loading}
        style={{
          width: "100%",
          height: 60,
          borderRadius: 18,
          border: "none",
          cursor: "pointer",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          background:
            "linear-gradient(90deg,#f97316,#ff8c2f)",
        }}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <GoogleButton onClick={loginWithGoogle} />

      <InstallSection />
    </aside>
  );
}


