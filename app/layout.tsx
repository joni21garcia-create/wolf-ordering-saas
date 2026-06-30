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
  manifest: "/api/manifest/manager",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wolf Ordering",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="es" 
      className={`${geistSans.variable} ${geistMono.variable}`} 
      data-scroll-behavior="smooth"
      style={{ backgroundColor: '#050505' }} // Forzamos color de fondo en el HTML raíz
    >
      <body className="text-white bg-[#050505] antialiased min-h-screen">
        {/* Capas decorativas de fondo */}
        <div className="wolf-orb-top" />
        <div className="wolf-orb-bottom" />
        <div className="stripe-lines" />
        
        <ParticlesBackground />
        
        <SessionProvider>
          <ServiceWorkerProvider />
          <InstallProvider>
            <UpdateBanner />
            <main>
              {children}
            </main>
          </InstallProvider>
        </SessionProvider>
      </body>
    </html>
  );
}