
-- Create combo_offers table for storing combo offer details
CREATE TABLE public.combo_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  original_price NUMERIC NOT NULL,
  combo_price NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  stock_limit INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create combo_offer_items table to store which products are included in each combo
CREATE TABLE public.combo_offer_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  combo_offer_id UUID NOT NULL REFERENCES public.combo_offers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_combo_offers_updated_at
  BEFORE UPDATE ON public.combo_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_combo_offers_is_active ON public.combo_offers(is_active);
CREATE INDEX idx_combo_offer_items_combo_id ON public.combo_offer_items(combo_offer_id);
CREATE INDEX idx_combo_offer_items_product_id ON public.combo_offer_items(product_id);
