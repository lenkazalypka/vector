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
      profiles: {
        Row: {
          id: string
          role: 'user' | 'admin'
          full_name: string | null
          child_name: string | null
          age: number | null
          city: string | null
          phone: string | null
          consent_terms: boolean
          consent_privacy: boolean
          consent_personal_data: boolean
          consent_given_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'user' | 'admin'
          full_name?: string | null
          child_name?: string | null
          age?: number | null
          city?: string | null
          phone?: string | null
          consent_terms?: boolean
          consent_privacy?: boolean
          consent_personal_data?: boolean
          consent_given_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'user' | 'admin'
          full_name?: string | null
          child_name?: string | null
          age?: number | null
          city?: string | null
          phone?: string | null
          consent_terms?: boolean
          consent_privacy?: boolean
          consent_personal_data?: boolean
          consent_given_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contests: {
        Row: {
          id: string
          title: string
          description: string
          cover_url: string | null
          start_date: string
          end_date: string
          status: 'active' | 'upcoming' | 'finished'
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          cover_url?: string | null
          start_date: string
          end_date: string
          status?: 'active' | 'upcoming' | 'finished'
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          cover_url?: string | null
          start_date?: string
          end_date?: string
          status?: 'active' | 'upcoming' | 'finished'
          created_at?: string
          created_by?: string | null
        }
      }
      contest_photos: {
        Row: {
          id: string
          contest_id: string
          image_url: string
          category: 'winner' | 'participant'
          name: string
          surname_initial: string
          age: number
          city: string
          approved: boolean
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          contest_id: string
          image_url: string
          category?: 'winner' | 'participant'
          name: string
          surname_initial: string
          age: number
          city: string
          approved?: boolean
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          contest_id?: string
          image_url?: string
          category?: 'winner' | 'participant'
          name?: string
          surname_initial?: string
          age?: number
          city?: string
          approved?: boolean
          uploaded_at?: string
          uploaded_by?: string | null
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          published_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          published_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          published_at?: string
        }
      }
      faq: {
        Row: {
          id: string
          question: string
          answer: string
          order: number
        }
        Insert: {
          id?: string
          question: string
          answer: string
          order?: number
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          order?: number
        }
      }
    }
  }
}