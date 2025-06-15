
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface WeeklyMenuItem {
  id: string;
  item_name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  specific_date: string;
  stock_limit: number;
  current_stock: number;
  is_active: boolean;
  main_category_id: string;
  sub_category_id: string;
  meal_type_id: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyMenuWithRelations extends WeeklyMenuItem {
  main_categories: {
    name: string;
    description: string | null;
    order_cutoff_time: string;
    advance_days: number;
  };
  sub_categories: {
    name: string;
    description: string | null;
  };
  meal_types: {
    name: string;
    description: string | null;
  };
}

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

export interface WeeklyOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_location: string;
  main_category_id: string;
  sub_category_id: string;
  meal_type_id: string;
  items: Array<{
    weekly_menu_id: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
}

export const useWeeklyMenu = (date?: string) => {
  return useQuery({
    queryKey: ['weekly-menu', date],
    queryFn: async () => {
      let query = supabase
        .from('weekly_menu')
        .select(`
          *,
          main_categories (
            name,
            description,
            order_cutoff_time,
            advance_days
          ),
          sub_categories (
            name,
            description
          ),
          meal_types (
            name,
            description
          )
        `)
        .eq('is_active', true)
        .order('specific_date', { ascending: true });

      if (date) {
        query = query.eq('specific_date', date);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as WeeklyMenuWithRelations[];
    },
  });
};

export const useMainCategories = () => {
  return useQuery({
    queryKey: ['main-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('main_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as MainCategory[];
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
      
      if (error) throw error;
      return data as SubCategory[];
    },
    enabled: !!mainCategoryId,
  });
};

export const useMealTypes = () => {
  return useQuery({
    queryKey: ['meal-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as MealType[];
    },
  });
};

export const useWeeklyMenuByCategory = (mainCategoryId: string, subCategoryId: string, mealTypeId: string, date?: string) => {
  return useQuery({
    queryKey: ['weekly-menu', 'category', mainCategoryId, subCategoryId, mealTypeId, date],
    queryFn: async () => {
      let query = supabase
        .from('weekly_menu')
        .select(`
          *,
          main_categories (
            name,
            description,
            order_cutoff_time,
            advance_days
          ),
          sub_categories (
            name,
            description
          ),
          meal_types (
            name,
            description
          )
        `)
        .eq('main_category_id', mainCategoryId)
        .eq('sub_category_id', subCategoryId)
        .eq('meal_type_id', mealTypeId)
        .eq('is_active', true)
        .order('specific_date', { ascending: true });

      if (date) {
        query = query.eq('specific_date', date);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as WeeklyMenuWithRelations[];
    },
  });
};

export const useWeeklyMenuByDateRange = (
  mainCategoryId?: string, 
  subCategoryId?: string, 
  mealTypeId?: string, 
  startDate?: string, 
  endDate?: string
) => {
  return useQuery({
    queryKey: ['weekly-menu', 'date-range', mainCategoryId, subCategoryId, mealTypeId, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('weekly_menu')
        .select(`
          *,
          main_categories (
            name,
            description,
            order_cutoff_time,
            advance_days
          ),
          sub_categories (
            name,
            description
          ),
          meal_types (
            name,
            description
          )
        `)
        .eq('is_active', true)
        .order('specific_date', { ascending: true });

      if (mainCategoryId) {
        query = query.eq('main_category_id', mainCategoryId);
      }
      if (subCategoryId) {
        query = query.eq('sub_category_id', subCategoryId);
      }
      if (mealTypeId) {
        query = query.eq('meal_type_id', mealTypeId);
      }
      if (startDate) {
        query = query.gte('specific_date', startDate);
      }
      if (endDate) {
        query = query.lte('specific_date', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as WeeklyMenuWithRelations[];
    },
    enabled: !!(mainCategoryId && subCategoryId && mealTypeId),
  });
};

export const useCreateWeeklyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: WeeklyOrderData) => {
      console.log('Creating weekly order with data:', orderData);

      // Create the main order
      const { data: order, error: orderError } = await supabase
        .from('weekly_orders')
        .insert({
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          delivery_address: orderData.delivery_address,
          delivery_location: orderData.delivery_location as any,
          main_category_id: orderData.main_category_id,
          sub_category_id: orderData.sub_category_id,
          meal_type_id: orderData.meal_type_id,
          total_amount: orderData.total_amount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating weekly order:', orderError);
        throw orderError;
      }

      console.log('Created weekly order:', order);

      // Create order items
      const orderItems = orderData.items.map(item => ({
        weekly_order_id: order.id,
        weekly_menu_id: item.weekly_menu_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('weekly_order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating weekly order items:', itemsError);
        throw itemsError;
      }

      console.log('Created weekly order items');

      // Update stock for each item using SQL function instead of raw
      for (const item of orderData.items) {
        const { error: stockError } = await supabase.rpc('decrement_stock', {
          menu_item_id: item.weekly_menu_id,
          quantity: item.quantity
        });

        if (stockError) {
          // Fallback to direct update if function doesn't exist
          const { error: fallbackError } = await supabase
            .from('weekly_menu')
            .update({ 
              current_stock: Math.max(0, await getCurrentStock(item.weekly_menu_id) - item.quantity)
            })
            .eq('id', item.weekly_menu_id);

          if (fallbackError) {
            console.error('Error updating stock:', fallbackError);
            throw fallbackError;
          }
        }
      }

      console.log('Updated stock for all items');

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-menu'] });
      toast.success('Order placed successfully!');
    },
    onError: (error) => {
      console.error('Weekly order creation failed:', error);
      toast.error('Failed to place order. Please try again.');
    },
  });
};

// Helper function to get current stock
const getCurrentStock = async (menuItemId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('weekly_menu')
    .select('current_stock')
    .eq('id', menuItemId)
    .single();
  
  if (error || !data) return 0;
  return data.current_stock;
};

// Utility functions
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || '';
};

export const getAvailableOrderingDates = (mainCategory: MainCategory, subCategory: SubCategory) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const dayOfWeek = checkDate.getDay();
    
    // Only include Sunday (0) to Thursday (4), skip Friday (5) and Saturday (6)
    if (dayOfWeek >= 0 && dayOfWeek <= 4) {
      const canOrder = canOrderForDate(checkDate, mainCategory);
      
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

const canOrderForDate = (targetDate: Date, mainCategory: MainCategory): boolean => {
  const now = new Date();
  const cutoffTime = mainCategory.order_cutoff_time;
  const advanceDays = mainCategory.advance_days;
  
  // Calculate the cutoff datetime
  const cutoffDate = new Date(targetDate);
  cutoffDate.setDate(targetDate.getDate() - advanceDays);
  
  const [hours, minutes] = cutoffTime.split(':').map(Number);
  cutoffDate.setHours(hours, minutes, 0, 0);
  
  return now <= cutoffDate;
};

export const getFoodPlans = (): string[] => {
  return ['Regular', 'Diet', 'Premium'];
};

export const getAvailableLocations = (): string[] => {
  return [
    'Dhanmondi',
    'Farmgate', 
    'Panthapath',
    'Karwanbazar',
    'New Market',
    'Banglamotor',
    'Shahbag',
    'Science Lab',
    'Elephant Road',
    'Mirpur Road',
    'Zigatola',
    'Lalmatia'
  ];
};

// Mock location pricing hook since the table was removed
export const useLocationPricing = () => {
  return {
    data: getAvailableLocations().map(location => ({
      location,
      base_delivery_fee: 0 // Free delivery with new system
    })),
    loading: false,
    error: null
  };
};
