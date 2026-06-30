import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import ParticlesBackground from "@/components/ParticlesBackground";
import { SessionProvider } from "@/providers/SessionProvider";
import ServiceWorkerProvider from "@/components/pwa/ServiceWorkerProvider";
import UpdateBanner from "@/components/pwa/UpdateBanner";
import InstallProvider from "@/components/pwa/InstallProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// MODIFICACIÓN: Forzamos un ancho de 1200px.
// Esto hará que el móvil "zoom-out" automáticamente a tu diseño de escritorio, 
// evitando que el navegador piense que necesitas el modo sitio para computadoras.
export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "1200", 
  initialScale: 0.5, // Empezará un poco más alejado para encajar el ancho
  maximumScale: 2.0, 
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://app.wolfordering.com"),
  title: "Wolf Ordering",
  description: "Sistema SaaS de pedidos digitales para restaurantes",
  manifest: "/api/manifest/manager", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wolf Ordering",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Agregamos una etiqueta meta extra para asegurar que Safari y Chrome 
            respeten la escala en iOS y Android al instalar */}
        <meta name="viewport" content="width=1200, initial-scale=0.5" />
      </head> 
      
      <body className="text-white">
        <div className="wolf-orb-top" />
        <div className="wolf-orb-bottom" />
        <div className="stripe-lines" />

        <ParticlesBackground />

        <SessionProvider>
          <ServiceWorkerProvider />
          <InstallProvider>
           <UpdateBanner />
           {children}
          </InstallProvider>
        </SessionProvider>
      </body>
    </html>
  );
}