"use client";

import { useMemo, useState } from "react";

import LegalStats from "./LegalStats";
import LegalToolbar from "./LegalToolbar";
import LegalTable from "./LegalTable";

type Props = {
  agreements: any[];
};

export default function LegalPageClient({
  agreements,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("Todos");

  const filtered = useMemo(() => {
    return agreements.filter((item) => {
      const matchesSearch =
        item.owner_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.owner_email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.restaurants?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        status === "Todos"
          ? true
          : status === "Firmados"
          ? item.status === "accepted"
          : item.status === "pending";

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    agreements,
    search,
    status,
  ]);

  const total =
    filtered.length;

  const accepted =
    filtered.filter(
      (x) =>
        x.status ===
        "accepted"
    ).length;

  const pending =
    filtered.filter(
      (x) =>
        x.status ===
        "pending"
    ).length;

  const documents =
    new Set(
      filtered.map(
        (x) =>
          x.legal_document_id
      )
    ).size;

  return (
    <>
      <LegalStats
        total={total}
        accepted={accepted}
        pending={pending}
        documents={documents}
      />

      <LegalToolbar
        total={total}
        search={search}
        status={status}
        onSearchChange={
          setSearch
        }
        onStatusChange={
          setStatus
        }
      />

      <LegalTable
        agreements={filtered}
      />
    </>
  );
}
