export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      establishments: {
        Row: {
          id: string
          grouping_id: string | null
          name: string
          address: string
          types: string[]
          category: string
          commission_opinion: string | null
          last_commission_date: string | null
          next_commission_date: string | null
          visit_periodicity: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          grouping_id?: string | null
          name: string
          address: string
          types: string[]
          category: string
          commission_opinion?: string | null
          last_commission_date?: string | null
          next_commission_date?: string | null
          visit_periodicity: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          grouping_id?: string | null
          name?: string
          address?: string
          types?: string[]
          category?: string
          commission_opinion?: string | null
          last_commission_date?: string | null
          next_commission_date?: string | null
          visit_periodicity?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          establishment_id: string | null
          full_name: string
          role: string
          email: string | null
          phone: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          establishment_id?: string | null
          full_name: string
          role: string
          email?: string | null
          phone?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          establishment_id?: string | null
          full_name?: string
          role?: string
          email?: string | null
          phone?: string | null
          created_at?: string | null
        }
      }
    }
  }
}