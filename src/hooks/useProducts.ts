
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  description: string | null;
  featured: boolean | null;
  popular: boolean | null;
  in_stock: boolean | null;
  is_frozen_food: boolean | null;
  created_at: string;
  updated_at: string;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true);
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('in_stock', true);
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true);
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const usePopularProducts = () => {
  return useQuery({
    queryKey: ['products', 'popular'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('popular', true)
        .eq('in_stock', true);
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Product;
    },
  });
};
