"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      // Esperar un momento para que Supabase
      // termine de guardar la sesión.

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);

      if (!session) {
        router.replace("/login");
        return;
      }

      const user = session.user;

      const {
        data: restaurantUser,
        error,
      } = await supabase
        .from("restaurant_users")
        .select(`
          *,
          restaurant_roles (
            code,
            name
          )
        `)
        .eq("email", user.email)
        .single();

      if (error || !restaurantUser) {
        console.error(error);

        router.replace("/login?error=no-access");
        return;
      }

      if (
        restaurantUser.auth_user_id !==
        user.id
      ) {
        await supabase
          .from("restaurant_users")
          .update({
            auth_user_id: user.id,
          })
          .eq(
            "id",
            restaurantUser.id
          );
      }

      const role =
        restaurantUser.restaurant_roles
          ?.code;

      console.log("ROLE:", role);

      if (role === "super-user") {
        router.replace("/super-admin");
        return;
      }

      router.replace(
        `/super-admin/restaurants/${restaurantUser.restaurant_id}/restaurante/dashboard`
      );
    } catch (err) {
      console.error(err);

      router.replace("/login");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#050505",
        color: "#fff",
        fontSize: "22px",
      }}
    >
      Iniciando sesión...
    </main>
  );
}