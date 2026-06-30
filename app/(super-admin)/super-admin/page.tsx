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
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#f97316", fontWeight: 700 }}>
          {title}
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)" }}>{icon}</div>
      </div>
      <div style={{ fontSize: "28px", fontWeight: 700 }}>{value}</div>
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
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
          background: "radial-gradient(circle at top left, rgba(249,115,22,.08), transparent 40%), rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "24px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ color: "#f97316" }}>{icon}</div>
          <h3 style={{ margin: 0, fontSize: "22px" }}>{title}</h3>
        </div>
        <p style={{ margin: 0, color: "#999", lineHeight: 1.6, fontSize: "15px" }}>{description}</p>
      </div>
    </Link>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "13px", fontWeight: 500 }}>
      {text}
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "30px" }}>
      
      <style jsx global>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .executive-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 42px !important; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <span style={{ color: "#f97316", fontWeight: 800, letterSpacing: "2px", fontSize: "12px" }}>WOLF OS</span>
        <LogoutButton />
      </div>

      <section style={{ marginBottom: "50px" }}>
        <h1 className="hero-title" style={{ fontSize: "60px", fontWeight: 900, marginTop: "0", marginBottom: "20px", lineHeight: 1 }}>
          Centro Global <br /> de Operaciones
        </h1>
        <p style={{ maxWidth: "600px", color: "#999", fontSize: "18px", lineHeight: 1.6 }}>
          Controla toda la infraestructura SaaS de Wolf Ordering desde un único centro ejecutivo.
        </p>
      </section>

      <section className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "50px" }}>
        <StatCard icon={<Store size={24} />} title="Restaurantes" value="∞" />
        <StatCard icon={<Users size={24} />} title="Usuarios" value="∞" />
        <StatCard icon={<DollarSign size={24} />} title="Facturación" value="Live" />
        <StatCard icon={<Globe size={24} />} title="Plataforma" value="Online" />
      </section>

      <section style={{ marginBottom: "50px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Gestión Principal</h2>
        <ModuleCard href="/super-admin/restaurants" icon={<Building2 size={32} />} title="Restaurantes" description="Centro de administración de restaurantes. Gestiona configuraciones, usuarios, roles, finanzas y operación completa." />
      </section>

      <section className="executive-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
          <h2 style={{ marginTop: 0, fontSize: "24px" }}>🚀 Wolf Ordering SaaS</h2>
          <p style={{ color: "#999", lineHeight: 1.6, fontSize: "15px" }}>Centraliza múltiples restaurantes en una sola plataforma. Cada restaurante posee sus propios usuarios, permisos y configuraciones.</p>
          
          <div style={{ marginTop: "25px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
            <FeatureItem text="Usuarios" /><FeatureItem text="Roles" /><FeatureItem text="Productos" /><FeatureItem text="Categorías" />
            <FeatureItem text="Galería" /><FeatureItem text="Pagos" /><FeatureItem text="Finanzas" /><FeatureItem text="Analytics" />
          </div>
        </div>
      </section>
      
      <div style={{ height: "40px" }} />
    </main>
  );
}