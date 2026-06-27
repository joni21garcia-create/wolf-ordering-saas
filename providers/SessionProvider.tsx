"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

type SessionUser = {
  id: string;
  email: string;
  restaurant_id: string;
  full_name: string;

  role: {
    id: string;
    code: string;
    name: string;
  };

  permissions: string[];
};

type SessionContextType = {
  user: SessionUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const SessionContext =
  createContext<SessionContextType>({
    user: null,
    loading: true,
    refreshUser: async () => {},
  });

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<SessionUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    try {
      setLoading(true);

const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  setUser(null);
  setLoading(false);
  return;
}

const {
  data: { user: authUser },
  error: authError,
} = await supabase.auth.getUser();

      if (authError) {
  if (
    authError.message?.includes(
      "Auth session missing"
    )
  ) {
    setUser(null);
    return;
  }

  console.error(authError);
  setUser(null);
  return;
}

      if (!authUser) {
        setUser(null);
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("restaurant_users")
        .select(`
          *,
          restaurant_roles (
            id,
            code,
            name
          )
        `)
        .eq(
          "auth_user_id",
          authUser.id
        )
        .single();

      if (error) {
        console.error(error);
        setUser(null);
        return;
      }

      if (!data) {
        setUser(null);
        return;
      }

      const role =
        data.restaurant_roles as {
          id: string;
          code: string;
          name: string;
        };

      const {
        data: permissionsData,
        error: permissionsError,
      } = await supabase
        .from("role_modules")
        .select("module_code")
        .eq("role_id", role.id)
        .eq("can_view", true);

      if (permissionsError) {
        console.error(
          permissionsError
        );
      }

      const permissions =
        permissionsData?.map(
          (item: any) =>
            item.module_code
        ) || [];

      setUser({
        id: data.auth_user_id,

        email: data.email,

        restaurant_id:
          data.restaurant_id,

        full_name:
          data.full_name ?? "",

        role,

        permissions,
      });
    } catch (err) {
      console.error(
        "SessionProvider",
        err
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (event) => {
          console.log(
            "AUTH EVENT:",
            event
          );

          if (
            event === "SIGNED_IN" ||
            event ===
              "TOKEN_REFRESHED"
          ) {
            await refreshUser();
          }

          if (
            event === "SIGNED_OUT"
          ) {
            setUser(null);
          }
        }
      );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(
    SessionContext
  );
}