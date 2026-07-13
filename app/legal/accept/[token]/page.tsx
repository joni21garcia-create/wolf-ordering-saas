import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import LegalAcceptClient from "./LegalAcceptClient";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function LegalAcceptPage({
  params,
}: PageProps) {
  const { token } = await params;

  // Buscar expediente legal por token
  const {
    data: acceptance,
    error: acceptanceError,
  } = await supabaseAdmin
    .from("restaurant_legal_acceptance")
    .select("*")
    .eq("token", token)
    .single();

  if (acceptanceError || !acceptance) {
    notFound();
  }

  // Buscar documento asociado
  const {
    data: document,
    error: documentError,
  } = await supabaseAdmin
    .from("legal_documents")
    .select("*")
    .eq("id", acceptance.legal_document_id)
    .single();

  if (documentError || !document) {
    notFound();
  }

  return (
    <LegalAcceptClient
      document={document}
      acceptance={acceptance}
    />
  );
}