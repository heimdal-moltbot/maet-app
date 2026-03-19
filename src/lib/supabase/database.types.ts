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
          email: string
          full_name: string | null
          family_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          family_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          family_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          profile_id: string
          name: string
          age: number | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          age?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          age?: number | null
          created_at?: string
        }
      }
      dietary_preferences: {
        Row: {
          id: string
          family_member_id: string
          preference_type: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          family_member_id: string
          preference_type: string
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          family_member_id?: string
          preference_type?: string
          value?: string
          created_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          profile_id: string | null
          title: string
          description: string | null
          image_url: string | null
          prep_time_minutes: number | null
          cook_time_minutes: number | null
          servings: number
          difficulty: string
          is_public: boolean
          diet_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          title: string
          description?: string | null
          image_url?: string | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          servings?: number
          difficulty?: string
          is_public?: boolean
          diet_tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          title?: string
          description?: string | null
          image_url?: string | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          servings?: number
          difficulty?: string
          is_public?: boolean
          diet_tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          name: string
          amount: number | null
          unit: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          amount?: number | null
          unit?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          recipe_id?: string
          name?: string
          amount?: number | null
          unit?: string | null
          sort_order?: number
        }
      }
      recipe_steps: {
        Row: {
          id: string
          recipe_id: string
          step_number: number
          instruction: string
        }
        Insert: {
          id?: string
          recipe_id: string
          step_number: number
          instruction: string
        }
        Update: {
          id?: string
          recipe_id?: string
          step_number?: number
          instruction?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          profile_id: string
          week_start: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          week_start: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          week_start?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      planned_meals: {
        Row: {
          id: string
          meal_plan_id: string
          recipe_id: string
          day_of_week: number
          meal_type: string
          servings_override: number | null
          created_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          recipe_id: string
          day_of_week: number
          meal_type?: string
          servings_override?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          recipe_id?: string
          day_of_week?: number
          meal_type?: string
          servings_override?: number | null
          created_at?: string
        }
      }
      shopping_lists: {
        Row: {
          id: string
          profile_id: string
          meal_plan_id: string | null
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          meal_plan_id?: string | null
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          meal_plan_id?: string | null
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      shopping_items: {
        Row: {
          id: string
          shopping_list_id: string
          name: string
          amount: number | null
          unit: string | null
          is_checked: boolean
          category: string | null
          recipe_ingredient_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          shopping_list_id: string
          name: string
          amount?: number | null
          unit?: string | null
          is_checked?: boolean
          category?: string | null
          recipe_ingredient_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          shopping_list_id?: string
          name?: string
          amount?: number | null
          unit?: string | null
          is_checked?: boolean
          category?: string | null
          recipe_ingredient_id?: string | null
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
