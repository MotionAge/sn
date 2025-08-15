// src/lib/supabase.ts
import { createClient as supabaseJsCreateClient } from "@supabase/supabase-js"

// Environment variables
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

// 1️⃣ Named export of the actual createClient function if needed
export const createClient = supabaseJsCreateClient

// 2️⃣ Ready-to-use Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey)

// 3️⃣ Server-side Supabase client creator (fresh instance)
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseKey)
}

// 4️⃣ Client-side singleton Supabase creator
let clientSupabase: ReturnType<typeof createClient> | null = null
export const createClientSupabaseClient = () => {
  if (clientSupabase) return clientSupabase
  clientSupabase = createClient(supabaseUrl, supabaseKey)
  return clientSupabase
}
