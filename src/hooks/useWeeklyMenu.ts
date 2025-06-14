
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
  specific_date: string;
  item_name: string;
  description: string | null;
  price: number;
  stock_limit: number;
  current_stock: number;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklyOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_location: 'Dhanmondi' | 'Farmgate' | 'Panthapath' | 'Karwanbazar' | 'New Market' | 'Banglamotor' | 'Shahbag' | 'Science Lab';
  main_category_id: string;
  sub_category_id: string;
  meal_type_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyOrderItem {
  id: string;
  weekly_order_id: string;
  weekly_menu_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface LocationPricing {
  id: string;
  location: 'Dhanmondi' | 'Farmgate' | 'Panthapath' | 'Karwanbazar' | 'New Market' | 'Banglamotor' | 'Shahbag' | 'Science Lab';
  base_delivery_fee: number;
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

// Hook to get weekly menu items by specific date
export const useWeeklyMenuByDate = (
  mainCategoryId?: string,
  subCategoryId?: string,
  mealTypeId?: string,
  specificDate?: string
) => {
  return useQuery({
    queryKey: ["weeklyMenuByDate", mainCategoryId, subCategoryId, mealTypeId, specificDate],
    queryFn: async () => {
      let query = supabase.from("weekly_menu").select("*");

      if (mainCategoryId) query = query.eq("main_category_id", mainCategoryId);
      if (subCategoryId) query = query.eq("sub_category_id", subCategoryId);
      if (mealTypeId) query = query.eq("meal_type_id", mealTypeId);
      if (specificDate) query = query.eq("specific_date", specificDate);

      const { data, error } = await query
        .eq("is_active", true)
        .order("specific_date");

      if (error) throw error;
      return data as WeeklyMenuItem[];
    },
    enabled: !!(mainCategoryId && subCategoryId && mealTypeId && specificDate),
  });
};

// Hook to get menu items for multiple dates
export const useWeeklyMenuByDateRange = (
  mainCategoryId?: string,
  subCategoryId?: string,
  mealTypeId?: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ["weeklyMenuByDateRange", mainCategoryId, subCategoryId, mealTypeId, startDate, endDate],
    queryFn: async () => {
      let query = supabase.from("weekly_menu").select("*");

      if (mainCategoryId) query = query.eq("main_category_id", mainCategoryId);
      if (subCategoryId) query = query.eq("sub_category_id", subCategoryId);
      if (mealTypeId) query = query.eq("meal_type_id", mealTypeId);
      if (startDate) query = query.gte("specific_date", startDate);
      if (endDate) query = query.lte("specific_date", endDate);

      const { data, error } = await query
        .eq("is_active", true)
        .order("specific_date");

      if (error) throw error;
      return data as WeeklyMenuItem[];
    },
    enabled: !!(mainCategoryId && subCategoryId && mealTypeId && startDate),
  });
};

// Hook to get location pricing
export const useLocationPricing = () => {
  return useQuery({
    queryKey: ["locationPricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_pricing")
        .select("*")
        .order("location");

      if (error) throw error;
      return data as LocationPricing[];
    },
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
      delivery_location: 'Dhanmondi' | 'Farmgate' | 'Panthapath' | 'Karwanbazar' | 'New Market' | 'Banglamotor' | 'Shahbag' | 'Science Lab';
      main_category_id: string;
      sub_category_id: string;
      meal_type_id: string;
      total_amount: number;
      order_items: {
        weekly_menu_id: string;
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
      queryClient.invalidateQueries({ queryKey: ["weeklyMenuByDate"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyMenuByDateRange"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyOrders"] });
    },
  });
};

// Utility function to check if ordering is allowed for a specific date
export const isOrderingAllowedForDate = (mainCategory: MainCategory, subCategory: SubCategory, targetDate: Date) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  const cutoffTime = mainCategory.order_cutoff_time.slice(0, 5);
  
  // Get the date difference
  const dayDifference = Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (mainCategory.name === 'School Tiffin') {
    // School Tiffin - can order until 10 PM the day before
    if (dayDifference === 1) {
      return currentTime <= cutoffTime;
    } else if (dayDifference > 1) {
      return true;
    }
    return false;
  } else if (mainCategory.name === 'Office Food') {
    if (subCategory.name === 'Breakfast') {
      // Office Food Breakfast - can order until 10 PM the day before (same as School Tiffin)
      if (dayDifference === 1) {
        return currentTime <= '22:00';
      } else if (dayDifference > 1) {
        return true;
      }
      return false;
    } else if (subCategory.name === 'Lunch') {
      // Office Food Lunch - can order until 9:30 AM same day
      if (dayDifference === 0) {
        return currentTime <= cutoffTime;
      } else if (dayDifference > 0) {
        return true;
      }
      return false;
    }
  }
  
  return false;
};

// Utility function to get day names
export const getDayName = (dayOfWeek: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  return days[dayOfWeek] || 'Unknown';
};

// Utility function to get available locations
export const getAvailableLocations = () => {
  return [
    'Dhanmondi',
    'Farmgate', 
    'Panthapath',
    'Karwanbazar',
    'New Market',
    'Banglamotor',
    'Shahbag',
    'Science Lab'
  ] as const;
};

// Utility function to get weekday dates (excluding weekends)
export const getWeekdayDates = (startDate: Date, numberOfDays: number = 14) => {
  const dates = [];
  let currentDate = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < numberOfDays) {
    const dayOfWeek = currentDate.getDay();
    // Only include Sunday (0) to Thursday (4)
    if (dayOfWeek >= 0 && dayOfWeek <= 4) {
      dates.push(new Date(currentDate));
      addedDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Utility function to get available ordering dates based on category and subcategory
export const getAvailableOrderingDates = (mainCategory: MainCategory, subCategory: SubCategory) => {
  const dates = [];
  const today = new Date();
  
  // Get next 30 days to check
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const dayOfWeek = checkDate.getDay();
    
    // Only include Sunday (0) to Thursday (4), skip Friday (5) and Saturday (6)
    if (dayOfWeek >= 0 && dayOfWeek <= 4) {
      const canOrder = isOrderingAllowedForDate(mainCategory, subCategory, checkDate);
      
      dates.push({
        date: checkDate,
        dateString: checkDate.toISOString().split('T')[0],
        dayName: getDayName(dayOfWeek),
        canOrder,
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
  }
  
  return dates;
};

// Utility function to get meal types as food plans
export const getFoodPlans = () => {
  return ['Regular', 'Diet', 'Premium'];
};
