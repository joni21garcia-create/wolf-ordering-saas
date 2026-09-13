import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "./globals.css";
import "@/components/restaurant/DesignChrome.css";
import "@/components/restaurant/PublicRestaurantStyles.css";

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
        {/* =====================================================
            GOOGLE ANALYTICS
            Measurement ID: G-2GC9MZ8PBJ
        ====================================================== */}

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2GC9MZ8PBJ"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-2GC9MZ8PBJ');
          `}
        </Script>

        {/* =====================================================
            CAPAS DECORATIVAS
        ====================================================== */}

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

        {/* =====================================================
            SESSION
        ====================================================== */}

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