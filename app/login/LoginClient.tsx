"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import LoginView from "./LoginView";
import { registerWeb } from "@/lib/push/registerWeb";
import { enableBiometric } from "@/lib/biometric/enableBiometric";
import {
  getBiometricUser,
  saveBiometricUser,
  clearBiometricUser,
} from "@/lib/biometric/storage";
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";

type Session = NonNullable<
  Awaited<
    ReturnType<typeof supabase.auth.getSession>
  >["data"]["session"]
>;

export default function LoginClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const biometricStartedRef = useRef(false);
  const mountedRef = useRef(false);

  // ==========================
  // Flujo común después del login
  // ==========================

  async function finishLogin(session: Session) {
    console.log("[LOGIN] Finalizando login...");

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

    console.log("[LOGIN] restaurantUser:", {
      found: !!restaurantUser,
      error: userError,
    });

    if (userError) {
      console.error(
        "[LOGIN] Error buscando restaurantUser:",
        userError
      );
      alert("No fue posible obtener los datos del usuario.");
      return;
    }

    if (!restaurantUser) {
      alert("Usuario no encontrado.");
      return;
    }

    if (rememberMe && email) {
      localStorage.setItem("wolf_email", email);
    } else if (!rememberMe) {
      localStorage.removeItem("wolf_email");
    }

    // ==========================
    // Registro Push
    // ==========================

    try {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.ready;
      }

      console.log("[LOGIN][WEB] Registrando Push...");

      await registerWeb({
        restaurantId: restaurantUser.restaurant_id,
        userId: session.user.id,
      });

      console.log("[LOGIN][WEB] Push registrado.");
    } catch (error) {
      console.error(
        "[LOGIN][WEB] Error registrando Push:",
        error
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    // ==========================
    // Pending Push
    // ==========================

    const pendingUrl =
      localStorage.getItem("pendingPushUrl");

    if (pendingUrl) {
      localStorage.removeItem("pendingPushUrl");
      window.location.replace(pendingUrl);
      return;
    }

    // ==========================
    // Redirección por rol
    // ==========================

    const role =
      restaurantUser.restaurant_roles?.code;

    if (role === "super-user" || role === "owner") {
      window.location.replace("/login/super-admin");
      return;
    }

    window.location.replace(
      `/super-admin/restaurants/${restaurantUser.restaurant_id}/restaurante/dashboard`
    );
  }

  // ==========================
  // Login con biometría
  // ==========================

  async function loginWithBiometric() {
    if (loading) return;

    try {
      setLoading(true);

      console.log(
        "[BIOMETRIC] Iniciando login biométrico..."
      );

      const biometricUser =
        await getBiometricUser();

      if (
        !biometricUser?.enabled ||
        !biometricUser.refreshToken
      ) {
        console.log(
          "[BIOMETRIC] No hay credencial biométrica válida."
        );

        setBiometricEnabled(false);
        return;
      }

      await BiometricAuth.authenticate({
        reason: "Confirma tu identidad para ingresar",
        allowDeviceCredential: true,
      });

      console.log("[BIOMETRIC] Huella validada.");

      const {
        data,
        error,
      } = await supabase.auth.refreshSession({
        refresh_token: biometricUser.refreshToken,
      });

      if (error || !data.session) {
        console.error(
          "[BIOMETRIC] Error recuperando sesión:",
          error
        );

        await clearBiometricUser();
        setBiometricEnabled(false);

        alert(
          "La sesión biométrica ya no es válida. Ingresa con tu contraseña."
        );

        return;
      }

      const session = data.session;

      // Supabase puede rotar el refresh token.
      // Guardamos el nuevo inmediatamente.
      await saveBiometricUser({
        ...biometricUser,
        userId: session.user.id,
        refreshToken: session.refresh_token,
        enabled: true,
      });

      console.log(
        "[BIOMETRIC] Sesión recuperada correctamente."
      );

      // IMPORTANTE:
      // Continúa por el mismo flujo que el login normal.
      await finishLogin(session);
    } catch (error) {
      console.error(
        "[BIOMETRIC] Autenticación cancelada o fallida:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // Inicialización
  // ==========================

  useEffect(() => {
    mountedRef.current = true;

    async function initializeLogin() {
      const savedEmail =
        localStorage.getItem("wolf_email");

      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }

      let hasBiometric = false;

      try {
        const biometricUser =
          await getBiometricUser();

        hasBiometric =
          biometricUser?.enabled === true &&
          typeof biometricUser.refreshToken === "string" &&
          biometricUser.refreshToken.length > 0;

        if (hasBiometric) {
          setBiometricEnabled(true);

          console.log(
            "[BIOMETRIC] Usuario con huella activada."
          );
        }
      } catch (error) {
        console.error(
          "[BIOMETRIC] Error leyendo almacenamiento:",
          error
        );
      }

      if (!mountedRef.current) return;

      setIsMounted(true);

      // Abrir automáticamente el diálogo nativo.
      if (hasBiometric) {
        window.setTimeout(() => {
          if (
            mountedRef.current &&
            !biometricStartedRef.current
          ) {
            biometricStartedRef.current = true;

            console.log(
              "[BIOMETRIC] Iniciando autenticación automática..."
            );

            void loginWithBiometric();
          }
        }, 600);
      }
    }

    void initializeLogin();

    // Mantener actualizado el refresh token cuando Supabase lo rote.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[AUTH]", event);

        if (
          session &&
          (
            event === "TOKEN_REFRESHED" ||
            event === "SIGNED_IN"
          )
        ) {
          void (async () => {
            try {
              const biometricUser =
                await getBiometricUser();

              if (
                biometricUser?.enabled &&
                session.refresh_token
              ) {
                await saveBiometricUser({
                  ...biometricUser,
                  userId: session.user.id,
                  refreshToken: session.refresh_token,
                  enabled: true,
                });

                console.log(
                  "[BIOMETRIC] Refresh token actualizado."
                );
              }
            } catch (error) {
              console.error(
                "[BIOMETRIC] Error sincronizando refresh token:",
                error
              );
            }
          })();
        }
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
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
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${baseUrl}/reset-password`,
          }
        );

      if (error) {
        alert(error.message);
        return;
      }

      alert("Se envió un enlace de recuperación.");
    } catch (error) {
      console.error(error);
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
            redirectTo:
              `${window.location.origin}/api/auth/callback`,
          },
        });

      if (error) {
        alert(error.message);
      }
    } catch (error) {
      console.error(error);
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

      let session: Session | null = null;

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

      // Activación inicial de biometría.
      const activate = window.confirm(
        "¿Quieres activar el ingreso con huella en este dispositivo?"
      );

      if (activate) {
        const enabled =
          await enableBiometric(session.user.id);

        if (enabled) {
          setBiometricEnabled(true);

          console.log(
            "[LOGIN] Ingreso con huella activado."
          );
        }
      }

      // Mismo flujo final para login normal y biométrico.
      await finishLogin(session);
    } catch (error) {
      console.error(error);
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
      loginWithBiometric={loginWithBiometric}
      biometricEnabled={biometricEnabled}
    />
  );
}
