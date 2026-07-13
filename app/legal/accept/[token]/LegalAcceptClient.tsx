"use client";

import { useEffect, useState } from "react";
import AgreementViewer from "./AgreementViewer";
import OwnerInfoCard from "./OwnerInfoCard";
import SignatureCard from "./SignatureCard";
import AcceptButton from "./AcceptButton";


type Props = {
  document: {
    id: string;
    title: string;
    version: string;
    content: string;
    summary?: string | null;
    published_at?: string | null;
  };

  acceptance: {
    id: string;
    owner_name: string | null;
    owner_email: string | null;
    owner_phone: string | null;

    status: string;

    token: string;

    accepted_version?: string | null;
    accepted_at?: string | null;

    signature_name?: string | null;
    signature_hash?: string | null;
    signature_image_url?: string | null;

    created_at?: string | null;
  };
};

export default function LegalAcceptClient({
  document,
  acceptance,
}: Props) {

const [loading, setLoading] =
  useState(false);

  useEffect(() => {
  registerView();
}, []);

async function registerView() {
  try {
    await fetch("/api/legal/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acceptanceId: acceptance.id,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}

async function handleAccept() {
  try {
    setLoading(true);

    const response = await fetch(
      "/api/legal/accept",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptanceId: acceptance.id,
          signatureName: acceptance.owner_name,
          signatureHash: null,
        }),
      }
    );

    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      alert(result.error);
      return;
    }

    alert("API funcionando correctamente.");
  } catch (error) {
    console.error(error);
    alert("Error conectando con la API.");
  } finally {
    setLoading(false);
  }
}  


  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#090909,#141414)",
        color: "#ffffff",
        padding: "24px clamp(16px,3vw,40px)"
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns:
          "repeat(auto-fit,minmax(360px,1fr))",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* DOCUMENTO */}

        <AgreementViewer
          document={document}
        />

        {/* PANEL LATERAL */}

        <aside
          style={{
            display: "grid",
            gap: 24,
            position: "sticky",
            top: 30,
            alignSelf: "start",
          }}
        >
          <OwnerInfoCard
            acceptance={acceptance}
          />

          <SignatureCard
            acceptance={acceptance}
          />

          <AcceptButton
           loading={loading}
           onAccept={handleAccept}
        />
        </aside>
      </div>
    </main>
  );
}