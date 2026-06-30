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
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Esto es vital para el notch
  // Nuevas mejoras:
  colorScheme: "dark", // Indica al SO que fuerce modo oscuro instantáneo
  interactiveWidget: "resizes-content", // Evita que el teclado aplaste el diseño de forma brusca
};

// Metadatos para activar el modo standalone
export const metadata: Metadata = {
  metadataBase: new URL("https://app.wolfordering.com"),
  title: "Wolf Ordering",
  description: "Sistema SaaS de pedidos digitales",
  manifest: "/api/manifest/manager", // Esta ruta ya confirmamos que devuelve el JSON correcto
  appleWebApp: {
    capable: true, // Habilita modo app en iOS
    statusBarStyle: "black-translucent", // Barra de estado negra
    title: "Wolf Ordering",
  },
  other: {
    "mobile-web-app-capable": "yes", // Habilita modo app en Android
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="es" 
      className={`${geistSans.variable} ${geistMono.variable}`} 
      data-scroll-behavior="smooth"
      style={{ backgroundColor: '#050505' }} // Fondo instantáneo
    >
      <body className="text-white bg-[#050505] antialiased min-h-screen">
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