
-- Update the default delivery charge for frozen food items to 70 BDT
UPDATE delivery_settings 
SET frozen_food_delivery_fee = 70.00, 
    updated_at = now() 
WHERE id = (SELECT id FROM delivery_settings LIMIT 1);

-- Also update the default value for future inserts
ALTER TABLE delivery_settings 
ALTER COLUMN frozen_food_delivery_fee SET DEFAULT 70.00;
