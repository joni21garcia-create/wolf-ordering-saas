"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import LoginView from "./LoginView";

export default function LoginClient() {
  // ==========================
  // Estados
  // ==========================

  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ==========================
  // Inicialización
  // ==========================

  useEffect(() => {
    const savedEmail = localStorage.getItem("wolf_email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    setIsMounted(true);
  }, []);

  // ==========================
  // Recuperar contraseña
  // ==========================

  async function resetPassword() {
    try {
      if (!email) {
        alert("Ingrese su correo electrónico");
        return;
      }

      const baseUrl = window.location.origin;

      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${baseUrl}/reset-password`,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Se envió un enlace de recuperación.");
    } catch (err) {
      console.error(err);
      alert("Error al enviar recuperación.");
    }
  }

  // ==========================
  // Login Google
  // ==========================

  async function loginWithGoogle() {
    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });

      if (error) {
        alert(error.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ==========================
  // Login Email
  // ==========================

  async function login() {
    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      let session = null;

      for (let i = 0; i < 10; i++) {
        const result =
          await supabase.auth.getSession();

        session = result.data.session;

        if (session) break;

        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );
      }

      if (!session) {
        alert("No fue posible crear la sesión.");
        return;
      }

      const {
        data: restaurantUser,
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
        .eq("auth_user_id", session.user.id)
        .maybeSingle();

      if (userError || !restaurantUser) {
        alert("Usuario no encontrado.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("wolf_email", email);
      } else {
        localStorage.removeItem("wolf_email");
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      const role =
        restaurantUser.restaurant_roles?.code;

      if (
        role === "super-user" ||
        role === "owner"
      ) {
        window.location.replace(
          "/login/super-admin"
        );
      } else {
        window.location.replace(
          `/super-admin/restaurants/${restaurantUser.restaurant_id}/restaurante/dashboard`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // Vista
  // ==========================

  return (
    <LoginView
      isMounted={isMounted}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      resetPassword={resetPassword}
      loginWithGoogle={loginWithGoogle}
      login={login}
    />
  );
}


