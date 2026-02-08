# ARCHITECTURE.md - System Architecture Documentation

## HPCL Lead Intelligence Platform

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                     │
│  Port 8080 | PWA | Tailwind CSS | Shadcn UI | React Query  │
├─────────────────────────────────────────────────────────────┤
│                         Vite Proxy                          │
│              /api → localhost:5000                           │
│              /socket.io → ws://localhost:5000                │
├─────────────────────────────────────────────────────────────┤
│                    SERVER (Express.js)                       │
│  Port 5000 | JWT Auth | Socket.io | REST API                │
├─────────────────────────────────────────────────────────────┤
│                    AI/ML SERVICES                            │
│  Inference Engine | Lead Scoring | Entity Resolution         │
├─────────────────────────────────────────────────────────────┤
│               BACKGROUND SERVICES                            │
│  Crawl Scheduler (node-cron) | Notification Service          │
├─────────────────────────────────────────────────────────────┤
│                    DATABASE (MongoDB)                         │
│  Collections: Users, Companies, Leads, Sources,              │
│               Notifications, Activities                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology            | Purpose                     |
| --------------------- | --------------------------- |
| React 18.3            | UI framework                |
| Vite 5.4              | Build tool & dev server     |
| Tailwind CSS 3        | Utility-first styling       |
| Shadcn/UI             | Component library           |
| @tanstack/react-query | Server state management     |
| React Router DOM 6    | Client-side routing         |
| Recharts              | Data visualization (charts) |
| Framer Motion         | Animations                  |
| Lucide React          | Icon library                |

### Backend

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Express.js 4.18    | HTTP server & REST API        |
| Mongoose 7.6       | MongoDB ODM                   |
| JWT (jsonwebtoken) | Authentication                |
| Socket.io 4.7      | Real-time notifications       |
| Cheerio 1.0        | HTML parsing for web scraping |
| node-cron 3        | Scheduled crawl jobs          |
| natural 6          | NLP text processing           |
| Twilio 4           | WhatsApp notifications        |
| Nodemailer 6       | Email notifications           |
| Helmet 7           | Security headers              |
| Morgan             | HTTP request logging          |
| express-rate-limit | API rate limiting             |

### Database

- **MongoDB** with Mongoose ODM
- 6 collections with indexed fields for query performance
- Text indexes on Lead.rawContent and Company.normalizedName

---

## Directory Structure

```
IITR-productathon/
├── client/                    # Frontend application
│   ├── public/
│   │   ├── manifest.json     # PWA manifest
│   │   ├── sw.js             # Service worker
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/    # Dashboard widgets
│   │   │   ├── layout/       # Header, Sidebar, Layout
│   │   │   ├── leads/        # LeadCard, LeadDossier
│   │   │   └── ui/           # Shadcn UI components
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── api.js        # API client module
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── Sources.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx           # Routes + Auth
│   │   └── main.jsx          # Entry point
│   └── index.html
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Company.js
│   │   │   ├── Lead.js
│   │   │   ├── Source.js
│   │   │   ├── Notification.js
│   │   │   └── Activity.js
│   │   ├── routes/           # Express routers
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── leads.js
│   │   │   ├── companies.js
│   │   │   ├── sources.js
│   │   │   ├── notifications.js
│   │   │   └── analytics.js
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   ├── services/
│   │   │   ├── scraperService.js
│   │   │   ├── inferenceEngine.js
│   │   │   ├── leadScoringService.js
│   │   │   ├── entityResolution.js
│   │   │   └── notificationService.js
│   │   ├── utils/
│   │   │   ├── seedData.js   # Database seeder
│   │   │   └── crawlScheduler.js
│   │   └── index.js          # Server entry point
│   └── package.json
│
├── MODEL_CARDS.md             # AI model documentation
├── ARCHITECTURE.md            # This file
└── README.md
```

---

## Data Models

### User

```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: "admin" | "manager" | "sales",
  territory: String,
  phone: String,
  isActive: Boolean
}
```

### Company

```javascript
{
  name: String,
  normalizedName: String (unique, indexed),
  industry: String,
  subIndustry: String,
  revenue: { amount: Number, currency: String },
  employeeCount: Number,
  cin: String,              // Company Identification Number
  gst: String,
  website: String,
  isCustomer: Boolean,
  customerType: "existing" | "prospect" | "churned",
  locations: [{ city, state, country }],
  productNeeds: [{ productCode, productName, estimatedVolume, unit, confidence }],
  contacts: [{ name, designation, email, phone }]
}
```

### Lead

```javascript
{
  title: String,
  company: ObjectId -> Company,
  companyName: String,       // Denormalized for quick access
  source: ObjectId -> Source,
  sourceUrl: String,
  rawContent: String (text indexed),
  inferredProducts: [{ productCode, productName, confidence }],
  score: Number (0-100),
  priority: "critical" | "high" | "medium" | "low",
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost",
  territory: String,
  assignedTo: ObjectId -> User,
  feedback: { rating, comment, givenBy, givenAt },
  estimatedValue: Number
}
```

### Source

```javascript
{
  name: String,
  url: String,
  type: "tender_portal" | "news" | "industry_report" | "corporate_website" | "government" | "trade_journal" | "social_media",
  isActive: Boolean,
  crawlSchedule: String,     // cron expression
  lastCrawled: Date,
  governance: {
    reliability: Number (0-1),
    totalLeadsGenerated: Number,
    lastCrawlStatus: String,
    avgLeadScore: Number
  }
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | /api/auth/register | Register new user  |
| POST   | /api/auth/login    | Login, returns JWT |
| GET    | /api/auth/me       | Get current user   |
| PUT    | /api/auth/profile  | Update profile     |
| PUT    | /api/auth/password | Change password    |

### Dashboard

| Method | Endpoint       | Description                      |
| ------ | -------------- | -------------------------------- |
| GET    | /api/dashboard | Aggregated stats, charts, trends |

### Leads

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | /api/leads              | List leads (filter, sort, paginate) |
| GET    | /api/leads/:id          | Get lead detail                     |
| POST   | /api/leads              | Create lead                         |
| PUT    | /api/leads/:id          | Update lead                         |
| PUT    | /api/leads/:id/assign   | Assign lead to user                 |
| PUT    | /api/leads/:id/feedback | Submit feedback                     |
| DELETE | /api/leads/:id          | Delete lead                         |

### Companies

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | /api/companies     | List companies     |
| GET    | /api/companies/:id | Get company detail |
| POST   | /api/companies     | Create company     |
| PUT    | /api/companies/:id | Update company     |
| DELETE | /api/companies/:id | Delete company     |

### Sources

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | /api/sources           | List sources         |
| POST   | /api/sources           | Create source        |
| PUT    | /api/sources/:id       | Update source        |
| POST   | /api/sources/:id/crawl | Trigger manual crawl |
| DELETE | /api/sources/:id       | Delete source        |

### Notifications

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| GET    | /api/notifications          | List notifications  |
| PUT    | /api/notifications/:id/read | Mark as read        |
| PUT    | /api/notifications/read-all | Mark all as read    |
| DELETE | /api/notifications/:id      | Delete notification |

### Analytics

| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| GET    | /api/analytics?period=30d | Analytics data |

---

## Data Flow

### Lead Generation Pipeline

```
1. Crawl Scheduler (node-cron)
   │
   ├── Triggers ScraperService for each active Source
   │   ├── Fetches URL content (axios + cheerio)
   │   └── Extracts text content
   │
   ├── Entity Resolution
   │   ├── Normalizes company name
   │   ├── Fuzzy matches against existing companies
   │   └── Creates or updates Company record
   │
   ├── Inference Engine
   │   ├── Scans content for product keywords
   │   └── Returns [{ productCode, productName, confidence }]
   │
   ├── Lead Scoring Service
   │   ├── Evaluates 5 dimensions
   │   └── Returns score (0-100) + priority
   │
   ├── Creates Lead record in MongoDB
   │
   └── Notification Service
       ├── Creates in-app notification
       ├── Sends WhatsApp via Twilio (high priority)
       └── Emits Socket.io event for real-time update
```

### Authentication Flow

```
1. User submits credentials (Login page)
2. Server validates against bcrypt hash
3. Server issues JWT (24h expiry)
4. Client stores token in localStorage
5. All API requests include Bearer token
6. Middleware validates token on protected routes
7. On 401, client clears token and redirects to /login
```

---

## Deployment Guide

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or bun

### Environment Variables (server/.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leadintel
JWT_SECRET=your-secret-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-app-password
```

### Quick Start

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install   # or use root package.json

# 2. Set up environment
cp server/.env.example server/.env
# Edit server/.env with your credentials

# 3. Seed database
cd server && npm run seed

# 4. Start development
cd server && npm run dev      # Terminal 1 - API server on :5000
cd client && npm run dev      # Terminal 2 - Vite dev server on :8080

# 5. Login with demo credentials
# admin@leadintel.com / admin123
# sales@leadintel.com / sales123
# manager@leadintel.com / manager123
```

### Production Build

```bash
# Build client
cd client && npm run build

# Serve built files from Express (configure static middleware)
# Or deploy client to Vercel/Netlify and server to Railway/Render
```

---

## Security Measures

1. **Helmet.js**: Sets security HTTP headers
2. **Rate Limiting**: 100 requests per 15 minutes per IP
3. **JWT Authentication**: 24-hour token expiry, bcrypt password hashing
4. **CORS**: Configured for allowed origins
5. **Input Validation**: Mongoose schema validation
6. **XSS Prevention**: React's built-in escaping + Helmet CSP headers

---

## PWA Capabilities

- **Manifest**: App name, icons, theme color, display mode
- **Service Worker**: Caches static assets for offline shell
- **Installable**: Add to home screen on mobile
- **Push Notifications**: Via service worker (configurable)
