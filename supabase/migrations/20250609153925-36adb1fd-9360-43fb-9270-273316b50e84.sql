
-- First, let's handle the duplicate user issue by checking if users exist before inserting
DO $$
BEGIN
    -- Only insert admin user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
        INSERT INTO users (username, email, password_hash, role) VALUES
        ('admin', 'admin@kazikitchen.com', '$2a$10$rQj7O7w5tVP5fJ4gJ8vK3uJ1X9H6K8L9P2Y4tF7vN5cB3mZ6qA8sO', 'admin');
    END IF;
    
    -- Only insert kitchen user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'kitchen') THEN
        INSERT INTO users (username, email, password_hash, role) VALUES
        ('kitchen', 'kitchen@kazikitchen.com', '$2a$10$rQj7O7w5tVP5fJ4gJ8vK3uJ1X9H6K8L9P2Y4tF7vN5cB3mZ6qA8sO', 'kitchen');
    END IF;
    
    -- Only insert rider user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'rider') THEN
        INSERT INTO users (username, email, password_hash, role) VALUES
        ('rider', 'rider@kazikitchen.com', '$2a$10$rQj7O7w5tVP5fJ4gJ8vK3uJ1X9H6K8L9P2Y4tF7vN5cB3mZ6qA8sO', 'rider');
    END IF;
END $$;

-- Clear existing weekly menu data for current week to avoid duplicates
DELETE FROM weekly_menu WHERE week_start_date = (CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER);

-- Insert sample weekly menu items with corrected syntax
-- We'll use a different approach that doesn't use generate_series in CASE statements
WITH week_days AS (
  SELECT generate_series(0, 4) as day_of_week
),
menu_combinations AS (
  SELECT 
    mc.id as main_category_id,
    mc.name as main_category_name,
    sc.id as sub_category_id,
    sc.food_plan,
    mt.id as meal_type_id,
    mt.name as meal_type_name,
    wd.day_of_week,
    (CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER) as week_start_date
  FROM main_categories mc
  CROSS JOIN sub_categories sc
  CROSS JOIN meal_types mt
  CROSS JOIN week_days wd
  WHERE sc.main_category_id = mc.id
)
INSERT INTO weekly_menu (
  main_category_id, 
  sub_category_id, 
  meal_type_id, 
  day_of_week, 
  item_name, 
  description, 
  price, 
  week_start_date
)
SELECT 
  main_category_id,
  sub_category_id,
  meal_type_id,
  day_of_week,
  CASE 
    WHEN meal_type_name = 'Breakfast' THEN 'Breakfast Item Day ' || (day_of_week + 1)
    ELSE 'Lunch Item Day ' || (day_of_week + 1)
  END as item_name,
  'Delicious and nutritious meal prepared fresh daily' as description,
  CASE 
    WHEN food_plan = 'Regular' THEN 80.00
    WHEN food_plan = 'Diet' THEN 90.00
    WHEN food_plan = 'Premium' THEN 120.00
    ELSE 100.00
  END as price,
  week_start_date
FROM menu_combinations;
