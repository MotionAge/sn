import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire server-side application
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Create a singleton client for the client-side
let clientSupabase: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabase) return clientSupabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  clientSupabase = createClient(supabaseUrl, supabaseKey)
  return clientSupabase
}
