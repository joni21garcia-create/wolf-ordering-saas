import type { Metadata } from "next";

// Next.js inyectará automáticamente este enlace en el <head> principal
export const metadata: Metadata = {
  manifest: "/api/manifest/manager",
  title: "Wolf Ordering",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // NO incluyas <html> ni <head> aquí, solo los componentes
  return <>{children}</>;
}