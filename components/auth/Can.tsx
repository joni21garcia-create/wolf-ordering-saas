"use client";

import { ReactNode } from "react";
import { useSession } from "@/providers/SessionProvider";

type Props = {
  permission: string;
  children: ReactNode;
};

export default function Can({
  permission,
  children,
}: Props) {
  const { user, loading } =
    useSession();

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const hasPermission =
    user.permissions.includes(
      permission
    );

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}