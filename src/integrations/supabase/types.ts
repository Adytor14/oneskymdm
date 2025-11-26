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
      change_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          dcr_id: string | null
          entity_id: string
          entity_type: string
          id: string
          priority: string
          reason: string
          request_type: string
          requested_by: string
          requested_changes: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          dcr_id?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          priority?: string
          reason: string
          request_type?: string
          requested_by: string
          requested_changes: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          dcr_id?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          priority?: string
          reason?: string
          request_type?: string
          requested_by?: string
          requested_changes?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dcr_rules: {
        Row: {
          attribute_name: string
          created_at: string | null
          created_by: string | null
          eligible_for_dcr: boolean
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          interference_type: string
          updated_at: string | null
        }
        Insert: {
          attribute_name: string
          created_at?: string | null
          created_by?: string | null
          eligible_for_dcr?: boolean
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          interference_type?: string
          updated_at?: string | null
        }
        Update: {
          attribute_name?: string
          created_at?: string | null
          created_by?: string | null
          eligible_for_dcr?: boolean
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          interference_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      match_proposals: {
        Row: {
          comments: string | null
          created_at: string | null
          entity_ids: string[]
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          match_score: number
          processed_date: string | null
          request_id: string
          resolved_by: string | null
          resolved_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          entity_ids: string[]
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          match_score: number
          processed_date?: string | null
          request_id: string
          resolved_by?: string | null
          resolved_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          entity_ids?: string[]
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          match_score?: number
          processed_date?: string | null
          request_id?: string
          resolved_by?: string | null
          resolved_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      merge_match_rules: {
        Row: {
          created_at: string | null
          created_by: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          is_active: boolean | null
          match_type: Database["public"]["Enums"]["match_type"]
          rule_name: string
          threshold_max: number | null
          threshold_min: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_active?: boolean | null
          match_type?: Database["public"]["Enums"]["match_type"]
          rule_name: string
          threshold_max?: number | null
          threshold_min?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_active?: boolean | null
          match_type?: Database["public"]["Enums"]["match_type"]
          rule_name?: string
          threshold_max?: number | null
          threshold_min?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rule_attributes: {
        Row: {
          attribute_name: string
          created_at: string | null
          id: string
          match_category: Database["public"]["Enums"]["match_category"]
          rule_id: string | null
          weightage: number | null
        }
        Insert: {
          attribute_name: string
          created_at?: string | null
          id?: string
          match_category?: Database["public"]["Enums"]["match_category"]
          rule_id?: string | null
          weightage?: number | null
        }
        Update: {
          attribute_name?: string
          created_at?: string | null
          id?: string
          match_category?: Database["public"]["Enums"]["match_category"]
          rule_id?: string | null
          weightage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_attributes_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "merge_match_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      survivorship_rules: {
        Row: {
          attribute_name: string
          created_at: string | null
          created_by: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          rule_type: Database["public"]["Enums"]["survivorship_rule_type"]
          rule_value: string
          updated_at: string | null
        }
        Insert: {
          attribute_name: string
          created_at?: string | null
          created_by?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          rule_type: Database["public"]["Enums"]["survivorship_rule_type"]
          rule_value: string
          updated_at?: string | null
        }
        Update: {
          attribute_name?: string
          created_at?: string | null
          created_by?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          rule_type?: Database["public"]["Enums"]["survivorship_rule_type"]
          rule_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      app_role: "admin" | "data_steward" | "user"
      entity_type: "HCP" | "HCO" | "Address" | "SLN"
      match_category: "exact" | "fuzzy"
      match_type: "automatic" | "suspect" | "negative"
      survivorship_rule_type: "status" | "priority" | "recency" | "aggregation"
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
      app_role: ["admin", "data_steward", "user"],
      entity_type: ["HCP", "HCO", "Address", "SLN"],
      match_category: ["exact", "fuzzy"],
      match_type: ["automatic", "suspect", "negative"],
      survivorship_rule_type: ["status", "priority", "recency", "aggregation"],
    },
  },
} as const
