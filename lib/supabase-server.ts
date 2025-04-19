import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if we have the required environment variables
const hasSupabaseCredentials = supabaseUrl && supabaseServiceKey

// Create the Supabase admin client only if we have the credentials
// This prevents build errors when environment variables are not set
export const supabaseAdmin = hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null
