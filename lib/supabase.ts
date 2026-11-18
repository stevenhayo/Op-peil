"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// De Vercel-integratie zet deze variabelen. Nieuwere projecten gebruiken een "publishable key".
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | null = null;

/** Geeft null als Supabase (nog) niet is ingesteld; de app werkt dan gewoon lokaal. */
export function supabase(): SupabaseClient | null {
  if (!URL || !KEY) return null;
  if (!client) {
    client = createClient(URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit" },
    });
  }
  return client;
}
