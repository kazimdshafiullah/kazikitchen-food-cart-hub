
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types for the weekly menu system
export interface MainCategory {
  id: string;
  name: string;
  description: string | null;
  order_cutoff_time: string;
  advance_days: number;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  main_category_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface MealType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface WeeklyMenuItem {
  id: string;
  main_category_id: string;
  sub_category_id: string;
  meal_type_id: string;
  day_of_week: number;
  item_name: string;
  description: string | null;
  price: number;
  stock_limit: number;
  current_stock: number;
  is_active: boolean;
  week_start_date: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  main_category_id: string;
  sub_category_id: string;
  meal_type_id: string;
  week_start_date: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyOrderItem {
  id: string;
  weekly_order_id: string;
  weekly_menu_id: string;
  day_of_week: number;
  quantity: number;
  price: number;
  created_at: string;
}

// Hook to get main categories
export const useMainCategories = () => {
  return useQuery({
    queryKey: ["mainCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("main_categories")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data as MainCategory[];
    },
  });
};

// Hook to get sub categories by main category
export const useSubCategories = (mainCategoryId?: string) => {
  return useQuery({
    queryKey: ["subCategories", mainCategoryId],
    queryFn: async () => {
      let query = supabase.from("sub_categories").select("*");
      
      if (mainCategoryId) {
        query = query.eq("main_category_id", mainCategoryId);
      }

      const { data, error } = await query.order("created_at");

      if (error) throw error;
      return data as SubCategory[];
    },
    enabled: !!mainCategoryId,
  });
};

// Hook to get meal types
export const useMealTypes = () => {
  return useQuery({
    queryKey: ["mealTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_types")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data as MealType[];
    },
  });
};

// Hook to get weekly menu items
export const useWeeklyMenu = (
  mainCategoryId?: string,
  subCategoryId?: string,
  mealTypeId?: string,
  weekStartDate?: string
) => {
  return useQuery({
    queryKey: ["weeklyMenu", mainCategoryId, subCategoryId, mealTypeId, weekStartDate],
    queryFn: async () => {
      let query = supabase.from("weekly_menu").select("*");

      if (mainCategoryId) query = query.eq("main_category_id", mainCategoryId);
      if (subCategoryId) query = query.eq("sub_category_id", subCategoryId);
      if (mealTypeId) query = query.eq("meal_type_id", mealTypeId);
      if (weekStartDate) query = query.eq("week_start_date", weekStartDate);

      const { data, error } = await query
        .eq("is_active", true)
        .order("day_of_week");

      if (error) throw error;
      return data as WeeklyMenuItem[];
    },
    enabled: !!(mainCategoryId && subCategoryId && mealTypeId && weekStartDate),
  });
};

// Hook to create weekly order
export const useCreateWeeklyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      delivery_address: string;
      main_category_id: string;
      sub_category_id: string;
      meal_type_id: string;
      week_start_date: string;
      total_amount: number;
      order_items: {
        weekly_menu_id: string;
        day_of_week: number;
        quantity: number;
        price: number;
      }[];
    }) => {
      const { order_items, ...orderInfo } = orderData;

      // Create the main order
      const { data: order, error: orderError } = await supabase
        .from("weekly_orders")
        .insert([orderInfo])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsWithOrderId = order_items.map(item => ({
        ...item,
        weekly_order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from("weekly_order_items")
        .insert(orderItemsWithOrderId);

      if (itemsError) throw itemsError;

      // Update stock for each menu item by decreasing current_stock
      for (const item of order_items) {
        // First, get the current stock
        const { data: menuItem, error: fetchError } = await supabase
          .from("weekly_menu")
          .select("current_stock")
          .eq("id", item.weekly_menu_id)
          .single();

        if (fetchError) throw fetchError;

        // Then update with the new stock value
        const newStock = menuItem.current_stock - item.quantity;
        const { error: stockError } = await supabase
          .from("weekly_menu")
          .update({ current_stock: newStock })
          .eq("id", item.weekly_menu_id);

        if (stockError) throw stockError;
      }

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeklyMenu"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyOrders"] });
    },
  });
};

// Utility function to get current week start date (Sunday)
export const getCurrentWeekStart = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek);
  return startDate.toISOString().split('T')[0];
};

// Utility function to check if ordering is allowed
export const isOrderingAllowed = (mainCategory: MainCategory) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  const cutoffTime = mainCategory.order_cutoff_time.slice(0, 5);
  
  if (mainCategory.advance_days === 1) {
    // School Tiffin - can order until 10 PM for next day
    return currentTime <= cutoffTime;
  } else {
    // Office Food - can order until 9:30 AM same day
    return currentTime <= cutoffTime;
  }
};

// Utility function to get day names
export const getDayName = (dayOfWeek: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  return days[dayOfWeek];
};
