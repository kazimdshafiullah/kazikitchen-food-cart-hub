
# Kazi Kitchen - Complete Deployment Guide

This guide will walk you through setting up Kazi Kitchen with proper database authentication on a VM from scratch.

## Prerequisites

- Ubuntu 20.04 or later VM
- Sudo access
- Domain name (optional, for SSL)

## Step 1: Initial Server Setup

### Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

### Install required packages
```bash
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw
```

### Install Node.js (v18 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## Step 2: PostgreSQL Database Setup

### Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```

### Start and enable PostgreSQL
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create database and user
```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE kazi_kitchen;
CREATE USER kazi_admin WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE kazi_kitchen TO kazi_admin;
\q
```

### Run the authentication schema
```bash
# Connect to the database
sudo -u postgres psql -d kazi_kitchen

# Copy and paste the entire SQL schema from the migration:
```

```sql
-- Create users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'kitchen', 'rider')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for session management
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);

-- Insert default users (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@kazikitchen.com', '$2b$10$rOLpvGxp7gGVJyA8YM9Jh.yX8K5kKqv8Z4FLbKJAKJTpqVN0GrJXi', 'admin'),
('kitchen', 'kitchen@kazikitchen.com', '$2b$10$rOLpvGxp7gGVJyA8YM9Jh.yX8K5kKqv8Z4FLbKJAKJTpqVN0GrJXi', 'kitchen'),
('rider', 'rider@kazikitchen.com', '$2b$10$rOLpvGxp7gGVJyA8YM9Jh.yX8K5kKqv8Z4FLbKJAKJTpqVN0GrJXi', 'rider');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Exit PostgreSQL: `\q`

## Step 3: Application Deployment

### Create application directory
```bash
sudo mkdir -p /var/www/kazi-kitchen
sudo chown $USER:$USER /var/www/kazi-kitchen
cd /var/www/kazi-kitchen
```

### Clone or upload your application
```bash
# If using git:
git clone <your-repo-url> .

# Or upload your files via SCP/SFTP to this directory
```

### Set up Backend

#### Navigate to backend directory and install dependencies
```bash
cd /var/www/kazi-kitchen/backend
npm install
```

#### Create environment file
```bash
cp .env.example .env
nano .env
```

#### Configure the .env file:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kazi_kitchen
DB_USER=kazi_admin
DB_PASSWORD=your_secure_password_here

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://your-domain.com
```

#### Start backend with PM2
```bash
pm2 start server.js --name "kazi-kitchen-api"
pm2 save
pm2 startup
```

### Set up Frontend

#### Navigate to frontend directory
```bash
cd /var/www/kazi-kitchen
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
```bash
cp .env.example .env
nano .env
```

#### Configure frontend environment:
```bash
VITE_API_URL=http://your-domain.com:3001
```

#### Build the application
```bash
npm run build
```

## Step 4: Nginx Configuration

### Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/kazi-kitchen
```

#### Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/kazi-kitchen/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src * data: 'unsafe-eval' 'unsafe-inline'" always;
}
```

#### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/kazi-kitchen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Firewall Configuration

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 6: SSL Certificate (Optional but Recommended)

### If you have a domain name:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 7: Database Backup Setup (Optional)

### Create backup script
```bash
sudo nano /usr/local/bin/backup-kazi-kitchen.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/kazi-kitchen"
mkdir -p $BACKUP_DIR

# Database backup
sudo -u postgres pg_dump kazi_kitchen > $BACKUP_DIR/kazi_kitchen_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/backup-kazi-kitchen.sh

# Add to crontab (daily backup at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-kazi-kitchen.sh") | crontab -
```

## Step 8: Monitoring and Logs

### View application logs
```bash
# Backend logs
pm2 logs kazi-kitchen-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Monitor processes
```bash
pm2 status
pm2 monit
```

## Step 9: Application Access

### Login Credentials (Change Immediately!)

**Admin Panel**: `http://your-domain.com/admin/login`
- Username: `admin`
- Password: `admin123`

**Kitchen Panel**: `http://your-domain.com/kitchen/login`
- Username: `kitchen`
- Password: `admin123`

**Rider Panel**: `http://your-domain.com/rider/login`
- Username: `rider`
- Password: `admin123`

## Step 10: Security Hardening

### Change default passwords immediately
Use the admin panel to create new users and disable default accounts.

### Update JWT secret
Generate a strong JWT secret and update in `.env`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Regular updates
```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Application updates
cd /var/www/kazi-kitchen
git pull  # if using git
npm install
npm run build
pm2 restart kazi-kitchen-api
```

## Troubleshooting

### Common Issues:

1. **Backend not starting**:
   ```bash
   pm2 logs kazi-kitchen-api
   # Check database connection and environment variables
   ```

2. **Database connection errors**:
   ```bash
   sudo systemctl status postgresql
   sudo -u postgres psql -d kazi_kitchen -c "SELECT version();"
   ```

3. **Frontend not loading**:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **API calls failing**:
   - Check CORS settings in backend
   - Verify VITE_API_URL in frontend .env
   - Check firewall rules

### Useful Commands:

```bash
# Restart services
sudo systemctl restart nginx
pm2 restart kazi-kitchen-api

# Check service status
sudo systemctl status nginx postgresql
pm2 status

# View resource usage
htop
df -h
free -m
```

## Production Checklist

- [ ] Changed all default passwords
- [ ] Generated strong JWT secret
- [ ] Set up SSL certificate
- [ ] Configured automated backups
- [ ] Set up monitoring
- [ ] Updated firewall rules
- [ ] Tested all login portals
- [ ] Verified database connection
- [ ] Tested API endpoints
- [ ] Set up log rotation

Your Kazi Kitchen application should now be fully deployed with proper database authentication!
