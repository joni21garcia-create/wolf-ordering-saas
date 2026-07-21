import { supabaseAdmin } from "@/lib/supabase/admin";

import LegalPageClient from "./components/LegalPageClient";

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
    throw error;
  }

  console.log(
    "LEGAL AGREEMENTS:",
    agreements?.length,
    agreements?.map((x) => x.owner_name)
  );

  const total = agreements?.length ?? 0;

  const accepted =
    agreements?.filter(
      (agreement) => agreement.status === "accepted"
    ).length ?? 0;

  const pending =
    agreements?.filter(
      (agreement) => agreement.status === "pending"
    ).length ?? 0;

  const documents = new Set(
    agreements?.map(
      (agreement) => agreement.legal_document_id
    )
  ).size;

  return (
    <main
      style={{
        padding: 30,
        maxWidth: 1700,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        Centro Legal
      </h1>

      <p
        style={{
          color: "#888",
          marginBottom: 30,
        }}
      >
        Administración de acuerdos comerciales, firmas electrónicas y expedientes legales.
      </p>

      <LegalPageClient agreements={agreements ?? []} />
    </main>
  );
}