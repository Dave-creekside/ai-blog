import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire application
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have the required environment variables
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey

// Create the Supabase client only if we have the credentials
// This prevents build errors when environment variables are not set
export const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
