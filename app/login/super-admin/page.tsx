"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SuperAdminLoginPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState(
      "Validando credenciales..."
    );

useEffect(() => {
  const timer = setTimeout(() => {
    validateUser();
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  async function validateUser() {
    try {

      const {
        data: { user: authUser },
      } =

      
        await supabase.auth.getUser();

        

      if (!authUser) {
        router.push("/login");
        return;
      }


      
      const { data: user } =
        await supabase
          .from("restaurant_users")
          .select(`
            *,
            restaurant_roles (
              code,
              name
            )
          `)
          .eq(
            "auth_user_id",
            authUser.id
          )
          .single();

      if (!user) {
        router.push("/login");
        return;
      }

      const role =
        user.restaurant_roles?.code;

      const isSuperAdmin =
        role === "super-user" ||
        role === "owner";

      if (!isSuperAdmin) {
        window.location.href =
          `/super-admin/restaurants/${user.restaurant_id}/restaurante/dashboard`;
        return;
      }

      setMessage(
        "Acceso autorizado..."
      );

      setTimeout(() => {
        router.push("/super-admin");
      }, 1200);
    } catch (error) {
      console.error(error);

      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "#050505",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          textAlign: "center",
        }}
      >
        <Shield
          size={90}
          color="#f97316"
        />

        <h1
          style={{
            fontSize: "56px",
            marginTop: "25px",
            marginBottom: "15px",
          }}
        >
          Wolf Security Layer
        </h1>

        <p
          style={{
            color: "#888",
            fontSize: "18px",
          }}
        >
          Validando acceso al centro
          de control global.
        </p>

        <div
          style={{
            marginTop: "40px",
          }}
        >
          <Loader2
            size={42}
            className="animate-spin"
          />

          <p
            style={{
              marginTop: "20px",
              color: "#999",
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </main>
  );
}