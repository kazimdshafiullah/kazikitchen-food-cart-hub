
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MainCategory {
  id: string;
  name: string;
  description: string | null;
  advance_days: number;
  order_cutoff_time: string;
  is_enabled?: boolean; // Optional since it might not exist in DB yet
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  name: string;
  main_category_id: string;
  description: string | null;
  is_enabled?: boolean; // Optional since it might not exist in DB yet
  created_at: string;
}

export interface MealType {
  id: string;
  name: string;
  description: string | null;
  sub_category_id?: string; // Make optional since it might not exist in current DB
  is_enabled?: boolean; // Optional since it might not exist in DB yet
  created_at: string;
}

export interface MealPlan {
  id: string;
  name: string;
  is_enabled?: boolean; // Optional since table might not exist yet
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  main_category_id: string;
  sub_category_id: string | null;
  meal_type_id: string | null;
  meal_plan_id: string | null;
  specific_date: string | null;
  stock_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemWithRelations extends MenuItem {
  main_categories: MainCategory;
  sub_categories: SubCategory | null;
  meal_types: MealType | null;
  meal_plans: MealPlan | null;
}

// Hooks for fetching data
export const useMainCategories = () => {
  return useQuery({
    queryKey: ['main-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching main categories:', error);
        throw error;
      }
      
      // Add default is_enabled if not present
      const processedData = data?.map(item => ({
        ...item,
        is_enabled: item.is_enabled ?? true
      })) || [];
      
      return processedData as MainCategory[];
    },
  });
};

export const useSubCategories = (mainCategoryId?: string) => {
  return useQuery({
    queryKey: ['sub-categories', mainCategoryId],
    queryFn: async () => {
      let query = supabase
        .from('sub_categories')
        .select('*')
        .order('name');

      if (mainCategoryId) {
        query = query.eq('main_category_id', mainCategoryId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching sub categories:', error);
        throw error;
      }
      
      // Add default is_enabled if not present
      const processedData = data?.map(item => ({
        ...item,
        is_enabled: item.is_enabled ?? true
      })) || [];
      
      return processedData as SubCategory[];
    },
  });
};

export const useMealTypes = (subCategoryId?: string) => {
  return useQuery({
    queryKey: ['meal-types', subCategoryId],
    queryFn: async () => {
      let query = supabase
        .from('meal_types')
        .select('*')
        .order('name');

      if (subCategoryId) {
        query = query.eq('sub_category_id', subCategoryId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching meal types:', error);
        throw error;
      }
      
      // Add default is_enabled and sub_category_id if not present
      const processedData = data?.map(item => ({
        ...item,
        is_enabled: item.is_enabled ?? true,
        sub_category_id: item.sub_category_id || subCategoryId || null
      })) || [];
      
      return processedData as MealType[];
    },
  });
};

export const useMealPlans = () => {
  return useQuery({
    queryKey: ['meal-plans'],
    queryFn: async () => {
      // Try to fetch from meal_plans table, but handle if it doesn't exist
      try {
        const { data, error } = await (supabase as any)
          .from('meal_plans')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Add default is_enabled if not present
        const processedData = data?.map((item: any) => ({
          ...item,
          is_enabled: item.is_enabled ?? true
        })) || [];
        
        return processedData as MealPlan[];
      } catch (error) {
        console.error('meal_plans table not found, returning mock data:', error);
        // Return mock data if table doesn't exist yet
        return [
          { id: '1', name: 'regular', is_enabled: true, created_at: new Date().toISOString() },
          { id: '2', name: 'diet', is_enabled: true, created_at: new Date().toISOString() },
          { id: '3', name: 'premium', is_enabled: true, created_at: new Date().toISOString() }
        ] as MealPlan[];
      }
    },
  });
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      // Try to fetch from menu_items table, but handle if it doesn't exist
      try {
        const { data, error } = await (supabase as any)
          .from('menu_items')
          .select(`
            *,
            main_categories (*),
            sub_categories (*),
            meal_types (*),
            meal_plans (*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as MenuItemWithRelations[];
      } catch (error) {
        console.error('menu_items table not found:', error);
        // Return empty array if table doesn't exist yet
        return [] as MenuItemWithRelations[];
      }
    },
  });
};

// Mutations for creating menu items
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await (supabase as any)
          .from('menu_items')
          .insert(itemData)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error creating menu item (table might not exist):', error);
        throw new Error('Menu items table not available yet. Please ensure the database migration has been run.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success",
        description: "Menu item created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating menu item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create menu item",
        variant: "destructive",
      });
    },
  });
};

// Mutations for updating settings
export const useUpdateCategorySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_enabled, table }: { id: string; is_enabled: boolean; table: string }) => {
      try {
        const { data, error } = await (supabase as any)
          .from(table)
          .update({ is_enabled })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error updating ${table} settings:`, error);
        throw new Error(`Settings table ${table} not available yet or column is_enabled doesn't exist.`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main-categories'] });
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
      queryClient.invalidateQueries({ queryKey: ['meal-types'] });
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });
};
