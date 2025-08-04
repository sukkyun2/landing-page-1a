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
          ip_address: string | null
          referrer_source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          interests?: string | null
          expected_features: string[]
          ip_address?: string | null
          referrer_source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          interests?: string | null
          expected_features?: string[]
          ip_address?: string | null
          referrer_source?: string | null
          created_at?: string
        }
      }
      service_ratings: {
        Row: {
          id: string
          rating_type: string
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          rating_type: string
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          rating_type?: string
          feedback?: string | null
          created_at?: string
        }
      }
      news_articles: {
        Row: {
          id: string
          title: string
          summary: string
          category: string
          read_time: string
          image_url: string | null
          source: string
          published_at: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          category: string
          read_time: string
          image_url?: string | null
          source: string
          published_at: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          category?: string
          read_time?: string
          image_url?: string | null
          source?: string
          published_at?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// 뉴스 타입 정의
export type NewsArticle = Database["public"]["Tables"]["news_articles"]["Row"]
