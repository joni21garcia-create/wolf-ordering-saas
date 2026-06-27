"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ManagerPage() {
  const router = useRouter();

  const [branding, setBranding] = useState({
    app_name: "Wolf Ordering",
    app_logo: "",
    theme_color: "#f97316",
    background_color: "#050505",
  });

  useEffect(() => {
    validateUser();
  }, []);

  async function validateUser() {
    try {
      //---------------------------------------
      // Cargar Branding de la PWA
      //---------------------------------------

      const brandingResponse = await fetch(
        "/api/pwa/get-manager-pwa"
      );

      const brandingJson =
        await brandingResponse.json();

      if (brandingJson.success) {
        setBranding({
          app_name:
            brandingJson.settings.app_name,
          app_logo:
            brandingJson.settings.app_logo,
          theme_color:
            brandingJson.settings.theme_color,
          background_color:
            brandingJson.settings.background_color,
        });
      }

      //---------------------------------------
      // Usuario autenticado
      //---------------------------------------

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.replace("/login");
        return;
      }

      //---------------------------------------
      // Obtener rol
      //---------------------------------------

      const { data: user } = await supabase
        .from("restaurant_users")
        .select(`
          restaurant_id,
          restaurant_roles (
            code
          )
        `)
        .eq("auth_user_id", authUser.id)
        .single();

      if (!user) {
        router.replace("/login");
        return;
      }

      //---------------------------------------
      // Redirección
      //---------------------------------------

      const role =
        user.restaurant_roles?.code;

      switch (role) {
        case "super-user":
        case "owner":
          router.replace("/super-admin");
          break;

        default:
          router.replace(
            `/super-admin/restaurants/${user.restaurant_id}/restaurante/dashboard`
          );
      }
    } catch (error) {
      console.error(error);
      router.replace("/login");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          branding.background_color,
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        {branding.app_logo ? (
          <img
  src={branding.app_logo}
  alt={branding.app_name}
  style={{
    display: "block",
    width: 90,
    height: 90,
    objectFit: "contain",
    margin: "0 auto 20px",
  }}
/>
        ) : (
          <Shield
            size={80}
            color={branding.theme_color}
          />
        )}

        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {branding.app_name}
        </h1>

        <p
          style={{
            color: "#d4d4d8",
            marginBottom: 35,
          }}
        >
          Inicializando aplicación...
        </p>

        <Loader2
          size={42}
          color={branding.theme_color}
          className="animate-spin"
        />
      </div>
    </main>
  );
}