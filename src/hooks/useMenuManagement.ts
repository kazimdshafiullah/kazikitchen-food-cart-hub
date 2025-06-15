
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MainCategory {
  id: string;
  name: string;
  description: string | null;
  advance_days: number;
  order_cutoff_time: string;
  is_enabled?: boolean; // Optional since it doesn't exist in DB yet
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  name: string;
  main_category_id: string;
  description: string | null;
  is_enabled?: boolean; // Optional since it doesn't exist in DB yet
  created_at: string;
}

export interface MealType {
  id: string;
  name: string;
  description: string | null;
  sub_category_id?: string; // Optional since it doesn't exist in current DB
  is_enabled?: boolean; // Optional since it doesn't exist in DB yet
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
      
      // Add default is_enabled since it doesn't exist in DB yet
      const processedData = data?.map(item => ({
        ...item,
        is_enabled: true // Default value since column doesn't exist yet
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
      
      // Add default is_enabled since it doesn't exist in DB yet
      const processedData = data?.map(item => ({
        ...item,
        is_enabled: true // Default value since column doesn't exist yet
      })) || [];
      
      return processedData as SubCategory[];
    },
  });
};

export const useMealTypes = (subCategoryId?: string) => {
  return useQuery({
    queryKey: ['meal-types', subCategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching meal types:', error);
        throw error;
      }
      
      // Add default values since columns don't exist in DB yet
      const processedData = data?.map(item => ({
        ...item,
        is_enabled: true, // Default value since column doesn't exist yet
        sub_category_id: subCategoryId || null // Add relationship that doesn't exist in DB yet
      })) || [];
      
      return processedData as MealType[];
    },
  });
};

export const useMealPlans = () => {
  return useQuery({
    queryKey: ['meal-plans'],
    queryFn: async () => {
      // Return mock data since meal_plans table doesn't exist yet
      console.log('meal_plans table not found, returning mock data');
      return [
        { id: '1', name: 'regular', is_enabled: true, created_at: new Date().toISOString() },
        { id: '2', name: 'diet', is_enabled: true, created_at: new Date().toISOString() },
        { id: '3', name: 'premium', is_enabled: true, created_at: new Date().toISOString() }
      ] as MealPlan[];
    },
  });
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      // Return empty array since menu_items table doesn't exist yet
      console.log('menu_items table not found, returning empty array');
      return [] as MenuItemWithRelations[];
    },
  });
};

// Mutations for creating menu items
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
      // This will fail until menu_items table is created
      throw new Error('Menu items table not available yet. Please ensure the database migration has been run.');
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
      // This will fail until is_enabled columns are added to tables
      throw new Error(`Settings column 'is_enabled' doesn't exist in table '${table}' yet.`);
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
