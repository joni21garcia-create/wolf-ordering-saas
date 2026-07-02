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
  maximumScale: 1, // Previene zoom accidental
  userScalable: false,
  viewportFit: "cover", // Muy importante para pantallas con notch
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
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body className="text-white bg-[#050505] antialiased overflow-x-hidden">
        
        {/* Capas decorativas fijas: añadimos pointer-events-none para no bloquear clics */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="wolf-orb-top" />
          <div className="wolf-orb-bottom" />
          <div className="stripe-lines" />
          <ParticlesBackground />
        </div>

        <SessionProvider>
          <ServiceWorkerProvider />
          <InstallProvider>
            <UpdateBanner />
            {/* main envuelto para asegurar que ocupe todo el espacio */}
            <main className="relative min-h-screen">
              {children}
            </main>
          </InstallProvider>
        </SessionProvider>
      </body>
    </html>
  );
}