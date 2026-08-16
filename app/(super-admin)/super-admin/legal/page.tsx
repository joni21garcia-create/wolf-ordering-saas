import { supabaseAdmin } from "@/lib/supabase/admin";

import LegalPageClient from "./components/LegalPageClient";

// Este módulo siempre debe leer datos frescos.
// Evita que el Centro Legal conserve una versión anterior en producción.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function LegalPage() {
  const { data: agreements, error } = await supabaseAdmin
    .from("restaurant_legal_acceptance")
    .select(`
      *,
      restaurants (
        name
      ),
      legal_documents (
        title,
        version
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("LEGAL PAGE LOAD ERROR:", error);
    throw error;
  }

  console.log(
    "LEGAL AGREEMENTS:",
    agreements?.length ?? 0
  );

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100dvh",
        boxSizing: "border-box",
        padding: "clamp(12px, 2vw, 30px)",
        margin: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1700,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <header
          style={{
            marginBottom: "clamp(16px, 2.5vw, 30px)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.1,
              fontWeight: 850,
              letterSpacing: "-0.04em",
            }}
          >
            Centro Legal
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              maxWidth: 760,
              color: "#888",
              fontSize: "clamp(12px, 1.3vw, 14px)",
              lineHeight: 1.5,
            }}
          >
            Administración de acuerdos comerciales, firmas electrónicas y
            expedientes legales.
          </p>
        </header>

        <LegalPageClient agreements={agreements ?? []} />
      </div>
    </main>
  );
}