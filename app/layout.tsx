import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ParticlesBackground from "@/components/ParticlesBackground";
import { SessionProvider } from "@/providers/SessionProvider";
import ServiceWorkerProvider from "@/components/pwa/ServiceWorkerProvider";
import UpdateBanner from "@/components/pwa/UpdateBanner";
import InstallProvider from "@/components/pwa/InstallProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://app.wolfordering.com"),
  title: "Wolf Ordering",
  description: "Sistema SaaS de pedidos digitales para restaurantes",
  appleWebApp: { capable: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="es" 
      className={`${geistSans.variable} ${geistMono.variable}`} 
    >
      <body className="text-white bg-[#050505] antialiased min-h-screen relative overflow-x-hidden">
        
        {/* DECORACIÓN: Envuelta en un contenedor que no interfiera con el scroll */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="wolf-orb-top" />
          <div className="wolf-orb-bottom" />
          <div className="stripe-lines" />
          <ParticlesBackground />
        </div>
        
        {/* ESTRUCTURA PRINCIPAL:
            Usamos un flexbox para asegurar que el footer siempre esté abajo si es necesario
            y que el contenido fluya limpiamente.
        */}
        <SessionProvider>
          <ServiceWorkerProvider />
          <InstallProvider>
            <UpdateBanner />
            <main className="w-full relative">
              {children}
            </main>
          </InstallProvider>
        </SessionProvider>
        
      </body>
    </html>
  );
}