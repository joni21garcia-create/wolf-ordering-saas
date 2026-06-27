"use client";

import PermissionGuard from "@/components/auth/PermissionGuard";
import RestaurantForm from "@/components/super-admin/restaurants/RestaurantForm";

export default function NewRestaurantPage() {
return (
  <PermissionGuard permission="restaurants">
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#050505 0%,#0f172a 100%)",
        padding: "60px 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              borderRadius: "999px",
              background:
                "rgba(249,115,22,.12)",
              border:
                "1px solid rgba(249,115,22,.2)",
              color: "#f97316",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            🚀 Nuevo Restaurante
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "64px",
              fontWeight: "900",
              margin: 0,
            }}
          >
            Crear Restaurante
          </h1>

          <p
            style={{
              color: "#94a3b8",
              maxWidth: "700px",
              margin: "20px auto 0 auto",
              lineHeight: 1.8,
              fontSize: "18px",
            }}
          >
            Configura los datos básicos del
            restaurante. Después podrás
            personalizar Hero, Menú,
            Temas, Delivery, Horarios y
            toda la experiencia Wolf.
          </p>
        </div>

        {/* BENEFICIOS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div style={infoCard}>
            <div style={emoji}>
              ⚡
            </div>

            <h3>
              Creación rápida
            </h3>

            <p>
              Configura un restaurante
              en menos de 3 minutos.
            </p>
          </div>

          <div style={infoCard}>
            <div style={emoji}>
              🎨
            </div>

            <h3>
              Personalizable
            </h3>

            <p>
              Colores, branding y diseño
              totalmente configurable.
            </p>
          </div>

          <div style={infoCard}>
            <div style={emoji}>
              📱
            </div>

            <h3>
              Pedidos Online
            </h3>

            <p>
              Delivery, Pickup y
              WhatsApp integrados.
            </p>
          </div>

          <div style={infoCard}>
            <div style={emoji}>
              🚀
            </div>

            <h3>
              Escalable
            </h3>

            <p>
              Preparado para crecer con
              el ecosistema Wolf Ordering.
            </p>
          </div>
        </div>

        {/* FORMULARIO */}

        <div
          style={{
            background:
              "rgba(17,17,17,.92)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "32px",
            padding: "40px",
            backdropFilter:
              "blur(20px)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <h2
              style={{
                color: "#fff",
                marginBottom: "10px",
              }}
            >
              Información Básica
            </h2>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.7,
              }}
            >
              Completa los campos
              principales para generar
              la landing inicial del
              restaurante.
            </p>
          </div>

          <RestaurantForm
            mode="create"
          />
        </div>
      </div>
    </main>
  </PermissionGuard>
  );
}

const infoCard = {
  background:
    "rgba(17,17,17,.85)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "24px",
  padding: "24px",
  color: "#fff",
  backdropFilter: "blur(12px)",
};

const emoji = {
  fontSize: "34px",
  marginBottom: "15px",
};