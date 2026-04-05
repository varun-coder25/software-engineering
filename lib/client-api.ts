"use client";

import { supabase } from "@/lib/supabaseClient";

export async function authorizedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers
  });
}
