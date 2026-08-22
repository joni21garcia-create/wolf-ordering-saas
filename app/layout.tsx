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
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://app.wolfordering.com"),
  title: "Wolf Ordering",
  description:
    "Sistema SaaS de pedidos digitales para restaurantes",

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          overflow-x-hidden
        "
      >
        {/* Capas decorativas */}
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