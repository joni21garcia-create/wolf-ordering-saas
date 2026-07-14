import type { Metadata, Viewport } from "next";
import RegisterSW from "../RegisterSW"; // 👈 CORRECCIÓN: Agregamos ".." para subir de carpeta

// 1. Next.js requiere themeColor por separado en "viewport" para evitar advertencias de compilación
export const viewport: Viewport = {
  themeColor: "#000000",
};

// 2. Tu metadata original queda intacta y apuntando al manifiesto correcto
export const metadata: Metadata = {
  manifest: "/api/manifest/manager", 
  title: "Wolf Manager | Administración",
  description: "Panel de control administrativo de Wolf Ordering",
  
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wolf Manager",
  },
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="manager-layout-wrapper">
      <RegisterSW /> {/* Mantén aquí tu registrador que ya está funcionando */}
      {children}
    </div>
  );
}