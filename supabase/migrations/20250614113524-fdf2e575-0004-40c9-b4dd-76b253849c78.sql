
-- First, let's get the School Tiffin main category ID and insert subcategories
INSERT INTO sub_categories (main_category_id, name, description, food_plan)
SELECT 
  mc.id,
  'Regular',
  'Standard nutritious meals for everyday school lunch',
  'Regular'
FROM main_categories mc
WHERE LOWER(mc.name) LIKE '%school%' OR LOWER(mc.name) LIKE '%tiffin%';

INSERT INTO sub_categories (main_category_id, name, description, food_plan)
SELECT 
  mc.id,
  'Diet',
  'Healthy, low-calorie options for health-conscious students',
  'Diet'
FROM main_categories mc
WHERE LOWER(mc.name) LIKE '%school%' OR LOWER(mc.name) LIKE '%tiffin%';

INSERT INTO sub_categories (main_category_id, name, description, food_plan)
SELECT 
  mc.id,
  'Premium',
  'Premium quality meals with extra variety and special ingredients',
  'Premium'
FROM main_categories mc
WHERE LOWER(mc.name) LIKE '%school%' OR LOWER(mc.name) LIKE '%tiffin%';
