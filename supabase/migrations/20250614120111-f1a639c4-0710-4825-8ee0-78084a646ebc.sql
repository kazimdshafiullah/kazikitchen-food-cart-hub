
-- First, let's see what main categories we have
SELECT id, name, description FROM main_categories;

-- Check what sub categories exist and their food plans
SELECT id, name, description, food_plan, main_category_id FROM sub_categories;

-- Let's ensure we have the proper School Tiffin category and subcategories
-- Insert School Tiffin main category if it doesn't exist
INSERT INTO main_categories (name, description, order_cutoff_time, advance_days)
VALUES ('School Tiffin', 'Fresh daily tiffin for students', '22:00:00', 1)
ON CONFLICT DO NOTHING;

-- Get the School Tiffin category ID
WITH school_tiffin AS (
  SELECT id FROM main_categories WHERE name = 'School Tiffin' LIMIT 1
)
-- Insert the three food plan subcategories for School Tiffin with proper enum casting
INSERT INTO sub_categories (name, description, food_plan, main_category_id)
SELECT 
  'Regular Tiffin' as name,
  'Balanced and nutritious meals for everyday needs' as description,
  'Regular'::food_plan_enum as food_plan,
  school_tiffin.id as main_category_id
FROM school_tiffin
WHERE NOT EXISTS (
  SELECT 1 FROM sub_categories s 
  WHERE s.main_category_id = school_tiffin.id AND s.food_plan = 'Regular'::food_plan_enum
)
UNION ALL
SELECT 
  'Diet Tiffin' as name,
  'Health-conscious options with calorie control' as description,
  'Diet'::food_plan_enum as food_plan,
  school_tiffin.id as main_category_id
FROM school_tiffin
WHERE NOT EXISTS (
  SELECT 1 FROM sub_categories s 
  WHERE s.main_category_id = school_tiffin.id AND s.food_plan = 'Diet'::food_plan_enum
)
UNION ALL
SELECT 
  'Premium Tiffin' as name,
  'Gourmet meals with premium ingredients and extra variety' as description,
  'Premium'::food_plan_enum as food_plan,
  school_tiffin.id as main_category_id
FROM school_tiffin
WHERE NOT EXISTS (
  SELECT 1 FROM sub_categories s 
  WHERE s.main_category_id = school_tiffin.id AND s.food_plan = 'Premium'::food_plan_enum
);
