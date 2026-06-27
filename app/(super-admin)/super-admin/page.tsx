"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { Building2, Store, Users, DollarSign, Globe } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

type CardProps = {
  icon: ReactNode;
  title: string;
  value: string;
};

function StatCard({ icon, title, value }: CardProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: "28px",
        padding: "28px",
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#f97316",
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        <div>{icon}</div>
      </div>
      <div
        style={{
          fontSize: "36px",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

type ModuleCardProps = {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
};

function ModuleCard({ href, icon, title, description }: ModuleCardProps) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(circle at top left, rgba(249,115,22,.08), transparent 40%), rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "30px",
          padding: "35px",
          minHeight: "220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "20px",
          transition: "transform .2s ease, box-shadow .2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div>{icon}</div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "26px",
              }}
            >
              {title}
            </h3>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            color: "#999",
            lineHeight: 1.8,
            fontSize: "16px",
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: "22px",
        padding: "18px 20px",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#050505 0%,#090909 100%)",
        color: "#fff",
        padding: "60px",
      }}
    >
      {/* HERO */}

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

      <section
        style={{
          marginBottom: "60px",
        }}
      >
        <span
          style={{
            color: "#f97316",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          WOLF ORDERING OS
        </span>

        <h1
          style={{
            fontSize: "72px",
            fontWeight: 900,
            marginTop: "15px",
            marginBottom: "20px",
            lineHeight: 1,
          }}
        >
          Centro Global
          <br />
          de Operaciones
        </h1>

        <p
          style={{
            maxWidth: "900px",
            color: "#999",
            fontSize: "20px",
            lineHeight: 1.8,
          }}
        >
          Controla toda la infraestructura
          SaaS de Wolf Ordering desde un
          único centro ejecutivo.
        </p>
      </section>

      {/* KPIS */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginBottom: "70px",
        }}
      >
        <StatCard
          icon={<Store size={34} />}
          title="Restaurantes"
          value="∞"
        />

        <StatCard
          icon={<Users size={34} />}
          title="Usuarios"
          value="∞"
        />

        <StatCard
          icon={<DollarSign size={34} />}
          title="Facturación"
          value="Live"
        />

        <StatCard
          icon={<Globe size={34} />}
          title="Plataforma"
          value="Online"
        />
      </section>

      {/* MODULO PRINCIPAL */}

      <section
        style={{
          marginBottom: "70px",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            marginBottom: "25px",
          }}
        >
          Gestión Principal
        </h2>

        <ModuleCard
          href="/super-admin/restaurants"
          icon={<Building2 size={48} />}
          title="Restaurantes"
          description="Centro de administración de restaurantes. Desde aquí podrás gestionar configuraciones, usuarios, roles, finanzas, módulos visuales y operación completa."
        />
      </section>

      {/* PANEL EJECUTIVO */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "30px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "30px",
            padding: "35px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "30px",
            }}
          >
            🚀 Wolf Ordering SaaS
          </h2>

          <p
            style={{
              color: "#999",
              lineHeight: 1.9,
              fontSize: "16px",
            }}
          >
            Wolf Ordering centraliza
            múltiples restaurantes en una
            sola plataforma SaaS.
          </p>

          <p
            style={{
              color: "#999",
              lineHeight: 1.9,
            }}
          >
            Toda la administración se
            realiza desde el módulo de
            restaurantes, donde cada
            restaurante posee sus propios
            usuarios, permisos,
            configuraciones y módulos.
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: "15px",
            }}
          >
            <FeatureItem text="Usuarios y Accesos" />
            <FeatureItem text="Roles y Permisos" />
            <FeatureItem text="Productos" />
            <FeatureItem text="Categorías" />
            <FeatureItem text="Galería" />
            <FeatureItem text="Hero y Navbar" />
            <FeatureItem text="Pagos" />
            <FeatureItem text="Finanzas" />
            <FeatureItem text="Analytics" />
            <FeatureItem text="Configuraciones" />
          </div>
        </div>
      </section>
    </main>
  );
}

