import type { Metadata } from "next";

// 1. Definimos los metadatos específicos para esta ruta
// Esto sobrescribe cualquier configuración de metadatos del layout raíz
export const metadata: Metadata = {
  // Apunta a tu API que genera el JSON del manifiesto para Manager
  manifest: "/api/pwa/manifest-manager", 
  
  title: "Wolf Manager | Administración",
  description: "Panel de control administrativo de Wolf Ordering",
  
  // Color del tema cuando la PWA se abre en standalone
  themeColor: "#000000", 

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wolf Manager",
  },
};

// 2. Exportamos el layout que envolverá tu página de login
export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Nota: No necesitamos envolver con SessionProvider ni otros providers aquí
  // porque ya están en el RootLayout.tsx principal. 
  // Este layout solo se encarga de inyectar los metadatos PWA correctos.
  return (
    <div className="manager-layout-wrapper">
      {children}
    </div>
  );
}