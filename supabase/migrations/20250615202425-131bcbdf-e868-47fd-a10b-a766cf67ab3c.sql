
-- Create menu_items table for storing menu items
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  main_category_id UUID NOT NULL REFERENCES public.main_categories(id) ON DELETE CASCADE,
  sub_category_id UUID REFERENCES public.sub_categories(id) ON DELETE SET NULL,
  meal_type_id UUID REFERENCES public.meal_types(id) ON DELETE SET NULL,
  specific_date DATE,
  stock_limit INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_menu_items_main_category ON public.menu_items(main_category_id);
CREATE INDEX idx_menu_items_sub_category ON public.menu_items(sub_category_id);
CREATE INDEX idx_menu_items_meal_type ON public.menu_items(meal_type_id);
CREATE INDEX idx_menu_items_specific_date ON public.menu_items(specific_date);
CREATE INDEX idx_menu_items_is_active ON public.menu_items(is_active);
