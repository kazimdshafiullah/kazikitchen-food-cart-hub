
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MainCategory {
  id: string;
  name: string;
  description: string | null;
  advance_days: number;
  order_cutoff_time: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  name: string;
  main_category_id: string;
  description: string | null;
  is_enabled: boolean;
  created_at: string;
}

export interface MealType {
  id: string;
  name: string;
  description: string | null;
  is_enabled: boolean;
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
}

// Hooks for fetching data
export const useMainCategories = () => {
  return useQuery({
    queryKey: ['main-categories'],
    queryFn: async () => {
      console.log('Fetching main categories...');
      const { data, error } = await supabase
        .from('main_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching main categories:', error);
        throw error;
      }
      
      console.log('Main categories fetched:', data);
      return data as MainCategory[];
    },
  });
};

export const useSubCategories = (mainCategoryId?: string) => {
  return useQuery({
    queryKey: ['sub-categories', mainCategoryId],
    queryFn: async () => {
      console.log('Fetching sub categories for:', mainCategoryId);
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
      
      console.log('Sub categories fetched:', data);
      return data as SubCategory[];
    },
  });
};

export const useMealTypes = () => {
  return useQuery({
    queryKey: ['meal-types'],
    queryFn: async () => {
      console.log('Fetching meal types...');
      const { data, error } = await supabase
        .from('meal_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching meal types:', error);
        throw error;
      }
      
      console.log('Meal types fetched:', data);
      return data as MealType[];
    },
  });
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      console.log('Fetching menu items...');
      
      // First check if the table exists by trying a simple query
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select(`
            *,
            main_categories (
              id,
              name,
              description,
              advance_days,
              order_cutoff_time,
              is_enabled,
              created_at,
              updated_at
            ),
            sub_categories (
              id,
              name,
              main_category_id,
              description,
              is_enabled,
              created_at
            ),
            meal_types (
              id,
              name,
              description,
              is_enabled,
              created_at
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching menu items:', error);
          throw error;
        }
        
        console.log('Menu items fetched:', data);
        return data as MenuItemWithRelations[];
      } catch (error) {
        console.error('Menu items table might not exist:', error);
        throw new Error('Menu items table not available yet. Please ensure database migration has been done.');
      }
    },
  });
};

// Mutations for creating menu items
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating menu item with data:', itemData);
      
      // Validate required fields
      if (!itemData.name || !itemData.price || !itemData.main_category_id) {
        throw new Error('Missing required fields: name, price, or main_category_id');
      }

      try {
        const { data, error } = await supabase
          .from('menu_items')
          .insert({
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            image_url: itemData.image_url,
            main_category_id: itemData.main_category_id,
            sub_category_id: itemData.sub_category_id,
            meal_type_id: itemData.meal_type_id,
            specific_date: itemData.specific_date,
            stock_limit: itemData.stock_limit,
            is_active: itemData.is_active,
          })
          .select()
          .single();

        if (error) {
          console.error('Database error creating menu item:', error);
          throw error;
        }

        console.log('Menu item created successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error in createMenuItem mutation:', error);
        if (error.message?.includes('relation "menu_items" does not exist')) {
          throw new Error('Menu items table not available yet. Please ensure database migration has been done.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success",
        description: "Menu item created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error creating menu item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create menu item",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item",
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
      const { error } = await supabase
        .from(table as any)
        .update({ is_enabled })
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main-categories'] });
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
      queryClient.invalidateQueries({ queryKey: ['meal-types'] });
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
