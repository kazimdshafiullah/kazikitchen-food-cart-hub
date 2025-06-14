
-- First, let's check if School Tiffin category exists and get its ID
-- If it doesn't exist, we'll create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM main_categories WHERE name = 'School Tiffin') THEN
        INSERT INTO main_categories (name, description, order_cutoff_time, advance_days)
        VALUES ('School Tiffin', 'Fresh daily tiffin service for students', '22:00', 1);
    END IF;
END $$;

-- Create subcategory for School Tiffin (Breakfast)
DO $$
DECLARE
    school_tiffin_id uuid;
BEGIN
    SELECT id INTO school_tiffin_id FROM main_categories WHERE name = 'School Tiffin' LIMIT 1;
    
    IF NOT EXISTS (
        SELECT 1 FROM sub_categories 
        WHERE main_category_id = school_tiffin_id AND name = 'Breakfast'
    ) THEN
        INSERT INTO sub_categories (main_category_id, name, description)
        VALUES (school_tiffin_id, 'Breakfast', 'Morning meal for students');
    END IF;
END $$;

-- Create meal types for School Tiffin food plans
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM meal_types WHERE name = 'Regular') THEN
        INSERT INTO meal_types (name, description) VALUES ('Regular', 'Balanced and nutritious meals for everyday needs');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM meal_types WHERE name = 'Diet') THEN
        INSERT INTO meal_types (name, description) VALUES ('Diet', 'Health-conscious options with calorie control');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM meal_types WHERE name = 'Premium') THEN
        INSERT INTO meal_types (name, description) VALUES ('Premium', 'Gourmet meals with premium ingredients and extra variety');
    END IF;
END $$;

-- Remove the food_plan column from sub_categories as we'll use meal_types instead
ALTER TABLE sub_categories DROP COLUMN IF EXISTS food_plan;

-- Update any existing School Tiffin data to use the new structure
-- This ensures compatibility with existing records
DO $$
DECLARE
    school_tiffin_id uuid;
    regular_meal_type_id uuid;
    diet_meal_type_id uuid;
    premium_meal_type_id uuid;
BEGIN
    SELECT id INTO school_tiffin_id FROM main_categories WHERE name = 'School Tiffin' LIMIT 1;
    SELECT id INTO regular_meal_type_id FROM meal_types WHERE name = 'Regular' LIMIT 1;
    SELECT id INTO diet_meal_type_id FROM meal_types WHERE name = 'Diet' LIMIT 1;
    SELECT id INTO premium_meal_type_id FROM meal_types WHERE name = 'Premium' LIMIT 1;
    
    UPDATE weekly_menu 
    SET meal_type_id = (
      CASE 
        WHEN item_name LIKE '%Premium%' OR price > 100 THEN premium_meal_type_id
        WHEN item_name LIKE '%Diet%' OR item_name LIKE '%Healthy%' THEN diet_meal_type_id
        ELSE regular_meal_type_id
      END
    )
    WHERE main_category_id = school_tiffin_id
    AND meal_type_id IS NULL;
END $$;
