export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          external_url: string | null
          featured_image_url: string | null
          id: string
          is_active: boolean | null
          published_at: string | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          featured_image_url?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          featured_image_url?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          click_count: number | null
          content: string
          created_at: string
          created_by: string
          id: string
          open_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          sent_count: number | null
          status: string | null
          subject: string
          target_audience: Json | null
          template: string | null
          title: string
          updated_at: string
        }
        Insert: {
          click_count?: number | null
          content: string
          created_at?: string
          created_by: string
          id?: string
          open_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject: string
          target_audience?: Json | null
          template?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          click_count?: number | null
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          open_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject?: string
          target_audience?: Json | null
          template?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          active: boolean | null
          bot_message: string | null
          created_at: string | null
          id: number
          message_type: string | null
          nomewpp: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string | null
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dados_cliente: {
        Row: {
          atendimento_ia: string | null
          created_at: string | null
          id: number
          nomewpp: string | null
          telefone: string | null
        }
        Insert: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          telefone?: string | null
        }
        Update: {
          atendimento_ia?: string | null
          created_at?: string | null
          id?: number
          nomewpp?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          order_index: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_broadcast: boolean | null
          is_read: boolean | null
          message_type: string | null
          recipient_id: string | null
          sender_id: string
          target_audience: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_broadcast?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          sender_id: string
          target_audience?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_broadcast?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string
          target_audience?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          coupon_code: string | null
          created_at: string
          current_uses: number | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          external_url: string | null
          final_price: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          original_price: number | null
          title: string
          updated_at: string
          valid_from: string
          valid_until: string | null
          video_url: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          external_url?: string | null
          final_price?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          original_price?: number | null
          title: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          video_url?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          external_url?: string | null
          final_price?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          original_price?: number | null
          title?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email_notifications: boolean | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          current_video_id: string | null
          id: string
          last_position_seconds: number | null
          progress_percentage: number | null
          user_id: string
          watch_time_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          current_video_id?: string | null
          id?: string
          last_position_seconds?: number | null
          progress_percentage?: number | null
          user_id: string
          watch_time_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          current_video_id?: string | null
          id?: string
          last_position_seconds?: number | null
          progress_percentage?: number | null
          user_id?: string
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_sessions: {
        Row: {
          completed: boolean
          completion_percentage: number
          created_at: string
          id: string
          last_position_seconds: number
          progress_seconds: number | null
          session_end: string | null
          session_start: string
          updated_at: string
          user_id: string
          video_duration_seconds: number | null
          video_id: string
          watch_time_seconds: number
        }
        Insert: {
          completed?: boolean
          completion_percentage?: number
          created_at?: string
          id?: string
          last_position_seconds?: number
          progress_seconds?: number | null
          session_end?: string | null
          session_start?: string
          updated_at?: string
          user_id: string
          video_duration_seconds?: number | null
          video_id: string
          watch_time_seconds?: number
        }
        Update: {
          completed?: boolean
          completion_percentage?: number
          created_at?: string
          id?: string
          last_position_seconds?: number
          progress_seconds?: number | null
          session_end?: string | null
          session_start?: string
          updated_at?: string
          user_id?: string
          video_duration_seconds?: number | null
          video_id?: string
          watch_time_seconds?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
