"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function RestaurantRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/login");
        return;
      }

      const { data: user } =
        await supabase
          .from("restaurant_users")
          .select(`
            restaurant_id,
            restaurant_roles (
              code
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

      window.location.href =
        `/super-admin/restaurants/${user.restaurant_id}/restaurante/dashboard`;
    } catch (err) {
      console.error(err);

      router.push("/login");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
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
        <Store
          size={80}
          color="#f97316"
        />

        <h1>
          Cargando Restaurante
        </h1>

        <Loader2
          size={40}
          className="animate-spin"
        />
      </div>
    </main>
  );
}