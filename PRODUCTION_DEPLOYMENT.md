# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Create `.env` file from `.env.example`
- [ ] Set secure `JWT_SECRET` (min 32 characters)
- [ ] Configure production `MONGODB_URI` (MongoDB Atlas or self-hosted)
- [ ] Set up Twilio credentials for WhatsApp/SMS
- [ ] Configure SMTP for email notifications
- [ ] Set `CORS_ORIGIN` to your frontend domain
- [ ] Set `NODE_ENV=production`
- [ ] Review all environment variables

### 2. Database Setup
- [ ] Create production MongoDB database
- [ ] Set up database user with appropriate permissions
- [ ] Configure IP whitelist (if using MongoDB Atlas)
- [ ] Run database migration/seeding: `npm run seed`
- [ ] Set up automated backups (daily recommended)
- [ ] Test backup and restore scripts

### 3. Security Configuration
- [ ] Change all default passwords and secrets
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up rate limiting per endpoint
- [ ] Review CORS configuration
- [ ] Enable MongoDB authentication
- [ ] Scan for vulnerabilities: `npm audit`

### 4. Monitoring & Logging
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure log aggregation service
- [ ] Set up uptime monitoring
- [ ] Configure alerting for critical errors
- [ ] Set up performance monitoring
- [ ] Configure health check monitoring

### 5. Performance Optimization
- [ ] Build client for production: `cd client && npm run build`
- [ ] Enable gzip compression (✅ already configured)
- [ ] Set up CDN for static assets
- [ ] Configure Redis caching (optional)
- [ ] Optimize database indexes
- [ ] Review and optimize slow queries

### 6. Testing
- [ ] Run all tests: `npm test`
- [ ] Test API endpoints manually or with Postman
- [ ] Load test with expected traffic (use k6, Artillery, or JMeter)
- [ ] Test error scenarios and recovery
- [ ] Test database backup and restore
- [ ] Test graceful shutdown

---

## Deployment Options

### Option A: Docker Deployment (Recommended)

#### Single Command Deployment
```bash
# 1. Clone repository
git clone <your-repo-url>
cd intellilead-hub

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env with production values

# 3. Build and start
docker-compose up -d

# 4. Check logs
docker-compose logs -f app

# 5. Run database seed
docker-compose exec app npm run seed
```

#### Scaling with Docker Compose
```bash
# Scale application instances
docker-compose up -d --scale app=3

# Use nginx load balancer (see docker-compose.yml)
```

---

### Option B: Cloud Platform Deployment

#### Railway.app
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add MongoDB service
railway add mongodb

# 5. Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=<your-secret>
# ... set all other variables

# 6. Deploy
railway up
```

#### Render.com
1. Connect your GitHub repository
2. Create "Web Service" for backend
3. Create "Static Site" for frontend
4. Add MongoDB from "Add-ons"
5. Configure environment variables in dashboard
6. Deploy automatically on push

#### Vercel (Frontend Only)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd client
vercel --prod

# Deploy backend separately (Railway, Render, etc.)
```

---

### Option C: Traditional VPS/Server Deployment

#### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- MongoDB 6+
- Nginx (for reverse proxy)
- PM2 (for process management)

#### Step-by-Step Deployment

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install MongoDB
# Follow: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

# 4. Install PM2
sudo npm install -g pm2

# 5. Clone repository
git clone <your-repo-url>
cd intellilead-hub

# 6. Install dependencies
cd server && npm install --production
cd ../client && npm install

# 7. Build client
npm run build

# 8. Configure environment
cp server/.env.example server/.env
nano server/.env  # Edit with production values

# 9. Start with PM2
cd server
pm2 start src/index.js --name intellilead-api
pm2 startup  # Configure PM2 to start on boot
pm2 save

# 10. Set up Nginx reverse proxy
sudo nano /etc/nginx/sites-available/intellilead
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/intellilead/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/intellilead /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## Post-Deployment Tasks

### 1. Verify Deployment
```bash
# Check API health
curl https://api.yourdomain.com/api/health

# Check Swagger docs
curl https://api.yourdomain.com/api-docs

# Test frontend
curl https://yourdomain.com
```

### 2. Set Up Monitoring
```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs intellilead-api

# Check status
pm2 status
```

### 3. Set Up Automated Backups
```bash
# Create cron job for daily backups
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /path/to/intellilead-hub/server && npm run backup

# Test backup manually
npm run backup
```

### 4. Configure Log Rotation
```bash
# Create logrotate config
sudo nano /etc/logrotate.d/intellilead

# Add configuration:
/path/to/intellilead-hub/server/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reload intellilead-api > /dev/null
    endscript
}
```

---

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Install dependencies
cd server && npm install --production
cd ../client && npm install && npm run build

# Restart application
pm2 restart intellilead-api
```

### Database Backup
```bash
# Manual backup
npm run backup

# Restore from backup
npm run restore backups/backup-2026-02-13T10-30-00-000Z.tar.gz
```

### View Logs
```bash
# PM2 logs
pm2 logs intellilead-api --lines 100

# Application logs
tail -f logs/combined.log
tail -f logs/error.log
```

### Monitor Resources
```bash
# Check PM2 metrics
pm2 monit

# Check system resources
htop
df -h
free -m
```

---

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs intellilead-api --err

# Check environment variables
pm2 env 0

# Restart
pm2 restart intellilead-api
```

### Database connection issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string in .env
cat server/.env | grep MONGODB_URI

# Test connection
mongosh "<your-connection-string>"
```

### High memory usage
```bash
# Check process memory
pm2 monit

# Restart application
pm2 restart intellilead-api

# Consider adding Redis caching
```

---

## Support & Resources

- **Documentation**: `/api-docs` (Swagger UI)
- **Health Check**: `/api/health`
- **Logs Location**: `server/logs/`
- **Backups Location**: `server/backups/`

For issues, check:
1. Application logs: `pm2 logs`
2. Error logs: `logs/error.log`
3. Nginx logs: `/var/log/nginx/error.log`
4. MongoDB logs: `/var/log/mongodb/mongod.log`
