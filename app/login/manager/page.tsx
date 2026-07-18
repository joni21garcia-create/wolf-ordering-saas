import type {
  Metadata,
  Viewport,
} from "next";

// Metadatos
export const metadata: Metadata = {
  manifest: "/api/pwa/manifest-manager",

  title: "Wolf Manager | Administración",

  description:
    "Panel de control administrativo de Wolf Ordering",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wolf Manager",
  },
};

// Viewport (Next.js 16)
export const viewport: Viewport = {
  themeColor: "#000000",
};

// Layout
export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="manager-layout-wrapper">
      {children}
    </div>
  );
}