import type { Metadata } from "next";
import RegisterSW from "./RegisterSW"; // Importa tu registrador de Service Worker sin moverlo de sitio

// Dejamos la ruta del manifiesto EXACTAMENTE como la tenías originalmente para no romper nada
export const metadata: Metadata = {
  manifest: "/api/manifest/manager",
  title: "Wolf Ordering",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 1. Registramos el Service Worker en segundo plano */}
      <RegisterSW /> 
      {/* 2. Renderizamos el login normal */}
      {children}
    </>
  );
}