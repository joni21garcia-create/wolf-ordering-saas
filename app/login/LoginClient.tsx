"use client";

import { InstallButton } from "@/components/pwa/InstallButton";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("wolf_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    setIsMounted(true);
  }, []);

  async function resetPassword() {
    try {
      if (!email) { alert("Ingrese su correo electrónico"); return; }
      const baseUrl = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`,
      });
      if (error) { alert(error.message); return; }
      alert("Se envió un enlace de recuperación a tu correo.");
    } catch (error) { console.error(error); alert("Error al enviar el enlace de recuperación"); }
  }

  async function loginWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { console.error(error); alert("Error al iniciar sesión con Google"); return; }
    } catch (error) { console.error(error); alert("Error al conectar con Google"); }
  }

  async function login() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { alert(error.message); return; }
      const { data: user, error: userError } = await supabase
        .from("restaurant_users")
        .select(`*, restaurant_roles (id, code, name)`)
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (userError || !user) { alert("Usuario no encontrado en el sistema"); return; }
      if (rememberMe) { localStorage.setItem("wolf_email", email); } else { localStorage.removeItem("wolf_email"); }
      
      const roleCode = user.restaurant_roles?.code;
      if (roleCode === "super-user" || roleCode === "owner") {
        router.push("/login/super-admin");
      } else {
        router.push(`/super-admin/restaurants/${user.restaurant_id}/restaurante/dashboard`);
      }
    } catch (err) { console.error(err); alert("Error al iniciar sesión."); } 
    finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.03)", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "16px"
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", overflowX: "hidden" }}>
      <div style={{ position: "absolute", top: "-180px", width: "100%", maxWidth: "520px", height: "520px", pointerEvents: "none", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,140,40,.14) 0%, transparent 70%)", filter: "blur(80px)", opacity: .95 }} />

      {isMounted && (
        <section style={{ 
          position: "relative", width: "100%", maxWidth: "540px", padding: "40px 20px", borderRadius: "34px", 
          background: "rgba(10,10,10,0.95)", border: "1px solid rgba(255,255,255,.05)", 
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)" 
        }}>
          
          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            {/* Contenedor blindado para la imagen */}
            <div style={{ width: "250px", height: "250px", margin: "0 auto 20px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,.25), transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image 
                src="/wolfloginv2.png" 
                alt="Wolf Ordering" 
                width={250} 
                height={250} 
                priority 
                style={{ width: "100%", height: "auto" }} 
              />
            </div>
            <span style={{ color: "#f97316", fontWeight: 700, letterSpacing: "6px", fontSize: "12px", textTransform: "uppercase" }}>WOLF ORDERING OS</span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#aaa" }}>Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#aaa" }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", fontSize: "14px" }}>
            <label style={{ color: "#999", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Recordarme
            </label>
            <button type="button" onClick={resetPassword} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer" }}>¿Olvidaste tu contraseña?</button>
          </div>

          <button onClick={login} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: "18px", border: "none", background: "#f97316", color: "#fff", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          
          <button onClick={loginWithGoogle} style={{ 
            width: "100%", marginTop: "16px", padding: "16px", borderRadius: "18px", 
            border: "1px solid #444", background: "transparent", color: "#fff", 
            fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", 
            justifyContent: "center", gap: "10px" 
          }}>
            <img src="https://www.google.com/favicon.ico" alt="Google" width="20" height="20" />
            Continuar con Google
          </button>

          <div style={{ marginTop: "20px" }}><InstallButton /></div>
        </section>
      )}
    </main>
  );
}