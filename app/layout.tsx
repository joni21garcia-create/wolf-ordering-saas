import type { Metadata, Viewport } from "next";
import "./globals.css";

import ParticlesBackground from "@/components/ParticlesBackground";
import { SessionProvider } from "@/providers/SessionProvider";
import ServiceWorkerProvider from "@/components/pwa/ServiceWorkerProvider";
import UpdateBanner from "@/components/pwa/UpdateBanner";
import InstallProvider from "@/components/pwa/InstallProvider";
import AppSplash from "@/components/splash/AppSplash";



export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Previene zoom accidental
  userScalable: false,
  viewportFit: "cover", // Muy importante para pantallas con notch
};

export const metadata: Metadata = {
  metadataBase: new URL("https://app.wolfordering.com"),
  title: "Wolf Ordering",
  description: "Sistema SaaS de pedidos digitales para restaurantes",
  // ❌ SE ELIMINÓ LA PROPIEDAD "manifest" DE AQUÍ
  // Esto evita que el login y el restaurante intenten cargar el manifest del manager por defecto.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wolf Ordering",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
  lang="es"
  suppressHydrationWarning
  data-scroll-behavior="smooth"
>
<body
  className="
    bg-[#050505]
    text-white
    antialiased
    overscroll-none
  "
  style={{
    minHeight: "100dvh",
    overflow: "hidden",
  }}
>
        
        {/* Capas decorativas fijas con pointer-events-none */}
        <div
  className="
    fixed
    inset-0
    pointer-events-none
    overflow-hidden
    -z-10
  "
>
          <div className="wolf-orb-top" />
          <div className="wolf-orb-bottom" />
          <div className="stripe-lines" />
          <ParticlesBackground />
        </div>

 <SessionProvider>
  <AppSplash>
    
    
    <ServiceWorkerProvider />

    <InstallProvider>
      <UpdateBanner />


<main
  style={{
    position: "relative",
    width: "100%",
    minHeight: "100dvh",
    overflowX: "hidden",
    overflowY: "auto",

    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "env(safe-area-inset-bottom)",

    WebkitOverflowScrolling: "touch",
  }}
>

        {children}
      </main>

    </InstallProvider>
  </AppSplash>
</SessionProvider>
      </body>
    </html>
  );
}