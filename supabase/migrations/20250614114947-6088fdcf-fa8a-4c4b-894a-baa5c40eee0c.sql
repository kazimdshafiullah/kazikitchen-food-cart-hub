
-- Add image_url column to weekly_menu table for menu item images
ALTER TABLE weekly_menu ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update weekly_menu to use specific dates instead of day_of_week
-- We'll keep day_of_week for backward compatibility but add specific_date
ALTER TABLE weekly_menu ADD COLUMN IF NOT EXISTS specific_date DATE;

-- Create an index on specific_date for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_menu_specific_date ON weekly_menu(specific_date);

-- Update the existing day_of_week data to use specific dates
-- This will set specific_date based on week_start_date + day_of_week
UPDATE weekly_menu 
SET specific_date = week_start_date + (day_of_week || ' days')::interval
WHERE specific_date IS NULL;

-- Make specific_date NOT NULL after updating existing data
ALTER TABLE weekly_menu ALTER COLUMN specific_date SET NOT NULL;
