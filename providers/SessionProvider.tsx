"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";
import PushProvider from "@/components/push/PushProvider";

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

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  async function refreshUser() {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const promise = (async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            "[SessionProvider] getSession error:",
            sessionError,
          );
          return;
        }

        if (!session?.user) {
          setUser(null);
          return;
        }

        const authUser = session.user;

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
          .eq("auth_user_id", authUser.id)
          .maybeSingle();

        if (error) {
          console.error(
            "[SessionProvider] restaurant_users error:",
            error,
          );
          return;
        }

        if (!data) {
          setUser(null);
          return;
        }

        const rawRole = data.restaurant_roles;

        const role = Array.isArray(rawRole)
          ? rawRole[0]
          : rawRole;

        if (!role) {
          console.error(
            "[SessionProvider] Usuario sin rol:",
            authUser.id,
          );
          setUser(null);
          return;
        }

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
            "[SessionProvider] role_modules error:",
            permissionsError,
          );
          return;
        }

        const permissions =
          permissionsData?.map(
            (item) => item.module_code,
          ) ?? [];

        setUser({
          id: data.auth_user_id,
          email: data.email,
          restaurant_id: data.restaurant_id,
          full_name: data.full_name ?? "",
          role: {
            id: role.id,
            code: role.code,
            name: role.name,
          },
          permissions,
        });
      } catch (error) {
        console.error(
          "[SessionProvider] refreshUser error:",
          error,
        );
      } finally {
        setLoading(false);
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = promise;

    return promise;
  }

  useEffect(() => {
    void refreshUser();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((event) => {
      console.log("AUTH EVENT:", event);

      if (event === "SIGNED_IN") {
        void refreshUser();
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

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

      {user && <PushProvider />}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
