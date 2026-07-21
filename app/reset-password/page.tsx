"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

 useEffect(() => {
  let mounted = true;

  async function init() {
    try {
      // Intercambia el código de recuperación por una sesión
      await supabase.auth.exchangeCodeForSession(window.location.href);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);

      if (!session) {
        alert("La sesión de recuperación expiró.");
        router.replace("/login");
        return;
      }

      if (mounted) {
        setCheckingSession(false);
      }
    } catch (err) {
      console.error(err);
      router.replace("/login");
    }
  }

  init();

  return () => {
    mounted = false;
  };
}, [router]);

  async function updatePassword() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("La sesión de recuperación expiró.");
      router.replace("/login");
      return;
    }

    if (!password) {
      alert("Ingrese una contraseña.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      alert("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      setSuccess(true);

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Error actualizando la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        Verificando sesión...
      </main>
    );
  }

  if (success) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "620px",
            background: "rgba(15,15,15,.95)",
            border: "1px solid rgba(249,115,22,.2)",
            borderRadius: "32px",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "90px",
              marginBottom: "20px",
            }}
          >
            ✅
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "40px",
            }}
          >
            Contraseña actualizada
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: "20px",
            }}
          >
            Serás redirigido al login...
          </p>
        </div>
      </main>
    );
  }
    return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "rgba(15,15,15,.95)",
          border: "1px solid rgba(255,255,255,.05)",
          borderRadius: "32px",
          padding: "45px",
          boxShadow: "0 25px 70px rgba(0,0,0,.45)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <Image
            src="/wolfloginv2.png"
            alt="Wolf Ordering"
            width={170}
            height={170}
            priority
          />

          <h1
            style={{
              color: "#fff",
              marginTop: "20px",
              fontSize: "34px",
              fontWeight: 800,
            }}
          >
            Restablecer contraseña
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: "10px",
            }}
          >
            Ingresa tu nueva contraseña.
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              color: "#bbb",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Nueva contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.03)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              color: "#bbb",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Confirmar contraseña
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.03)",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={updatePassword}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: "#f97316",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? "Actualizando..."
            : "Actualizar contraseña"}
        </button>
      </div>
    </main>
  );
}


