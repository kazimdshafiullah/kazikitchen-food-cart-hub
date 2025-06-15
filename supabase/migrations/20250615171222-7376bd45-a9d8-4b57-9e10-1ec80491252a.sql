
-- Add delivery configuration table for the new delivery system
CREATE TABLE delivery_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  free_delivery_threshold NUMERIC NOT NULL DEFAULT 500.00,
  frozen_food_delivery_fee NUMERIC NOT NULL DEFAULT 120.00,
  weekend_menu_free_delivery BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default delivery settings
INSERT INTO delivery_settings (
  free_delivery_threshold,
  frozen_food_delivery_fee,
  weekend_menu_free_delivery
) VALUES (500.00, 120.00, true);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_delivery_settings_updated_at
  BEFORE UPDATE ON delivery_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add is_frozen_food flag to products table to identify frozen items
ALTER TABLE products ADD COLUMN is_frozen_food BOOLEAN NOT NULL DEFAULT false;

-- Remove location_pricing table as we're removing location-based delivery
DROP TABLE IF EXISTS location_pricing CASCADE;
