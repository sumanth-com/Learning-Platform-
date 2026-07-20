"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/types/database";

interface UseUserState {
  user: User | null;
  profile: ProfileRow | null;
  isLoading: boolean;
}

/**
 * Client-side session + profile subscription.
 * Prefer Server Components + getCurrentUser() when possible.
 */
export function useUser() {
  const [state, setState] = useState<UseUserState>({
    user: null,
    profile: null,
    isLoading: true,
  });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      return data;
    }

    async function bootstrap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setState({ user: null, profile: null, isLoading: false });
        return;
      }

      const profile = await loadProfile(user.id);
      if (!mounted) return;
      setState({ user, profile, isLoading: false });
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (!mounted) return;
        const user = session?.user ?? null;
        if (!user) {
          setState({ user: null, profile: null, isLoading: false });
          return;
        }
        const profile = await loadProfile(user.id);
        if (!mounted) return;
        setState({ user, profile, isLoading: false });
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
