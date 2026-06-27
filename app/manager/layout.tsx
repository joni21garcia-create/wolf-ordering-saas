import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wolf Ordering Manager",

  description: "Panel administrativo Wolf Ordering",

  manifest: "/manager/manifest.webmanifest",

  themeColor: "#f97316",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wolf Ordering Manager",
  },
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}