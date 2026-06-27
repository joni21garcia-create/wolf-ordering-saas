"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const confirmLogout =
      confirm(
        "¿Desea cerrar sesión?"
      );

    if (!confirmLogout) return;

    await supabase.auth.signOut();

    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "14px",
        border:
          "1px solid rgba(255,255,255,.08)",
        background:
          "rgba(255,255,255,.04)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      <LogOut size={18} />
      Salir
    </button>
  );
}