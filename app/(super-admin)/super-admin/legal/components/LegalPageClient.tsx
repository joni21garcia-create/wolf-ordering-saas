"use client";

import { useMemo, useState } from "react";

import LegalStats from "./LegalStats";
import LegalToolbar from "./LegalToolbar";
import LegalTable from "./LegalTable";

type LegalAgreement = {
  id: string;
  owner_name: string | null;
  owner_email: string | null;
  token: string | null;
  status: string | null;
  legal_document_id: string | null;
  restaurants?: {
    name: string | null;
  } | null;
  legal_documents?: {
    title: string | null;
    version: string | null;
  } | null;
};

type Props = {
  agreements: LegalAgreement[];
};

const STATUS_ALL = "Todos";
const STATUS_ACCEPTED = "Firmados";
const STATUS_PENDING = "Pendientes";

export default function LegalPageClient({
  agreements,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(STATUS_ALL);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedSearch && status === STATUS_ALL) {
      return agreements;
    }

    return agreements.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.owner_name?.toLowerCase().includes(normalizedSearch) ||
        item.owner_email?.toLowerCase().includes(normalizedSearch) ||
        item.restaurants?.name
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === STATUS_ALL ||
        (status === STATUS_ACCEPTED && item.status === "accepted") ||
        (status === STATUS_PENDING && item.status === "pending");

      return matchesSearch && matchesStatus;
    });
  }, [agreements, normalizedSearch, status]);

  const stats = useMemo(() => {
    let accepted = 0;
    let pending = 0;
    const documentIds = new Set<string>();

    for (const item of filtered) {
      if (item.status === "accepted") {
        accepted += 1;
      }

      if (item.status === "pending") {
        pending += 1;
      }

      if (item.legal_document_id) {
        documentIds.add(item.legal_document_id);
      }
    }

    return {
      total: filtered.length,
      accepted,
      pending,
      documents: documentIds.size,
    };
  }, [filtered]);

  return (
    <>
      <LegalStats
        total={stats.total}
        accepted={stats.accepted}
        pending={stats.pending}
        documents={stats.documents}
      />

      <LegalToolbar
        total={stats.total}
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      <LegalTable agreements={filtered} />
    </>
  );
}