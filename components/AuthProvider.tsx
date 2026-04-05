"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { getDashboardRoute, normalizeRole, type AppRole } from "@/lib/roles";

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  role: AppRole;
  dashboardRoute: string;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isLoading: true,
  role: "student",
  dashboardRoute: "/dashboard/student"
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(currentSession);
        setIsLoading(false);
      }
    };

    initializeSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      role: normalizeRole(session?.user.user_metadata?.role),
      dashboardRoute: getDashboardRoute(
        normalizeRole(session?.user.user_metadata?.role)
      )
    }),
    [isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
