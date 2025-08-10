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
      stories: {
        Row: {
          id: string
          created_at: string
          title: string
          premise: string | null
          genre: string | null
          author_id: string
          current_turn_user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          premise?: string | null
          genre?: string | null
          author_id: string
          current_turn_user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          premise?: string | null
          genre?: string | null
          author_id?: string
          current_turn_user_id?: string | null
        }
      }
      participants: {
        Row: {
          story_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          story_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          story_id?: string
          user_id?: string
          created_at?: string
        }
      }
      turns: {
        Row: {
          id: string
          created_at: string
          story_id: string
          author_id: string
          turn_number: number
          content: string | null
          is_ai_generated: boolean
          ai_image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          story_id: string
          author_id: string
          turn_number: number
          content?: string | null
          is_ai_generated?: boolean
          ai_image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          story_id?: string
          author_id?: string
          turn_number?: number
          content?: string | null
          is_ai_generated?: boolean
          ai_image_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_turn: {
        Args: {
          story_id_param: string
          author_id_param: string
          content_param: string
          turn_number_param: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}