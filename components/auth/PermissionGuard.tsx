"use client";

import { ReactNode } from "react";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  permission: string;
  children: ReactNode;
}

export default function PermissionGuard({
  permission,
  children,
}: Props) {
  const router = useRouter();

  const {
    user,
    loading,
  } = useSession();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const hasPermission =
      user.permissions?.includes(
        permission
      );

    if (!hasPermission) {
      router.replace(
        "/unauthorized"
      );
    }
  }, [
    user,
    loading,
    permission,
    router,
  ]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const hasPermission =
    user.permissions?.includes(
      permission
    );

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}