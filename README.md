# 🚀 IntelliLead Hub

<div align="center">

**AI-Powered B2B Lead Intelligence Platform for HPCL Direct Sales**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-darkgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Overview

IntelliLead Hub is an intelligent B2B lead generation and management platform designed for **HPCL (Hindustan Petroleum Corporation Limited) Direct Sales**. It automates lead discovery from multiple sources, scores leads using AI/ML algorithms, and provides actionable insights for sales teams.

### Key Capabilities

- **🤖 Automated Lead Discovery**: Web scraping from tender portals, news sites, and industry reports
- **🧠 AI-Powered Lead Scoring**: Multi-dimensional scoring algorithm (0-100 scale)
- **🎯 Product Need Inference**: NLP-based product extraction from raw content
- **🏢 Entity Resolution**: Fuzzy matching to deduplicate companies
- **📊 Real-time Dashboard**: Live analytics with charts and territory heatmaps
- **🔔 Smart Notifications**: WhatsApp, Email, SMS, and in-app alerts
- **📱 PWA Ready**: Installable progressive web app with offline support

---

## ✨ Features

### For Sales Teams
- 📈 **Real-time Lead Dashboard**: Monitor new leads, conversion rates, and pipeline health
- 🔍 **Advanced Filtering**: Search and filter leads by territory, status, priority, score
- 👤 **Lead Assignment**: Automatically or manually assign leads to sales representatives
- 📝 **Lead Dossier**: Complete company profile with contact details and product needs
- ⭐ **Feedback System**: Rate lead quality to improve scoring algorithm

### For Managers
- 📊 **Analytics & Reporting**: Territory-wise performance, product-wise lead distribution
- 🗺️ **Territory Heatmap**: Geographic visualization of lead density
- 👥 **Team Management**: User roles (Admin, Manager, Sales Officer)
- 📅 **Activity Timeline**: Track all lead interactions and status changes

### For Admins
- 🌐 **Source Management**: Configure and schedule web scraping sources
- ⚙️ **System Configuration**: Manage crawl schedules, notification settings
- 🔐 **User Administration**: Create users, assign territories, manage permissions
- 📦 **Data Governance**: Monitor source reliability and lead quality metrics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                CLIENT (React + Vite + PWA)                   │
│  Port 8080 | Tailwind CSS | Shadcn UI | React Query        │
├─────────────────────────────────────────────────────────────┤
│                    Vite Proxy + CORS                        │
│              /api → localhost:5000                           │
├─────────────────────────────────────────────────────────────┤
│              SERVER (Node.js + Express)                      │
│  Port 5000 | JWT Auth | Socket.io | REST API                │
├─────────────────────────────────────────────────────────────┤
│                   AI/ML SERVICES                             │
│  Inference Engine | Lead Scoring | Entity Resolution        │
├─────────────────────────────────────────────────────────────┤
│              BACKGROUND SERVICES                             │
│  Cron Scheduler | Web Scraper | Notification Service        │
├─────────────────────────────────────────────────────────────┤
│                  DATABASE (MongoDB)                          │
│  Users | Companies | Leads | Sources | Notifications        │
└─────────────────────────────────────────────────────────────┘
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system design.

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - UI library
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Shadcn/UI** - Component library
- **TanStack React Query** - Server state management
- **React Router DOM 6** - Client-side routing
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time updates

### Backend
- **Express.js 4.18** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication
- **Socket.io 4.7** - WebSocket server
- **Node-cron** - Job scheduling
- **Cheerio** - Web scraping
- **Natural** - NLP processing
- **Twilio** - WhatsApp/SMS notifications
- **Nodemailer** - Email notifications
- **Winston** - Logging
- **Swagger** - API documentation
- **Joi** - Input validation

### DevOps
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **PM2** - Process management
- **Nginx** - Reverse proxy (production)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6+ ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **bun** package manager

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/intellilead-hub.git
cd intellilead-hub

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install

# 4. Set up environment variables
cd ../server
cp .env.example .env
# Edit .env with your configuration (MongoDB URI, JWT secret, etc.)

# 5. Seed the database (optional - adds demo data)
npm run seed
```

### Development Mode

```bash
# Terminal 1 - Start backend server
cd server
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 - Start frontend dev server
cd client
npm run dev
# Client runs on http://localhost:8080
```

### Access the Application

- **Frontend**: http://localhost:8080
- **API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/health

### Demo Credentials (after seeding)

```
Admin:     admin@leadintel.com / admin123
Manager:   manager@leadintel.com / manager123
Sales:     sales@leadintel.com / sales123
```

---

## 🐳 Docker Quick Start

```bash
# Start all services (MongoDB, Redis, Application)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Production build
docker-compose -f docker-compose.yml up -d
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture, data models, and API endpoints |
| [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) | Comprehensive deployment guide for all platforms |
| [PRODUCTION_IMPROVEMENTS.md](PRODUCTION_IMPROVEMENTS.md) | Summary of production-ready enhancements |
| [MODEL_CARDS.md](MODEL_CARDS.md) | AI/ML model documentation and specifications |
| [DEPLOYMENT_COST.md](DEPLOYMENT_COST.md) | Infrastructure cost estimates |

---

## 🔌 API Documentation

Interactive API documentation is available via Swagger UI:

**Development**: http://localhost:5000/api-docs  
**Production**: https://api.yourdomain.com/api-docs

### Key API Endpoints

```
Health & Monitoring
GET  /api/health              # Basic health check
GET  /api/health/detailed     # Detailed system info
GET  /api/ready               # Readiness probe
GET  /api/live                # Liveness probe

Lead Management
GET    /api/leads             # List all leads
POST   /api/leads             # Create new lead
GET    /api/leads/:id         # Get lead details
PUT    /api/leads/:id         # Update lead
DELETE /api/leads/:id         # Delete lead
PUT    /api/leads/:id/assign  # Assign lead to user

Company Management
GET    /api/companies         # List companies
POST   /api/companies         # Create company
GET    /api/companies/:id     # Get company details
PUT    /api/companies/:id     # Update company

Source Management
GET    /api/sources           # List sources
POST   /api/sources           # Add new source
POST   /api/sources/:id/crawl # Trigger manual crawl

Analytics & Dashboard
GET    /api/dashboard         # Dashboard statistics
GET    /api/analytics         # Analytics data
GET    /api/notifications     # User notifications
```

---

## 🚀 Deployment

### Option 1: Docker (Recommended)

```bash
# Build and deploy with Docker Compose
docker-compose up -d

# Scale application instances
docker-compose up -d --scale app=3
```

### Option 2: Cloud Platforms

<details>
<summary><b>Deploy to Railway.app</b></summary>

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Configuration files included: `railway.json`
</details>

<details>
<summary><b>Deploy to Render.com</b></summary>

1. Connect GitHub repository
2. Configure using `render.yaml`
3. Add MongoDB service
4. Deploy automatically

Configuration files included: `render.yaml`
</details>

<details>
<summary><b>Deploy to Vercel (Frontend) + Railway (Backend)</b></summary>

```bash
# Deploy frontend
cd client
vercel --prod

# Deploy backend separately (Railway, Render, etc.)
```

Configuration files included: `client/vercel.json`, `netlify.toml`
</details>

### Option 3: VPS/Traditional Server

See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for complete VPS deployment guide with:
- Ubuntu server setup
- PM2 process management
- Nginx reverse proxy
- SSL certificate setup
- Database configuration

---

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests (when implemented)
cd server
npm test

# Run specific test file
npm test api.test.js
```

---

## 📦 Project Structure

```
intellilead-hub/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── dashboard/    # Dashboard widgets
│   │   │   ├── layout/       # Layout components
│   │   │   ├── leads/        # Lead components
│   │   │   └── ui/           # Shadcn UI components
│   │   ├── pages/            # Page components
│   │   ├── lib/              # Utilities and API client
│   │   ├── hooks/            # Custom React hooks
│   │   └── contexts/         # React contexts
│   ├── public/               # Static assets
│   └── vite.config.js        # Vite configuration
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # Express routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # Business logic
│   │   │   ├── scraper.js
│   │   │   ├── inferenceEngine.js
│   │   │   ├── leadScoring.js
│   │   │   └── entityResolution.js
│   │   ├── jobs/             # Cron jobs
│   │   ├── scripts/          # Utility scripts
│   │   └── utils/            # Helper functions
│   └── package.json
│
├── .github/                   # GitHub Actions workflows
├── docker-compose.yml         # Docker Compose config
├── Dockerfile                 # Docker build file
└── Documentation files
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Helmet.js security headers
- ✅ Rate limiting (200 req/15min)
- ✅ NoSQL injection protection
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ Input validation (Joi)
- ✅ Request sanitization
- ✅ Secure password hashing (bcrypt)

---

## 📊 Lead Scoring Algorithm

The AI-powered lead scoring system evaluates leads across 5 dimensions:

1. **Company Fit (25%)**: Industry alignment, company size, financial capacity
2. **Signal Strength (25%)**: Source reliability, keyword confidence
3. **Urgency (20%)**: Tender deadlines, expansion signals
4. **Volume Potential (15%)**: Estimated deal size
5. **Geographic Fit (15%)**: Proximity to HPCL territories

**Output**: Score (0-100) + Priority (Critical/High/Medium/Low) + Explanation

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep code clean and well-commented

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **HPCL Direct Sales Team** - Domain expertise and requirements
- **IITR Productathon** - Platform for innovation
- **Open Source Community** - Amazing tools and libraries

---

## 📞 Support

For issues, questions, or contributions:

- 🐛 [Report a Bug](https://github.com/yourusername/intellilead-hub/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/yourusername/intellilead-hub/issues/new?template=feature_request.md)
- 📧 Email: support@intellilead.com

---

<div align="center">

**Built with ❤️ for B2B Sales Intelligence**

⭐ Star this repo if you find it useful!

</div>
