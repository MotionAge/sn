import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

// Use a generic client type to avoid 'never' inference on insert/update when DB types aren't generated
let supabaseClient: SupabaseClient<any> | null = null

export function createClient() {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables. Database features will be unavailable.")
    return null
  }

  // Create singleton client
  if (!supabaseClient) {
    try {
      supabaseClient = createSupabaseClient<any>(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      return null
    }
  }

  return supabaseClient
}

export function getSupabaseClient() {
  return createClient()
}

// Compatibility helper for existing server code expecting this name
export function createServerSupabaseClient() {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase client is not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  return client
}
