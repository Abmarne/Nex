export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          business_id: string | null
          created_at: string | null
          customer_id: string | null
          guest_email: string | null
          guest_name: string
          id: string
          party_size: number | null
          queue_id: string | null
          scheduled_at: string
          status: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          guest_email?: string | null
          guest_name: string
          id?: string
          party_size?: number | null
          queue_id?: string | null
          scheduled_at: string
          status?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          guest_email?: string | null
          guest_name?: string
          id?: string
          party_size?: number | null
          queue_id?: string | null
          scheduled_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      arcade_scores: {
        Row: {
          created_at: string | null
          guest_name: string
          id: string
          queue_id: string | null
          score: number
          token_id: string | null
        }
        Insert: {
          created_at?: string | null
          guest_name: string
          id?: string
          queue_id?: string | null
          score: number
          token_id?: string | null
        }
        Update: {
          created_at?: string | null
          guest_name?: string
          id?: string
          queue_id?: string | null
          score?: number
          token_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arcade_scores_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arcade_scores_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_staff: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          role: string | null
          staff_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          staff_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_staff_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_staff_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          business_id: string | null
          customer_id: string | null
          id: string
          points: number | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          customer_id?: string | null
          id?: string
          points?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          customer_id?: string | null
          id?: string
          points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_points_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      queues: {
        Row: {
          arcade_enabled: boolean | null
          arcade_reward: string | null
          business_id: string
          charity_amount: number | null
          charity_fastpass_enabled: boolean | null
          charity_link: string | null
          charity_name: string | null
          created_at: string | null
          id: string
          name: string
          preboarding_enabled: boolean | null
          preboarding_fields: Json | null
          require_party_size: boolean | null
          status: Database["public"]["Enums"]["queue_status"]
          updated_at: string | null
        }
        Insert: {
          arcade_enabled?: boolean | null
          arcade_reward?: string | null
          business_id: string
          charity_amount?: number | null
          charity_fastpass_enabled?: boolean | null
          charity_link?: string | null
          charity_name?: string | null
          created_at?: string | null
          id?: string
          name: string
          preboarding_enabled?: boolean | null
          preboarding_fields?: Json | null
          require_party_size?: boolean | null
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string | null
        }
        Update: {
          arcade_enabled?: boolean | null
          arcade_reward?: string | null
          business_id?: string
          charity_amount?: number | null
          charity_fastpass_enabled?: boolean | null
          charity_link?: string | null
          charity_name?: string | null
          created_at?: string | null
          id?: string
          name?: string
          preboarding_enabled?: boolean | null
          preboarding_fields?: Json | null
          require_party_size?: boolean | null
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "queues_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          fastpass_approved: boolean | null
          fastpass_claimed: boolean | null
          guest_name: string | null
          id: string
          party_size: number | null
          position: number
          preboarding_data: Json | null
          queue_id: string
          served_at: string | null
          snooze_count: number | null
          source: string | null
          status: Database["public"]["Enums"]["token_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          fastpass_approved?: boolean | null
          fastpass_claimed?: boolean | null
          guest_name?: string | null
          id?: string
          party_size?: number | null
          position: number
          preboarding_data?: Json | null
          queue_id: string
          served_at?: string | null
          snooze_count?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["token_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          fastpass_approved?: boolean | null
          fastpass_claimed?: boolean | null
          guest_name?: string | null
          id?: string
          party_size?: number | null
          position?: number
          preboarding_data?: Json | null
          queue_id?: string
          served_at?: string | null
          snooze_count?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["token_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tokens_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tokens_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          bio: string | null
          business_name: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      queue_status: "active" | "closed"
      token_status: "waiting" | "served" | "left"
      user_role: "business" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Re-export specific interfaces for convenience
export type Token = Tables<'tokens'>
export type Queue = Tables<'queues'>
export type UserProfile = Tables<'users'>
export type ArcadeScore = Tables<'arcade_scores'>
export type Appointment = Tables<'appointments'>
export type StaffMemberRaw = Tables<'business_staff'>
export type LoyaltyPoints = Tables<'loyalty_points'>
