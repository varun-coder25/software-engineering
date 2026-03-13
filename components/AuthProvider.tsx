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

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isLoading: true
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
      isLoading
    }),
    [isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
