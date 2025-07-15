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
      user_profiles: {
        Row: {
          id: string
          auth0_id: string
          email: string
          name: string | null
          firm: string | null
          role: 'admin' | 'attorney' | 'paralegal'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth0_id: string
          email: string
          name?: string | null
          firm?: string | null
          role?: 'admin' | 'attorney' | 'paralegal'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth0_id?: string
          email?: string
          name?: string | null
          firm?: string | null
          role?: 'admin' | 'attorney' | 'paralegal'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: number
          status: 'not-started' | 'in-progress' | 'completed'
          progress: number
          completed_date: string | null
          last_accessed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: number
          status?: 'not-started' | 'in-progress' | 'completed'
          progress?: number
          completed_date?: string | null
          last_accessed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: number
          status?: 'not-started' | 'in-progress' | 'completed'
          progress?: number
          completed_date?: string | null
          last_accessed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sop_progress: {
        Row: {
          id: string
          user_id: string
          phase: number
          status: 'not-started' | 'in-progress' | 'completed'
          completed_date: string | null
          last_accessed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phase: number
          status?: 'not-started' | 'in-progress' | 'completed'
          completed_date?: string | null
          last_accessed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phase?: number
          status?: 'not-started' | 'in-progress' | 'completed'
          completed_date?: string | null
          last_accessed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      template_downloads: {
        Row: {
          id: string
          user_id: string
          template_id: string
          template_name: string
          downloaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          template_name: string
          downloaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          template_name?: string
          downloaded_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          type: 'training' | 'template' | 'support' | 'compliance' | 'sop'
          title: string
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'training' | 'template' | 'support' | 'compliance' | 'sop'
          title: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'training' | 'template' | 'support' | 'compliance' | 'sop'
          title?: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          ticket_number: string
          category: 'technical' | 'legal' | 'process' | 'compliance' | 'client'
          priority: 'low' | 'medium' | 'high'
          status: 'open' | 'answered' | 'closed'
          subject: string
          description: string
          response: string | null
          responded_by: string | null
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ticket_number?: string
          category: 'technical' | 'legal' | 'process' | 'compliance' | 'client'
          priority: 'low' | 'medium' | 'high'
          status?: 'open' | 'answered' | 'closed'
          subject: string
          description: string
          response?: string | null
          responded_by?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ticket_number?: string
          category?: 'technical' | 'legal' | 'process' | 'compliance' | 'client'
          priority?: 'low' | 'medium' | 'high'
          status?: 'open' | 'answered' | 'closed'
          subject?: string
          description?: string
          response?: string | null
          responded_by?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      compliance_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          score?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          last_updated?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'template' | 'training' | 'system' | 'support' | 'compliance'
          title: string
          message: string
          action_url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'template' | 'training' | 'system' | 'support' | 'compliance'
          title: string
          message: string
          action_url?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'template' | 'training' | 'system' | 'support' | 'compliance'
          title?: string
          message?: string
          action_url?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      user_invitations: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'attorney' | 'paralegal'
          invited_by: string | null
          token: string
          accepted: boolean
          accepted_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'admin' | 'attorney' | 'paralegal'
          invited_by?: string | null
          token?: string
          accepted?: boolean
          accepted_at?: string | null
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'attorney' | 'paralegal'
          invited_by?: string | null
          token?: string
          accepted?: boolean
          accepted_at?: string | null
          expires_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}