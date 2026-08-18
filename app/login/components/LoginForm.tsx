"use client";

import { Fingerprint } from "lucide-react";

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
  loginWithBiometric: () => void;
  biometricEnabled: boolean;
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
  loginWithBiometric,
  biometricEnabled,
}: LoginFormProps) {
  return (
    <>
      <style jsx>{`
        .form {
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          padding: clamp(32px, 5vw, 72px)
            clamp(24px, 5vw, 64px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow {
          color: #f97316;
          font-weight: 800;
          letter-spacing: 3.5px;
          font-size: 11px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .title {
          color: #fff;
          font-size: clamp(34px, 4vw, 46px);
          font-weight: 750;
          letter-spacing: -1.5px;
          line-height: 1.05;
          margin: 0 0 10px;
        }

        .subtitle {
          color: #8d8d8d;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 38px;
        }

        .field {
          margin-bottom: 18px;
        }

        .label {
          display: block;
          margin-bottom: 8px;
          color: #a6a6a6;
          font-size: 13px;
          font-weight: 500;
        }

        .input {
          width: 100%;
          height: 56px;
          padding: 0 17px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.075);
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.045),
              rgba(255,255,255,.018)
            );
          color: #fff;
          outline: none;
          font-size: 15px;
          box-sizing: border-box;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.025);
          transition:
            border-color .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .input::placeholder {
          color: #555;
        }

        .input:focus {
          border-color: rgba(249,115,22,.42);
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.055),
              rgba(255,255,255,.022)
            );
          box-shadow:
            0 0 0 3px rgba(249,115,22,.07),
            inset 0 1px 0 rgba(255,255,255,.04);
        }

        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          margin: 4px 0 26px;
          font-size: 13px;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #858585;
          cursor: pointer;
          white-space: nowrap;
        }

        .remember input {
          width: 15px;
          height: 15px;
          accent-color: #f97316;
        }

        .forgot {
          border: 0;
          background: transparent;
          color: #f97316;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          padding: 4px 0;
          transition: opacity .18s ease;
        }

        .forgot:hover {
          opacity: .75;
        }

        .login-button {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          width: 100%;
          height: 58px;
          border-radius: 15px;
          border: 1px solid rgba(255, 190, 130, .38);
          color: #fff;
          font-size: 15px;
          font-weight: 750;
          letter-spacing: .1px;
          cursor: pointer;
          background:
            linear-gradient(
              180deg,
              #ff9a48 0%,
              #ff872f 38%,
              #f97316 100%
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.34),
            inset 0 -1px 0 rgba(111,34,0,.32),
            0 1px 2px rgba(0,0,0,.40),
            0 8px 24px rgba(249,115,22,.13);
          transition:
            transform .18s cubic-bezier(.2,.8,.2,1),
            box-shadow .18s ease,
            filter .18s ease,
            border-color .18s ease;
        }

        .login-button::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: 1px;
          left: 9%;
          width: 82%;
          height: 1px;
          border-radius: 999px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.58),
              transparent
            );
          opacity: .75;
          pointer-events: none;
        }

        .login-button::after {
          content: "";
          position: absolute;
          z-index: -1;
          top: -90%;
          left: -35%;
          width: 28%;
          height: 280%;
          transform: rotate(18deg);
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.16),
              transparent
            );
          opacity: 0;
          transition:
            left .55s cubic-bezier(.2,.7,.2,1),
            opacity .25s ease;
          pointer-events: none;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.035);
          border-color: rgba(255, 205, 160, .52);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.40),
            inset 0 -1px 0 rgba(111,34,0,.28),
            0 2px 4px rgba(0,0,0,.32),
            0 12px 30px rgba(249,115,22,.19);
        }

        .login-button:hover:not(:disabled)::after {
          left: 115%;
          opacity: 1;
        }

        .login-button:active:not(:disabled) {
          transform: translateY(1px);
          filter: brightness(.98);
          box-shadow:
            inset 0 2px 5px rgba(92,28,0,.25),
            0 3px 10px rgba(249,115,22,.09);
        }

        .login-button:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 3px rgba(249,115,22,.13),
            inset 0 1px 0 rgba(255,255,255,.34),
            0 8px 24px rgba(249,115,22,.15);
        }

        .login-button:disabled {
          cursor: wait;
          opacity: .55;
          filter: saturate(.75);
        }

        .biometric-button {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background:
            linear-gradient(
              180deg,
              #333 0%,
              #111 100%
            );
          border-color: rgba(255,255,255,.16);
        }

        .biometric-icon {
          flex: 0 0 auto;
        }

        @media (max-width: 700px) {
          .form {
            max-width: none;
            padding: 38px 24px 34px;
          }

          .subtitle {
            margin-bottom: 30px;
          }

          .options {
            margin-bottom: 22px;
          }
        }

        @media (max-width: 380px) {
          .form {
            padding-left: 20px;
            padding-right: 20px;
          }

          .options {
            align-items: flex-start;
          }

          .forgot {
            text-align: right;
          }
        }
      `}</style>

      <aside className="form">
        <div className="eyebrow">
          WOLF ORDERING OS
        </div>

        <h2 className="title">
          Bienvenido
        </h2>

        <p className="subtitle">
          Inicia sesión para acceder a tu operación.
        </p>

        {/* EMAIL */}
        <div className="field">
          <label className="label">
            Correo electrónico
          </label>

          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="correo@empresa.com"
            autoComplete="email"
          />
        </div>

        {/* PASSWORD */}
        <div className="field">
          <label className="label">
            Contraseña
          </label>

          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {/* OPTIONS */}
        <div className="options">
          <label className="remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
            />

            <span>Recordarme</span>
          </label>

          <button
            onClick={resetPassword}
            type="button"
            className="forgot"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* LOGIN */}
        <button
          onClick={login}
          disabled={loading}
          className="login-button"
          type="button"
        >
          {loading
            ? "Ingresando..."
            : "Ingresar"}
        </button>

        {/* BIOMETRIC LOGIN */}
        {biometricEnabled && (
          <button
            onClick={loginWithBiometric}
            disabled={loading}
            className="login-button biometric-button"
            type="button"
          >
            <Fingerprint
              className="biometric-icon"
              size={21}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {loading
                ? "Autenticando..."
                : "Ingresar con huella"}
            </span>
          </button>
        )}

        {/* GOOGLE */}
        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={loading}
          className="login-button"
          style={{
            marginTop: "12px",
            background:
              "linear-gradient(180deg, #2b2b2b 0%, #151515 100%)",
            borderColor:
              "rgba(255,255,255,.12)",
          }}
        >
          Continuar con Google
        </button>
      </aside>
    </>
  );
}