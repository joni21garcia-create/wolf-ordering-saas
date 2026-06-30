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

// Configuración flexible para que el móvil se comporte como un sitio web estándar
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  // Al eliminar maximumScale y userScalable, el usuario puede hacer zoom y navegar con libertad
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
  // Comentamos estas etiquetas para evitar que el navegador fuerce el modo pantalla completa ("App")
  /*
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
  */
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="es" 
      className={`${geistSans.variable} ${geistMono.variable}`} 
      data-scroll-behavior="smooth"
    >
      <body className="text-white bg-[#050505] antialiased">
        <div className="wolf-orb-top" />
        <div className="wolf-orb-bottom" />
        <div className="stripe-lines" />
        
        <ParticlesBackground />
        
        <SessionProvider>
          <ServiceWorkerProvider />
          <InstallProvider>
            <UpdateBanner />
            <main className="min-h-screen">
              {children}
            </main>
          </InstallProvider>
        </SessionProvider>
      </body>
    </html>
  );
}