
-- First, clear all weekly menu related data to avoid foreign key constraints
DELETE FROM weekly_order_items;
DELETE FROM weekly_orders;
DELETE FROM weekly_menu;

-- Now we can safely clear and recreate sub_categories
DELETE FROM sub_categories;

-- First, let's update the main_categories with proper timing
UPDATE main_categories 
SET order_cutoff_time = '22:00:00', advance_days = 1 
WHERE name = 'School Tiffin';

-- Add Office Food category if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM main_categories WHERE name = 'Office Food') THEN
        INSERT INTO main_categories (name, description, order_cutoff_time, advance_days)
        VALUES ('Office Food', 'Professional catering for offices', '09:30:00', 0);
    END IF;
END $$;

-- Create proper subcategories for School Tiffin
INSERT INTO sub_categories (main_category_id, name, description)
SELECT id, 'Breakfast', 'Morning tiffin for students'
FROM main_categories WHERE name = 'School Tiffin';

-- Create subcategories for Office Food
INSERT INTO sub_categories (main_category_id, name, description)
SELECT id, 'Breakfast', 'Morning meal for office workers'
FROM main_categories WHERE name = 'Office Food'
UNION ALL
SELECT id, 'Lunch', 'Afternoon meal for office workers'
FROM main_categories WHERE name = 'Office Food';

-- Clear and recreate meal types to ensure we have exactly what we need
DELETE FROM meal_types;
INSERT INTO meal_types (name, description) VALUES 
('Regular', 'Balanced and nutritious meals for everyday needs'),
('Diet', 'Health-conscious options with calorie control'),
('Premium', 'Gourmet meals with premium ingredients and extra variety');

-- Update weekly_menu table structure to be date-based rather than week-based
-- Remove week_start_date and day_of_week dependencies
ALTER TABLE weekly_menu DROP COLUMN IF EXISTS week_start_date;
ALTER TABLE weekly_menu DROP COLUMN IF EXISTS day_of_week;

-- Update weekly_orders table to remove week-based fields
ALTER TABLE weekly_orders DROP COLUMN IF EXISTS week_start_date;
ALTER TABLE weekly_order_items DROP COLUMN IF EXISTS day_of_week;
