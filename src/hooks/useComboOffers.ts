
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ComboOffer {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  original_price: number;
  combo_price: number;
  is_active: boolean;
  stock_limit: number;
  created_at: string;
  updated_at: string;
}

export interface ComboOfferItem {
  id: string;
  combo_offer_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products: {
    name: string;
    price: number;
  };
}

export interface ComboOfferWithItems extends ComboOffer {
  combo_offer_items: ComboOfferItem[];
}

export const useComboOffers = () => {
  return useQuery({
    queryKey: ['combo-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combo_offers')
        .select(`
          *,
          combo_offer_items (
            *,
            products (
              name,
              price
            )
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching combo offers:', error);
        throw error;
      }
      
      return data as ComboOfferWithItems[];
    },
  });
};

export const useCreateComboOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comboData: {
      name: string;
      description?: string;
      image_url?: string;
      original_price: number;
      combo_price: number;
      stock_limit: number;
      items: { product_id: string; quantity: number }[];
    }) => {
      // First create the combo offer
      const { data: combo, error: comboError } = await supabase
        .from('combo_offers')
        .insert({
          name: comboData.name,
          description: comboData.description || null,
          image_url: comboData.image_url || null,
          original_price: comboData.original_price,
          combo_price: comboData.combo_price,
          stock_limit: comboData.stock_limit,
        })
        .select()
        .single();

      if (comboError) {
        throw comboError;
      }

      // Then create the combo items
      if (comboData.items.length > 0) {
        const comboItems = comboData.items.map(item => ({
          combo_offer_id: combo.id,
          product_id: item.product_id,
          quantity: item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from('combo_offer_items')
          .insert(comboItems);

        if (itemsError) {
          throw itemsError;
        }
      }

      return combo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combo-offers'] });
      toast({
        title: "Success",
        description: "Combo offer created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating combo offer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create combo offer",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteComboOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comboId: string) => {
      const { error } = await supabase
        .from('combo_offers')
        .delete()
        .eq('id', comboId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combo-offers'] });
      toast({
        title: "Success",
        description: "Combo offer deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting combo offer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete combo offer",
        variant: "destructive",
      });
    },
  });
};
