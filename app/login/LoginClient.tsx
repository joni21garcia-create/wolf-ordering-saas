"use client";

import { InstallButton } from "@/components/pwa/InstallButton";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { data } from "framer-motion/client";



export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);
    const [rememberMe, setRememberMe] =
  useState(false);

  useEffect(() => {
  const savedEmail =
    localStorage.getItem(
      "wolf_email"
    );

  if (savedEmail) {
    setEmail(savedEmail);
    setRememberMe(true);
  }

  setIsMounted(true);
}, []);

  async function resetPassword() {
    try {
      if (!email) {
        alert(
          "Ingrese su correo electrónico"
        );

        return;
      }

      const baseUrl = window.location.origin;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
               `${baseUrl}/reset-password`,
          }
        );

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Se envió un enlace de recuperación a tu correo."
      );
    } catch (error) {
      console.error(error);
      alert("Error al enviar el enlace de recuperación");
    }
  }

 async function loginWithGoogle() {
  try {
    console.log("INICIANDO GOOGLE");

    const baseUrl = window.location.origin;

    const { error } =
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});

    if (error) {
      console.error(error);
      alert("Error al iniciar sesión con Google");
      return;
    }

    console.log(data);
  } catch (error) {
    console.error(error);
    alert("Error al conectar con Google");
  }
}

  async function login() {
    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      const authUserId =
        data.user.id;

      const {
        data: user,
        error: userError,
      } = await supabase
        .from("restaurant_users")
        .select(`
          *,
          restaurant_roles (
            id,
            code,
            name
          )
        `)
        .eq(
          "auth_user_id",
          authUserId
        )
        .maybeSingle();

      if (userError || !user) {
        alert(
          "Usuario no encontrado en el sistema"
        );
        return;
      }

      if (rememberMe) {
        localStorage.setItem(
          "wolf_email",
          email
        );
      } else {
        localStorage.removeItem(
          "wolf_email"
        );
      }

      const roleCode =
        user.restaurant_roles?.code;

      const isSuperAdmin =
        roleCode === "super-user" ||
        roleCode === "owner";

      if (isSuperAdmin) {
        router.push(
          "/login/super-admin"
        );

        return;
      }

      router.push(
        `/super-admin/restaurants/${user.restaurant_id}/restaurante/dashboard`
      );
    } catch (err) {
      console.error(err);

      alert(
        "Error al iniciar sesión. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  const loginError = searchParams.get("error");
  const loginMessage = searchParams.get("message");

  const loginErrorText: string | null = loginError
    ? {
        "google-auth":
          "Error en la autenticación de Google. Revisa la configuración de OAuth en Supabase.",
        "no-email":
          "Google no devolvió tu correo electrónico. Comprueba los permisos del proveedor.",
        "no-access":
          "Tu correo no tiene acceso al sistema. Verifica que tu usuario exista en restaurant_users.",
        callback:
          "Hubo un problema en el callback de Google. Revisa la configuración de redirección.",
      }[loginError] ?? "Error desconocido de autenticación con Google."
    : null;

  function Feature({
    text,
  }: {
    text: string;
  }) {
    return (
      <div
        style={{
          color: "#ddd",
          fontSize: "20px",
        }}
      >
        ✓ {text}
      </div>
    );
  }

  function StatusBadge({
    text,
  }: {
    text: string;
  }) {
    return (
      <div
        style={{
          background:
            "rgba(249,115,22,.12)",
          border:
            "1px solid rgba(249,115,22,.2)",
          padding: "8px 14px",
          borderRadius: "999px",
          color: "#f97316",
          fontSize: "13px",
        }}
      >
        {text}
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,.08)",
      background: "rgba(255,255,255,.03)",
      color: "#fff",
      outline: "none",
      boxSizing: "border-box",
    };



  return (
  <main

  >
    {/* GLOW */}

   <div
  style={{
    position: "absolute",

    top: "-180px",

    left: "50%",

    transform: "translateX(-50%)",

    width: "520px",

    height: "520px",

    pointerEvents: "none",

    borderRadius: "50%",

    background: `
      radial-gradient(
        circle,
        rgba(255,140,40,.14) 0%,
        rgba(255,140,40,.08) 22%,
        rgba(255,140,40,.035) 45%,
        rgba(255,140,40,.015) 65%,
        transparent 82%
      )
    `,

    filter: "blur(80px)",

    opacity: .95,
  }}
/>

    

    <div
style={{
  textAlign: "center",

  position: "relative",

  zIndex: 2,

  display: "flex",

  flexDirection: "column",

  alignItems: "center",

  gap: "6px",

  marginBottom: "18px",
}}
    >
  
      {/* LOGIN */}

      {isMounted && (
      <section
 style={{
  position: "relative",

  overflow: "hidden",

  width: "100%",

  maxWidth: "540px",

  padding: "58px 46px 42px",

  borderRadius: "34px",

  background: `
    linear-gradient(
      180deg,
      rgba(22,22,22,.98) 0%,
      rgba(15,15,15,.98) 18%,
      rgba(10,10,10,.99) 58%,
      rgba(7,7,7,1) 100%
    )
  `,

  border: "1px solid rgba(255,255,255,.045)",

  backdropFilter: "blur(30px)",

  boxShadow: `
    0 0 0 1px rgba(255,255,255,.015),

    inset 0 1px 0 rgba(255,255,255,.03),

    inset 0 -1px 0 rgba(255,255,255,.015),

    0 20px 45px rgba(0,0,0,.35),

    0 60px 140px rgba(0,0,0,.70)
  `,

  transition: "all .35s ease",
}}
      >
        
        {loginErrorText && (
          <div
            style={{
              marginBottom: "24px",
              padding: "18px 20px",
              borderRadius: "20px",
              background: "rgba(248,113,113,.12)",
              border: "1px solid rgba(248,113,113,.25)",
              color: "#fee2e2",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            <strong>{loginErrorText}</strong>
            {loginMessage ? (
              <div style={{ marginTop: "10px", opacity: 0.85 }}>
                {decodeURIComponent(loginMessage)}
              </div>
            ) : null}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "370px",
                height: "370px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",

                borderRadius:
                  "50%",

                background:
                  "radial-gradient(circle, rgba(249,115,22,.25), transparent 70%)",
              }}
            >
              <Image
                src="/wolfloginv2.png"
                alt="Wolf Ordering"
                width={370}
                height={370}
                priority
                style={{
                  objectFit:
                    "contain",
                }}
              />
            </div>
          </div>

<span
  style={{
    color: "#f97316",

    fontWeight: 700,

    letterSpacing: "6px",

    fontSize: "12px",

    textTransform: "uppercase",

    margin: "0",

    lineHeight: 1,
  }}
>
  WOLF ORDERING OS
</span>

          <p
            style={{
              color: "#888",
              marginTop: "15px",
              lineHeight: 1.8,
            }}
          >
            Plataforma SaaS para
            restaurantes
          </p>


        </div>
                <div
          style={{
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              color: "#aaa",
            }}
          >
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter' && password) login();
            }}
            autoComplete="email"
            placeholder="correo@empresa.com"
            style={inputStyle}
            disabled={loading}
          />
        </div>

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              color: "#aaa",
            }}
          >
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter' && email) login();
            }}
            autoComplete="current-password"
            placeholder="********"
            style={inputStyle}
            disabled={loading}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <label
            style={{
              color: "#999",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(
                  e.target.checked
                )
              }
              disabled={loading}
              style={{
                cursor: "pointer",
              }}
            />
            Recordarme
          </label>

         <button
  type="button"
  onClick={resetPassword}
  disabled={loading}
  style={{
    background:
      "transparent",
    border: "none",
    color: "#f97316",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
  }}
>
  ¿Olvidaste tu contraseña?
</button>
        </div>

        <button
          type="button"
          onClick={login}
          disabled={loading || !email || !password}
          style={{
            width: "100%",
            border: "none",
            cursor: loading || !email || !password ? "not-allowed" : "pointer",
            padding: "18px",
            borderRadius: "18px",
            fontWeight: 800,
            fontSize: "18px",
            color: "#fff",
            background:
              "linear-gradient(135deg,#ff7b00,#ff9900)",

            opacity: loading || !email || !password ? 0.6 : 1,
            boxShadow:
              "0 20px 50px rgba(249,115,22,.35)",
            transition: "opacity 0.2s",
          }}
        >
          {loading
            ? "Ingresando..."
            : "Ingresar"}
        </button>

<button
  type="button"
  onClick={loginWithGoogle}
  disabled={loading}
  style={{
    width: "100%",
    marginTop: "16px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",

    padding: "18px",

    borderRadius: "18px",

    border:
      "1px solid rgba(255,255,255,.08)",

    background:
      "rgba(255,255,255,.03)",

    color: "#fff",

    cursor: loading ? "not-allowed" : "pointer",

    fontWeight: "700",

    fontSize: "16px",

    transition: ".3s",

    opacity: loading ? 0.6 : 1,
  }}
>
  <img
    src="https://www.google.com/favicon.ico"
    alt="Google"
    width="20"
    height="20"
  />

  Continuar con Google
</button>


<div style={{ marginTop: "16px" }}>
  <InstallButton />
</div>


        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop:
              "1px solid rgba(255,255,255,.08)",
            textAlign: "center",
            color: "#666",
            fontSize: "13px",
          }}
        >
          Wolf Ordering LLC © 2026
        </div>
      </section>
      )}
    </div>
  </main>
);
}