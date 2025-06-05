
# Kazi Kitchen - Complete Deployment & Configuration Guide

## Overview
Kazi Kitchen is a comprehensive food delivery platform built with React, TypeScript, Tailwind CSS, and Supabase. This guide covers the complete setup from database configuration to application deployment.

## Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Supabase account
- Git

## 1. Project Setup

### Clone and Install
```bash
git clone <your-repository-url>
cd kazi-kitchen
npm install
# or
bun install
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Database Setup and Configuration

### 2.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2.2 Database Schema Creation
Execute the following SQL commands in your Supabase SQL Editor:

```sql
-- Create custom enums
CREATE TYPE location_enum AS ENUM ('Dhanmondi', 'Farmgate', 'Panthapath', 'Karwanbazar', 'New Market', 'Banglamotor', 'Shahbag', 'Science Lab');
CREATE TYPE food_plan_enum AS ENUM ('Regular', 'Diet', 'Premium');

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES categories(id),
    featured BOOLEAN DEFAULT FALSE,
    popular BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main categories for weekly menu (School Tiffin, Office Food)
CREATE TABLE main_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    order_cutoff_time TIME NOT NULL,
    advance_days INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub categories with food plans
CREATE TABLE sub_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_category_id UUID NOT NULL REFERENCES main_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    food_plan food_plan_enum,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal types (Breakfast, Lunch)
CREATE TABLE meal_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly menu items
CREATE TABLE weekly_menu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_category_id UUID NOT NULL REFERENCES main_categories(id),
    sub_category_id UUID NOT NULL REFERENCES sub_categories(id),
    meal_type_id UUID NOT NULL REFERENCES meal_types(id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    item_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_limit INTEGER NOT NULL DEFAULT 100,
    current_stock INTEGER NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    week_start_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location pricing
CREATE TABLE location_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location location_enum NOT NULL,
    base_delivery_fee DECIMAL(10,2) DEFAULT 50.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    delivery_address TEXT NOT NULL,
    delivery_location location_enum,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly orders
CREATE TABLE weekly_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_location location_enum,
    main_category_id UUID NOT NULL REFERENCES main_categories(id),
    sub_category_id UUID NOT NULL REFERENCES sub_categories(id),
    meal_type_id UUID NOT NULL REFERENCES meal_types(id),
    week_start_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly order items
CREATE TABLE weekly_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekly_order_id UUID NOT NULL REFERENCES weekly_orders(id),
    weekly_menu_id UUID NOT NULL REFERENCES weekly_menu(id),
    day_of_week INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table for admin/kitchen/rider management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'kitchen', 'rider')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_main_categories_updated_at BEFORE UPDATE ON main_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_menu_updated_at BEFORE UPDATE ON weekly_menu
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_orders_updated_at BEFORE UPDATE ON weekly_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.3 Sample Data Insertion
Insert sample data to get started:

```sql
-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Appetizers', 'Delicious starters and snacks', 'https://images.unsplash.com/photo-1541833172-4c0d2c4af4c1?w=400'),
('Main Course', 'Hearty main dishes', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'),
('Desserts', 'Sweet treats and desserts', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
('Beverages', 'Refreshing drinks', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category_id, featured, popular) VALUES
('Alu Shingara', 'Crispy potato-filled triangular pastry', 45.00, 'https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400', (SELECT id FROM categories WHERE name = 'Appetizers'), true, true),
('Veg Samosa', 'Traditional vegetable samosa', 40.00, 'https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400', (SELECT id FROM categories WHERE name = 'Appetizers'), false, true),
('Chicken Roll', 'Delicious chicken wrapped in paratha', 85.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', (SELECT id FROM categories WHERE name = 'Main Course'), true, false),
('Beef Curry', 'Spicy beef curry with rice', 180.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', (SELECT id FROM categories WHERE name = 'Main Course'), false, true);

-- Insert main categories for weekly menu
INSERT INTO main_categories (name, description, order_cutoff_time, advance_days) VALUES
('School Tiffin', 'Healthy meals for school students', '22:00:00', 1),
('Office Food', 'Professional meal plans for office workers', '09:30:00', 0);

-- Insert meal types
INSERT INTO meal_types (name, description) VALUES
('Breakfast', 'Morning meal options'),
('Lunch', 'Midday meal options');

-- Insert sub categories with food plans
INSERT INTO sub_categories (main_category_id, name, description, food_plan) VALUES
-- School Tiffin Plans
((SELECT id FROM main_categories WHERE name = 'School Tiffin'), 'School Tiffin - Regular Plan', 'Balanced nutrition for everyday school meals', 'Regular'),
((SELECT id FROM main_categories WHERE name = 'School Tiffin'), 'School Tiffin - Diet Plan', 'Health-conscious options for students', 'Diet'),
((SELECT id FROM main_categories WHERE name = 'School Tiffin'), 'School Tiffin - Premium Plan', 'Premium quality meals with extra variety', 'Premium'),

-- Office Food Plans
((SELECT id FROM main_categories WHERE name = 'Office Food'), 'Office Breakfast', 'Quick and nutritious breakfast options', NULL),
((SELECT id FROM main_categories WHERE name = 'Office Food'), 'Office Lunch', 'Satisfying lunch meals for busy professionals', NULL);

-- Insert location pricing
INSERT INTO location_pricing (location, base_delivery_fee) VALUES
('Dhanmondi', 60.00),
('Farmgate', 50.00),
('Panthapath', 55.00),
('Karwanbazar', 65.00),
('New Market', 70.00),
('Banglamotor', 55.00),
('Shahbag', 50.00),
('Science Lab', 50.00);

-- Insert default admin users
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@kazikitchen.com', '$2a$10$rQj7O7w5tVP5fJ4gJ8vK3uJ1X9H6K8L9P2Y4tF7vN5cB3mZ6qA8sO', 'admin'),
('kitchen', 'kitchen@kazikitchen.com', '$2a$10$rQj7O7w5tVP5fJ4gJ8vK3uJ1X9H6K8L9P2Y4tF7vN5cB3mZ6qA8sO', 'kitchen'),
('rider', 'rider@kazikitchen.com', '$2a$10$rQj7O7w5tVP5fJ4gJ8vK3uJ1X9H6K8L9P2Y4tF7vN5cB3mZ6qA8sO', 'rider');

-- Insert sample weekly menu items for current week
INSERT INTO weekly_menu (main_category_id, sub_category_id, meal_type_id, day_of_week, item_name, description, price, week_start_date) 
SELECT 
    mc.id as main_category_id,
    sc.id as sub_category_id,
    mt.id as meal_type_id,
    generate_series(0, 4) as day_of_week,
    CASE 
        WHEN mt.name = 'Breakfast' THEN 'Breakfast Item Day ' || (generate_series(0, 4) + 1)
        ELSE 'Lunch Item Day ' || (generate_series(0, 4) + 1)
    END as item_name,
    'Delicious and nutritious meal prepared fresh daily' as description,
    CASE 
        WHEN sc.food_plan = 'Regular' THEN 80.00
        WHEN sc.food_plan = 'Diet' THEN 90.00
        WHEN sc.food_plan = 'Premium' THEN 120.00
        ELSE 100.00
    END as price,
    CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER as week_start_date
FROM main_categories mc
CROSS JOIN sub_categories sc
CROSS JOIN meal_types mt
WHERE sc.main_category_id = mc.id;
```

### 2.4 Row Level Security (Optional)
For production environments, consider enabling RLS:

```sql
-- Enable RLS on sensitive tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_orders ENABLE ROW LEVEL SECURITY;

-- Create policies as needed
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
```

## 3. Application Configuration

### 3.1 Update Supabase Configuration
Update `src/integrations/supabase/client.ts` with your project details:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 3.2 Verify Database Connection
Run the development server to test the connection:

```bash
npm run dev
# or
bun dev
```

Visit `http://localhost:5173` and check if data loads properly.

## 4. Admin Panel Setup

### 4.1 Default Login Credentials
**⚠️ IMPORTANT: Change these credentials immediately after first login**

- **Admin Panel**: `/admin/login`
  - Username: `admin`
  - Password: `admin123`

- **Kitchen Panel**: `/kitchen/login`
  - Username: `kitchen`  
  - Password: `admin123`

- **Rider Panel**: `/rider/login`
  - Username: `rider`
  - Password: `admin123`

### 4.2 First Time Setup Steps
1. Login to admin panel at `/admin/login`
2. Navigate to **Settings** → **User Management**
3. Change default passwords for all accounts
4. Create additional admin/staff accounts as needed
5. Configure menu items in **Menu Management**
6. Set up location-specific pricing in **Settings**

## 5. Features Overview

### 5.1 Customer Features
- **Frozen Food Ordering**: Individual items and combo packages
- **Weekend Menu Planning**: Weekly meal subscriptions
- **Food Plans**: Regular, Diet, and Premium options for School Tiffin
- **Location-based Delivery**: 8 delivery locations in Dhaka
- **Shopping Cart**: Persistent cart management
- **Order Tracking**: Real-time order status updates

### 5.2 Admin Features
- **Dashboard**: Overview of orders, revenue, and analytics
- **Order Management**: Process and track all orders
- **Menu Management**: Manage weekly menus and food plans
- **Inventory Control**: Stock management and pricing
- **User Management**: Admin, kitchen, and rider accounts
- **Location Pricing**: Configure delivery fees by area
- **Reports**: Sales and performance analytics

### 5.3 Kitchen Features
- **Order Queue**: View and manage cooking orders
- **Preparation Tracking**: Mark items as prepared
- **Menu Status**: Update availability and stock

### 5.4 Rider Features
- **Delivery Dashboard**: Assigned deliveries
- **Route Management**: Optimized delivery routes
- **Status Updates**: Real-time delivery tracking

## 6. Deployment Options

### 6.1 Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables in Vercel dashboard
```

### 6.2 Netlify Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the 'dist' folder to Netlify
# Configure environment variables in Netlify dashboard
```

### 6.3 Manual Deployment
```bash
# Build for production
npm run build

# Upload 'dist' folder to your web server
# Configure environment variables on your hosting platform
```

## 7. Environment Variables
Ensure these are set in your deployment platform:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 8. Post-Deployment Checklist

### 8.1 Security
- [ ] Change all default passwords
- [ ] Enable RLS policies in production
- [ ] Configure CORS settings in Supabase
- [ ] Set up SSL certificates

### 8.2 Configuration
- [ ] Update contact information in footer
- [ ] Configure email settings for notifications
- [ ] Set up payment gateway (if applicable)
- [ ] Test all user flows

### 8.3 Content Management
- [ ] Upload product images
- [ ] Configure weekly menu items
- [ ] Set location-specific pricing
- [ ] Create initial admin accounts

## 9. Troubleshooting

### Common Issues
1. **Database Connection Failed**: Check Supabase URL and keys
2. **Images Not Loading**: Verify image URLs and storage setup
3. **Orders Not Saving**: Check database permissions and RLS policies
4. **Login Issues**: Verify user table data and password hashes

### Support
For technical support:
- Check Supabase logs in your dashboard
- Review browser console for JavaScript errors
- Verify environment variables are correctly set
- Ensure database schema matches the provided SQL

## 10. Development Workflow

### 10.1 Local Development
```bash
# Start development server
npm run dev

# Access different portals:
# Customer site: http://localhost:5173
# Admin panel: http://localhost:5173/admin
# Kitchen panel: http://localhost:5173/kitchen
# Rider panel: http://localhost:5173/rider
```

### 10.2 Database Updates
When making schema changes:
1. Test in development environment first
2. Create migration scripts
3. Backup production database
4. Apply changes during low-traffic periods

---

**🎉 Congratulations!** Your Kazi Kitchen application is now ready for production use. Remember to regularly backup your database and monitor application performance.
