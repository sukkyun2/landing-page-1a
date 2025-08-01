import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseAvailable = isSupabaseConfigured

export type Database = {
  public: {
    Tables: {
      email_signups: {
        Row: {
          id: string
          email: string
          interests: string | null
          expected_features: string[]
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          interests?: string | null
          expected_features: string[]
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          interests?: string | null
          expected_features?: string[]
          created_at?: string
        }
      }
    }
  }
}
