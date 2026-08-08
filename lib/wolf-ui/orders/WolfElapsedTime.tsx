"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Clock3,
} from "lucide-react";

import {
  WolfBadge,
} from "@/lib/wolf-ui";

export interface WolfElapsedTimeProps {

  createdAt?: string | null;

}

function formatElapsed(

  createdAt: string,

  now: number

) {

  const created =
    new Date(createdAt).getTime();

  if (Number.isNaN(created))
    return null;

  const diff =
    Math.max(
      0,
      now - created
    );

  const minutes =
    Math.floor(
      diff / 60000
    );

  if (minutes < 1)
    return "Recién";

  if (minutes < 60)
    return `Hace ${minutes} min`;

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24)
    return `Hace ${hours} h`;

  const days =
    Math.floor(
      hours / 24
    );

  return `Hace ${days} d`;

}

export default function WolfElapsedTime({

  createdAt,

}: WolfElapsedTimeProps) {

  const [now, setNow] =
    useState<number | null>(
      null
    );

  useEffect(() => {

    setNow(Date.now());

    const id =
      window.setInterval(() => {

        setNow(Date.now());

      }, 60000);

    return () =>
      clearInterval(id);

  }, []);

  const label = useMemo(() => {

    if (
      !createdAt ||
      now === null
    )
      return null;

    return formatElapsed(
      createdAt,
      now
    );

  }, [
    createdAt,
    now,
  ]);

  if (!label)
    return null;

  return (

    <WolfBadge
      variant="default"
    >

      <Clock3
        size={12}
      />

      {label}

    </WolfBadge>

  );

}