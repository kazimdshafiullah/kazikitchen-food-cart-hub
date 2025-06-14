
-- Insert location pricing data for all locations, skipping duplicates with explicit enum casting
INSERT INTO location_pricing (location, base_delivery_fee) 
SELECT location::location_enum, base_delivery_fee
FROM (VALUES 
  ('Dhanmondi', 120.00),
  ('New Market', 120.00),
  ('Elephant Road', 120.00),
  ('Shahbag', 120.00),
  ('Banglamotor', 120.00),
  ('Karwanbazar', 120.00),
  ('Farmgate', 120.00),
  ('Panthapath', 120.00),
  ('Mirpur Road', 120.00),
  ('Zigatola', 120.00),
  ('Lalmatia', 120.00)
) AS new_locations(location, base_delivery_fee)
WHERE NOT EXISTS (
  SELECT 1 FROM location_pricing lp 
  WHERE lp.location = new_locations.location::location_enum
);
