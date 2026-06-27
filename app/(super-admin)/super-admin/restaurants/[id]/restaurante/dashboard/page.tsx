"use client";

import Link from "next/link";
import {
  ShoppingCart,
  BarChart3,
  Settings,
  ArrowRight,
  ShieldCheck,
  Activity,
  ChefHat,
} from "lucide-react";

import { useSession } from "@/providers/SessionProvider";
import LogoutButton from "@/components/auth/LogoutButton";

export default function RestaurantDashboard() {
  const { user } = useSession();

const modules =
  user?.permissions || [];

  const canOrders =
  modules.includes("orders");

const canAnalytics =
  modules.includes("analytics");

const canSettings =
  modules.length > 0;

  const settingsUrl = user
    ? `/super-admin/restaurants/${user.restaurant_id}/settings`
    : "#";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "60px",
        color: "#fff",
        maxWidth: "1700px",
        margin: "0 auto",
      }}
    >
      {/* HERO */}

      <section
        style={{
          marginBottom: "50px",
        }}
      >
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
  }}
>
  <div>
    {/* contenido hero */}
  </div>

  <LogoutButton />
</div>


        <span
          style={{
            color: "#f97316",
            fontWeight: 700,
            letterSpacing: "2px",
          }}

        
        >
          WOLF RESTAURANT OS
        </span>

        <h1
          style={{
            fontSize: "72px",
            fontWeight: 900,
            marginTop: "12px",
            marginBottom: "10px",
            lineHeight: 1,
          }}
        >
          Bienvenido
          <br />
          {user?.full_name || "Usuario"}
        </h1>

        <p
          style={{
            color: "#999",
            fontSize: "20px",
            lineHeight: 1.8,
            maxWidth: "900px",
          }}
        >
          Acceso operativo del restaurante.
          Tu panel se adapta automáticamente
          según tu rol y permisos.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <Badge
            text={
              user?.role?.name ||
              "Sin Rol"
            }
          />

          <Badge
            text={`${user?.permissions?.length || 0} módulos habilitados`}
          />

          <Badge
            text="Sistema Online"
          />
        </div>
      </section>

      {/* KPIS */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginBottom: "60px",
        }}
      >
        <KpiCard
          icon={<ShoppingCart />}
          title="Pedidos"
          value="Live"
        />

        <KpiCard
          icon={<BarChart3 />}
          title="Analytics"
          value="Activo"
        />

        <KpiCard
          icon={<ShieldCheck />}
          title="Permisos"
          value={
            String(
              user?.permissions?.length || 0
            )
          }
        />

        <KpiCard
          icon={<Activity />}
          title="Estado"
          value="Online"
        />
      </section>

      {/* MODULOS PRINCIPALES */}

      <h2
        style={{
          fontSize: "34px",
          marginBottom: "25px",
        }}
      >
        Centro Operativo
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(350px,1fr))",
          gap: "25px",
          marginBottom: "60px",
        }}
      >
       {canOrders && (
  <MainCard
    href="/admin/orders"
    icon={<ShoppingCart size={42} />}
    title="Pedidos"
    description="Gestiona pedidos en tiempo real. Acepta, prepara y controla toda la operación del restaurante."
  />
)}

{canAnalytics && (
  <MainCard
    href="/admin/analytics"
    icon={<BarChart3 size={42} />}
    title="Analytics"
    description="Visualiza ventas, crecimiento, conversión y comportamiento de clientes."
  />
)}

{canSettings && (
  <MainCard
    href={settingsUrl}
    icon={<Settings size={42} />}
    title="Configuración Restaurante"
    description="Accede únicamente a los módulos autorizados por tu rol."
  />
)}
      </div>

      {/* PANEL PREMIUM */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.5fr 1fr",
          gap: "25px",
        }}
      >
        <div
          style={{
            background:
              "rgba(255,255,255,.03)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "30px",
            padding: "35px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            🚀 Acceso Inteligente por Rol
          </h2>

          <p
            style={{
              color: "#999",
              lineHeight: 1.9,
            }}
          >
            Wolf Ordering carga
            automáticamente los módulos
            permitidos según los permisos
            asignados a tu rol.
          </p>

          <p
            style={{
              color: "#999",
              lineHeight: 1.9,
            }}
          >
            No necesitas recordar rutas,
            configuraciones ni accesos.
            El sistema mostrará únicamente
            las herramientas que puedes
            utilizar dentro del restaurante.
          </p>

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <PermissionList
              permissions={
                user?.permissions || []
              }
            />
          </div>
        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,.03)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "30px",
            padding: "35px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            📡 Estado Operativo
          </h2>

          <Status text="Sistema Online" />
          <Status text="Permisos Cargados" />
          <Status text="Sincronización Activa" />
          <Status text="Restaurante Operativo" />
        </div>
      </section>
    </main>
  );
}

function Badge({
  text,
}: {
  text: string;
}) {
  return (
    <div
      style={{
        background:
          "rgba(249,115,22,.15)",
        border:
          "1px solid rgba(249,115,22,.25)",
        padding: "10px 16px",
        borderRadius: "999px",
        color: "#f97316",
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}

function KpiCard({
  icon,
  title,
  value,
}: any) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.03)",
        border:
          "1px solid rgba(255,255,255,.08)",
        borderRadius: "24px",
        padding: "24px",
      }}
    >
      <div
        style={{
          color: "#f97316",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          marginTop: "15px",
          color: "#888",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "38px",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MainCard({
  href,
  icon,
  title,
  description,
}: any) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          background:
            "rgba(255,255,255,.03)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "35px",
          color: "#fff",
          height: "100%",
        }}
      >
        <div
          style={{
            color: "#f97316",
          }}
        >
          {icon}
        </div>

        <h2>{title}</h2>

        <p
          style={{
            color: "#999",
            lineHeight: 1.8,
          }}
        >
          {description}
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#f97316",
            fontWeight: 700,
          }}
        >
          Abrir módulo
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}

function Status({
  text,
}: {
  text: string;
}) {
  return (
    <div
      style={{
        marginBottom: "18px",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <ChefHat size={18} />
      {text}
    </div>
  );
}

function PermissionList({
  permissions,
}: any) {
  if (!permissions.length) {
    return (
      <div
        style={{
          color: "#777",
        }}
      >
        Sin permisos cargados
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {permissions.map(
        (permission: string) => (
          <span
            key={permission}
            style={{
              background:
                "rgba(249,115,22,.12)",
              border:
                "1px solid rgba(249,115,22,.2)",
              padding:
                "8px 12px",
              borderRadius:
                "999px",
              color: "#f97316",
            }}
          >
            {permission}
          </span>
        )
      )}
    </div>
  );
}