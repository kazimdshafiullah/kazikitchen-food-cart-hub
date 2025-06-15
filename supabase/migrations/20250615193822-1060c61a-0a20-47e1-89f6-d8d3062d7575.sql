
-- First, let's add the missing is_enabled column to main_categories and fix the structure
ALTER TABLE main_categories ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT true;
ALTER TABLE sub_categories ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT true;
ALTER TABLE meal_types ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT true;

-- Now clean up and ensure we have exactly the right structure
DELETE FROM sub_categories;
DELETE FROM main_categories WHERE name IN ('School Tiffin', 'Office Food');

-- Create exactly 2 main categories: School Tiffin and Office Food
INSERT INTO main_categories (name, description, order_cutoff_time, advance_days, is_enabled)
VALUES 
  ('School Tiffin', 'Fresh daily tiffin service for students', '22:00:00', 1, true),
  ('Office Food', 'Professional catering for offices', '09:30:00', 0, true);

-- Create proper subcategories
DO $$
DECLARE
    school_tiffin_id uuid;
    office_food_id uuid;
BEGIN
    SELECT id INTO school_tiffin_id FROM main_categories WHERE name = 'School Tiffin' LIMIT 1;
    SELECT id INTO office_food_id FROM main_categories WHERE name = 'Office Food' LIMIT 1;
    
    -- School Tiffin: Only Breakfast
    INSERT INTO sub_categories (main_category_id, name, description, is_enabled)
    VALUES (school_tiffin_id, 'Breakfast', 'Morning tiffin for students', true);
    
    -- Office Food: Breakfast and Lunch
    INSERT INTO sub_categories (main_category_id, name, description, is_enabled)
    VALUES 
      (office_food_id, 'Breakfast', 'Morning meal for office workers', true),
      (office_food_id, 'Lunch', 'Afternoon meal for office workers', true);
END $$;

-- Ensure meal types (meal plans) are correct
DELETE FROM meal_types;
INSERT INTO meal_types (name, description, is_enabled) VALUES 
  ('Regular', 'Balanced and nutritious meals for everyday needs', true),
  ('Diet', 'Health-conscious options with calorie control', true),
  ('Premium', 'Gourmet meals with premium ingredients and extra variety', true);
