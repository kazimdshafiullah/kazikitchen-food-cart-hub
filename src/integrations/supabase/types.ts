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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      main_categories: {
        Row: {
          advance_days: number
          created_at: string
          description: string | null
          id: string
          name: string
          order_cutoff_time: string
          updated_at: string
        }
        Insert: {
          advance_days?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_cutoff_time: string
          updated_at?: string
        }
        Update: {
          advance_days?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_cutoff_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      meal_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivery_address: string
          id: string
          status: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivery_address: string
          id?: string
          status?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivery_address?: string
          id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          name: string
          popular: boolean | null
          price: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          popular?: boolean | null
          price: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          popular?: boolean | null
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          main_category_id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          main_category_id: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          main_category_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_main_category_id_fkey"
            columns: ["main_category_id"]
            isOneToOne: false
            referencedRelation: "main_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_menu: {
        Row: {
          created_at: string
          current_stock: number
          day_of_week: number
          description: string | null
          id: string
          is_active: boolean
          item_name: string
          main_category_id: string
          meal_type_id: string
          price: number
          stock_limit: number
          sub_category_id: string
          updated_at: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          current_stock?: number
          day_of_week: number
          description?: string | null
          id?: string
          is_active?: boolean
          item_name: string
          main_category_id: string
          meal_type_id: string
          price: number
          stock_limit?: number
          sub_category_id: string
          updated_at?: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          current_stock?: number
          day_of_week?: number
          description?: string | null
          id?: string
          is_active?: boolean
          item_name?: string
          main_category_id?: string
          meal_type_id?: string
          price?: number
          stock_limit?: number
          sub_category_id?: string
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_menu_main_category_id_fkey"
            columns: ["main_category_id"]
            isOneToOne: false
            referencedRelation: "main_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_menu_meal_type_id_fkey"
            columns: ["meal_type_id"]
            isOneToOne: false
            referencedRelation: "meal_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_menu_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_order_items: {
        Row: {
          created_at: string
          day_of_week: number
          id: string
          price: number
          quantity: number
          weekly_menu_id: string
          weekly_order_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          id?: string
          price: number
          quantity?: number
          weekly_menu_id: string
          weekly_order_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          id?: string
          price?: number
          quantity?: number
          weekly_menu_id?: string
          weekly_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_order_items_weekly_menu_id_fkey"
            columns: ["weekly_menu_id"]
            isOneToOne: false
            referencedRelation: "weekly_menu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_order_items_weekly_order_id_fkey"
            columns: ["weekly_order_id"]
            isOneToOne: false
            referencedRelation: "weekly_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id: string
          main_category_id: string
          meal_type_id: string
          status: string
          sub_category_id: string
          total_amount: number
          updated_at: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id?: string
          main_category_id: string
          meal_type_id: string
          status?: string
          sub_category_id: string
          total_amount: number
          updated_at?: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          id?: string
          main_category_id?: string
          meal_type_id?: string
          status?: string
          sub_category_id?: string
          total_amount?: number
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_orders_main_category_id_fkey"
            columns: ["main_category_id"]
            isOneToOne: false
            referencedRelation: "main_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_orders_meal_type_id_fkey"
            columns: ["meal_type_id"]
            isOneToOne: false
            referencedRelation: "meal_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_orders_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
