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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          action_type: string
          created_at: string
          id: string
          model: string | null
          tokens_used: number
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          model?: string | null
          tokens_used?: number
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          model?: string | null
          tokens_used?: number
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          inquiry_type: string | null
          message: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          message: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          message?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          content: string | null
          content_html: string | null
          created_at: string
          document_id: string
          id: string
          user_id: string
          version_number: number
        }
        Insert: {
          content?: string | null
          content_html?: string | null
          created_at?: string
          document_id: string
          id?: string
          user_id: string
          version_number: number
        }
        Update: {
          content?: string | null
          content_html?: string | null
          created_at?: string
          document_id?: string
          id?: string
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          character_count: number
          content: string | null
          content_html: string | null
          created_at: string
          id: string
          is_favorite: boolean
          is_pinned: boolean
          last_accessed_at: string | null
          status: Database["public"]["Enums"]["document_status"]
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
          word_count: number
          workspace_id: string | null
        }
        Insert: {
          character_count?: number
          content?: string | null
          content_html?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean
          is_pinned?: boolean
          last_accessed_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id: string
          word_count?: number
          workspace_id?: string | null
        }
        Update: {
          character_count?: number
          content?: string | null
          content_html?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean
          is_pinned?: boolean
          last_accessed_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_applications: {
        Row: {
          additional_skills: string | null
          application_status: string | null
          availability: string
          available_start_date: string | null
          challenging_project: string | null
          created_at: string | null
          current_company: string | null
          current_role: string | null
          education_level: string
          email: string
          experience_level: string
          first_name: string
          graduation_year: string | null
          id: string
          last_name: string
          linkedin: string | null
          location: string | null
          phone: string
          portfolio: string | null
          position: string
          resume_url: string | null
          strengths: string | null
          technical_skills: string[] | null
          university: string
          updated_at: string | null
          why_work_here: string
          work_authorization: string
        }
        Insert: {
          additional_skills?: string | null
          application_status?: string | null
          availability: string
          available_start_date?: string | null
          challenging_project?: string | null
          created_at?: string | null
          current_company?: string | null
          current_role?: string | null
          education_level: string
          email: string
          experience_level: string
          first_name: string
          graduation_year?: string | null
          id?: string
          last_name: string
          linkedin?: string | null
          location?: string | null
          phone: string
          portfolio?: string | null
          position: string
          resume_url?: string | null
          strengths?: string | null
          technical_skills?: string[] | null
          university: string
          updated_at?: string | null
          why_work_here: string
          work_authorization: string
        }
        Update: {
          additional_skills?: string | null
          application_status?: string | null
          availability?: string
          available_start_date?: string | null
          challenging_project?: string | null
          created_at?: string | null
          current_company?: string | null
          current_role?: string | null
          education_level?: string
          email?: string
          experience_level?: string
          first_name?: string
          graduation_year?: string | null
          id?: string
          last_name?: string
          linkedin?: string | null
          location?: string | null
          phone?: string
          portfolio?: string | null
          position?: string
          resume_url?: string | null
          strengths?: string | null
          technical_skills?: string[] | null
          university?: string
          updated_at?: string | null
          why_work_here?: string
          work_authorization?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          job_title: string | null
          onboarding_completed: boolean
          storage_limit: number
          storage_used: number
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          onboarding_completed?: boolean
          storage_limit?: number
          storage_used?: number
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          onboarding_completed?: boolean
          storage_limit?: number
          storage_used?: number
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          content: string | null
          content_html: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          is_system: boolean
          name: string
          thumbnail_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          content_html?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          is_system?: boolean
          name: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          content_html?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          is_system?: boolean
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_save: boolean
          auto_save_interval: number
          color_theme: string
          created_at: string
          email_notifications: boolean
          font_family: string
          font_size: number
          id: string
          language: string
          push_notifications: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_save?: boolean
          auto_save_interval?: number
          color_theme?: string
          created_at?: string
          email_notifications?: boolean
          font_family?: string
          font_size?: number
          id?: string
          language?: string
          push_notifications?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_save?: boolean
          auto_save_interval?: number
          color_theme?: string
          created_at?: string
          email_notifications?: boolean
          font_family?: string
          font_size?: number
          id?: string
          language?: string
          push_notifications?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waitlist_submissions: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          features: string[] | null
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          message: string | null
          phone: string | null
          updated_at: string | null
          use_case: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          features?: string[] | null
          first_name: string
          id?: string
          job_title?: string | null
          last_name: string
          message?: string | null
          phone?: string | null
          updated_at?: string | null
          use_case?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          features?: string[] | null
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          message?: string | null
          phone?: string | null
          updated_at?: string | null
          use_case?: string | null
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      internship_stats: {
        Row: {
          accepted_applications: number | null
          last_30_days: number | null
          last_7_days: number | null
          pending_applications: number | null
          reviewed_applications: number | null
          total_applications: number | null
          unique_applicants: number | null
        }
        Relationships: []
      }
      recent_internship_applications: {
        Row: {
          application_status: string | null
          created_at: string | null
          education_level: string | null
          email: string | null
          experience_level: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          phone: string | null
          position: string | null
          university: string | null
        }
        Relationships: []
      }
      waitlist_stats: {
        Row: {
          last_30_days: number | null
          last_7_days: number | null
          total_submissions: number | null
          unique_emails: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      document_status: "draft" | "published" | "archived"
      subscription_tier: "free" | "pro" | "enterprise"
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
      document_status: ["draft", "published", "archived"],
      subscription_tier: ["free", "pro", "enterprise"],
    },
  },
} as const
