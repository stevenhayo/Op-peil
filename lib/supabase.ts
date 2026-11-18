"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// De Vercel-integratie zet deze variabelen. Nieuwere projecten gebruiken een "publishable key".
// Als terugval staan hier de publieke gegevens van het Op Peil-project. De publishable key is bedoeld om
// openbaar in de browser te staan; de gegevens zelf zijn beschermd met row level security.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://njmehvdnotzyufanohxb.supabase.co";
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_vdWq1ht_xDO4oaI-TBRM8A_6jwHi2Rh";

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
