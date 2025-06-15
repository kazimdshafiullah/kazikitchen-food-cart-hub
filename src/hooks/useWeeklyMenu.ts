
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

      // Update stock for each item
      for (const item of orderData.items) {
        const { error: stockError } = await supabase
          .from('weekly_menu')
          .update({ 
            current_stock: supabase.raw(`current_stock - ${item.quantity}`)
          })
          .eq('id', item.weekly_menu_id);

        if (stockError) {
          console.error('Error updating stock:', stockError);
          throw stockError;
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

// Remove the useLocationPricing hook as the table was dropped
// This functionality is now handled by the delivery_settings table
