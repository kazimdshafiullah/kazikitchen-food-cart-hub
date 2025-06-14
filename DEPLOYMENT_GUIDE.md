
# Kazi Kitchen - Complete Deployment Guide

A comprehensive guide for deploying the Kazi Kitchen food delivery application with authentication system.

## System Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: JWT-based with httpOnly cookies
- **Database**: PostgreSQL with location and food plan support
- **Deployment**: VM/VPS with Nginx reverse proxy

## Prerequisites

- Ubuntu/Debian VPS or VM (2GB+ RAM recommended)
- Domain name (optional, can use IP address)
- SSH access to server

## Part 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Software
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### 1.3 Configure Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Part 2: Database Setup

### 2.1 Configure PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE kazi_kitchen;
CREATE USER kazi_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kazi_kitchen TO kazi_user;
ALTER USER kazi_user CREATEDB;
\q
```

### 2.2 Create Database Schema
```bash
# Connect to the database
sudo -u postgres psql -d kazi_kitchen

# Create tables and types
-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'kitchen', 'rider')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location enum type
CREATE TYPE location_enum AS ENUM (
    'Dhanmondi', 'Farmgate', 'Panthapath', 'Karwanbazar', 
    'New Market', 'Banglamotor', 'Shahbag', 'Science Lab'
);

-- Food plan enum type
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
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main categories for weekly menu
CREATE TABLE main_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    order_cutoff_time TIME NOT NULL,
    advance_days INTEGER DEFAULT 0,
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

-- Meal types
CREATE TABLE meal_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly menu
CREATE TABLE weekly_menu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_category_id UUID NOT NULL REFERENCES main_categories(id),
    sub_category_id UUID NOT NULL REFERENCES sub_categories(id),
    meal_type_id UUID NOT NULL REFERENCES meal_types(id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 4),
    item_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_limit INTEGER DEFAULT 100,
    current_stock INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    week_start_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table with location
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

-- Weekly orders with location
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
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly order items
CREATE TABLE weekly_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekly_order_id UUID NOT NULL REFERENCES weekly_orders(id),
    weekly_menu_id UUID NOT NULL REFERENCES weekly_menu(id),
    day_of_week INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location pricing
CREATE TABLE location_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location location_enum NOT NULL UNIQUE,
    base_delivery_fee DECIMAL(10,2) DEFAULT 50.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_main_categories_updated_at BEFORE UPDATE ON main_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_menu_updated_at BEFORE UPDATE ON weekly_menu FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_orders_updated_at BEFORE UPDATE ON weekly_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\q
```

### 2.3 Insert Sample Data
```bash
sudo -u postgres psql -d kazi_kitchen

-- Insert default users (CHANGE PASSWORDS IMMEDIATELY!)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@kazikitchen.com', '$2a$10$8K3rJ9QGZ4XFH1M2pL6eWeh8g3zPOJTM9N6ZrTp5sVUw7wF2J4P9K', 'admin'),
('kitchen', 'kitchen@kazikitchen.com', '$2a$10$8K3rJ9QGZ4XFH1M2pL6eWeh8g3zPOJTM9N6ZrTp5sVUw7wF2J4P9K', 'kitchen'),
('rider', 'rider@kazikitchen.com', '$2a$10$8K3rJ9QGZ4XFH1M2pL6eWeh8g3zPOJTM9N6ZrTp5sVUw7wF2J4P9K', 'rider');

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

-- Insert main categories
INSERT INTO main_categories (name, description, order_cutoff_time, advance_days) VALUES
('School Tiffin', 'Daily lunch boxes for school students', '22:00:00', 1),
('Office Food', 'Fresh meals for office workers', '09:30:00', 0);

-- Insert meal types
INSERT INTO meal_types (name, description) VALUES
('Breakfast', 'Morning meal options'),
('Lunch', 'Midday meal options');

-- Insert sub categories with food plans
INSERT INTO sub_categories (main_category_id, name, description, food_plan)
SELECT 
    mc.id,
    'School Tiffin - Regular Plan',
    'Standard nutritious meals for everyday school lunch',
    'Regular'
FROM main_categories mc WHERE mc.name = 'School Tiffin';

INSERT INTO sub_categories (main_category_id, name, description, food_plan)
SELECT 
    mc.id,
    'School Tiffin - Diet Plan',
    'Healthy, low-calorie options for health-conscious students',
    'Diet'
FROM main_categories mc WHERE mc.name = 'School Tiffin';

INSERT INTO sub_categories (main_category_id, name, description, food_plan)
SELECT 
    mc.id,
    'School Tiffin - Premium Plan',
    'Premium quality meals with extra variety and special ingredients',
    'Premium'
FROM main_categories mc WHERE mc.name = 'School Tiffin';

INSERT INTO sub_categories (main_category_id, name, description)
SELECT 
    mc.id,
    'Office Breakfast',
    'Fresh breakfast options for office workers'
FROM main_categories mc WHERE mc.name = 'Office Food';

INSERT INTO sub_categories (main_category_id, name, description)
SELECT 
    mc.id,
    'Office Lunch',
    'Hearty lunch options for office workers'
FROM main_categories mc WHERE mc.name = 'Office Food';

\q
```

## Part 3: Application Deployment

### 3.1 Clone Repository
```bash
# Create application directory
sudo mkdir -p /var/www/kazi-kitchen
sudo chown $USER:$USER /var/www/kazi-kitchen
cd /var/www/kazi-kitchen

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/yourusername/kazi-kitchen.git .
```

### 3.2 Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create production environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Edit the `.env` file with your actual values:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kazi_kitchen
DB_USER=kazi_user
DB_PASSWORD=your_secure_password

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://your-domain.com
```

### 3.3 Frontend Setup
```bash
cd /var/www/kazi-kitchen

# Install dependencies
npm install

# Create production environment file
nano .env
```

Add your environment variables:
```env
VITE_API_URL=http://your-domain.com/api
```

### 3.4 Build Frontend
```bash
npm run build
```

### 3.5 Start Backend with PM2
```bash
cd backend

# Start backend with PM2
pm2 start server.js --name "kazi-kitchen-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Part 4: Nginx Configuration

### 4.1 Create Nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/kazi-kitchen
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # Frontend (React build)
    location / {
        root /var/www/kazi-kitchen/dist;
        try_files $uri $uri/ /index.html;
        
        # Add security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Enable CORS
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin $http_origin;
            add_header Access-Control-Allow-Credentials true;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Content-Type text/plain;
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/api/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4.2 Enable Site and Restart Nginx
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/kazi-kitchen /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Part 5: SSL Certificate (Optional but Recommended)

### 5.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Part 6: Application Configuration

### 6.1 Update Frontend Environment
```bash
cd /var/www/kazi-kitchen
nano .env
```

Update with HTTPS if you installed SSL:
```env
VITE_API_URL=https://your-domain.com/api
```

### 6.2 Rebuild and Restart
```bash
# Rebuild frontend
npm run build

# Restart backend
pm2 restart kazi-kitchen-backend

# Restart Nginx
sudo systemctl restart nginx
```

## Part 7: Security Configuration

### 7.1 Configure PostgreSQL Security
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Ensure only local connections are allowed for the application user.

### 7.2 Set Up Automatic Updates
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 7.3 Configure Fail2Ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Part 8: Monitoring and Maintenance

### 8.1 Monitor PM2 Processes
```bash
# Check status
pm2 status

# View logs
pm2 logs kazi-kitchen-backend

# Monitor in real-time
pm2 monit
```

### 8.2 Database Backups
Create a backup script:
```bash
sudo nano /usr/local/bin/backup-kazi-kitchen.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/kazi-kitchen"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
sudo -u postgres pg_dump kazi_kitchen > $BACKUP_DIR/kazi_kitchen_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: kazi_kitchen_$DATE.sql"
```

Make it executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/backup-kazi-kitchen.sh

# Add to cron for daily backups at 2 AM
sudo crontab -e
0 2 * * * /usr/local/bin/backup-kazi-kitchen.sh
```

## Part 9: Testing

### 9.1 Test Application
1. Open your browser and visit your domain
2. Test user registration and login
3. Try placing an order
4. Check admin panel functionality
5. Verify kitchen and rider portals

### 9.2 Test API Endpoints
```bash
# Health check
curl https://your-domain.com/api/health

# Test authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"admin"}'
```

## Default Login Credentials

**⚠️ IMPORTANT: Change these passwords immediately after deployment!**

- **Admin Panel**: 
  - Username: `admin`
  - Password: `admin123`
  
- **Kitchen Portal**: 
  - Username: `kitchen`
  - Password: `admin123`
  
- **Rider Portal**: 
  - Username: `rider`
  - Password: `admin123`

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Check if backend is running with `pm2 status`
2. **Database Connection Error**: Verify PostgreSQL credentials in `.env`
3. **CORS Issues**: Check Nginx CORS headers configuration
4. **Build Errors**: Ensure all dependencies are installed with `npm install`

### Log Locations
- Nginx logs: `/var/log/nginx/`
- PM2 logs: `pm2 logs`
- PostgreSQL logs: `/var/log/postgresql/`

### Useful Commands
```bash
# Restart all services
sudo systemctl restart nginx
pm2 restart all
sudo systemctl restart postgresql

# Check service status
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status

# View real-time logs
sudo tail -f /var/log/nginx/error.log
pm2 logs kazi-kitchen-backend --lines 50
```

## Updates and Maintenance

### Updating the Application
```bash
cd /var/www/kazi-kitchen

# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend && npm install

# Update frontend dependencies
cd .. && npm install

# Rebuild frontend
npm run build

# Restart backend
pm2 restart kazi-kitchen-backend

# Restart Nginx
sudo systemctl restart nginx
```

This completes the deployment guide. Your Kazi Kitchen application should now be running securely with proper authentication, location support, and food plan management.
