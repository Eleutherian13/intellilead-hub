# IntelliLead Hub — Deployment Cost Estimate & Feasibility

## 1. Infrastructure Cost (Monthly)

### Option A: Cloud (AWS / Azure) — Recommended for Production

| Component                  | Specification                        | Estimated Cost (₹/month) |
| -------------------------- | ------------------------------------ | ------------------------ |
| **App Server (EC2/VM)**    | t3.medium (2 vCPU, 4 GB RAM)        | ₹3,500                  |
| **MongoDB Atlas**          | M10 Shared Cluster (10 GB)           | ₹4,200                  |
| **Redis Cache (Optional)** | cache.t3.micro                       | ₹1,200                  |
| **S3 / Blob Storage**      | 50 GB for crawled data + backups     | ₹200                    |
| **CDN (CloudFront)**       | PWA static assets (< 50 GB transfer) | ₹500                    |
| **SSL Certificate**        | Let's Encrypt (free) or ACM          | ₹0                      |
| **Domain Name**            | .in or .com                          | ₹100                    |
| **Monitoring (CloudWatch)**| Basic metrics + alarms               | ₹500                    |
| **Total (Option A)**       |                                      | **₹10,200/month**       |

### Option B: HPCL Internal Data Center

| Component                  | Specification                       | Estimated Cost (₹/month) |
| -------------------------- | ----------------------------------- | ------------------------ |
| **VM / Container Host**    | 4 vCPU, 8 GB RAM Docker host        | ₹0 (existing infra)     |
| **MongoDB (self-hosted)**  | Docker / bare-metal on-prem         | ₹0                      |
| **Network / Firewall**     | Internal network, VPN access         | ₹0                      |
| **SSL (Internal CA)**      | HPCL internal certificate            | ₹0                      |
| **Total (Option B)**       |                                      | **₹0 (sunk cost)**      |

### Option C: Starter / Demo (Render / Railway / Vercel)

| Component               | Specification   | Estimated Cost (₹/month) |
| ------------------------ | --------------- | ------------------------ |
| **Backend (Render)**     | Starter plan    | ₹0 (free tier)          |
| **Frontend (Vercel)**    | Hobby plan      | ₹0 (free tier)          |
| **MongoDB Atlas**        | M0 Free Cluster | ₹0                      |
| **Total (Option C)**     |                 | **₹0**                  |

> **Note:** Option C is suitable for hackathon demos and PoC; not for production workloads.

---

## 2. Third-Party Service Costs

| Service                     | Purpose                         | Cost                          |
| --------------------------- | ------------------------------- | ----------------------------- |
| **Twilio WhatsApp Sandbox** | WhatsApp Business notifications | Free (sandbox); ₹0.50/msg (prod) |
| **Twilio SMS**              | SMS fallback channel            | ₹0.30/msg                    |
| **SendGrid / Gmail SMTP**   | Email notifications             | Free up to 100/day           |
| **Web Push (VAPID)**        | PWA push notifications          | Free (self-hosted)           |
| **MS Teams Webhook**        | Teams channel alerts            | Free (included with M365)    |

### Estimated Notification Cost (500 leads/month, 3 users):

| Channel   | Volume       | Monthly Cost |
| --------- | ------------ | ------------ |
| WhatsApp  | 500 alerts   | ₹250         |
| SMS       | 100 fallback | ₹30          |
| Email     | 500 alerts   | ₹0           |
| Push      | 500 alerts   | ₹0           |
| **Total** |              | **₹280**     |

---

## 3. Development & Maintenance Cost

| Activity                          | Effort         | One-Time Cost | Recurring    |
| --------------------------------- | -------------- | ------------- | ------------ |
| Initial Development (done)        | 8 person-weeks | ₹0 (IIT team) | —            |
| Twilio Production Setup           | 2 hours        | ₹2,000        | —            |
| MongoDB Atlas Migration           | 4 hours        | ₹0            | —            |
| Security Audit & Hardening        | 1 week         | ₹50,000       | ₹25,000/yr   |
| Ongoing Maintenance & Bug Fixes   | 4 hrs/month    | —             | ₹15,000/month|
| Source Configuration & Tuning     | 2 hrs/month    | —             | ₹5,000/month |

---

## 4. Total Cost of Ownership (Year 1)

| Line Item                      | Annual Cost   |
| ------------------------------ | ------------- |
| Cloud Infrastructure (Option A)| ₹1,22,400     |
| Third-Party Services           | ₹3,360        |
| Security Audit                 | ₹50,000       |
| Ongoing Maintenance            | ₹1,80,000     |
| Source Tuning                  | ₹60,000       |
| **Total Year 1**               | **₹4,15,760** |

### With Internal Hosting (Option B):

| Line Item                      | Annual Cost   |
| ------------------------------ | ------------- |
| Infrastructure                 | ₹0            |
| Third-Party Services           | ₹3,360        |
| Security + Maintenance         | ₹2,90,000     |
| **Total Year 1**               | **₹2,93,360** |

---

## 5. Scalability Projections

| Scale               | Users | Leads/Month | Infrastructure       | Monthly Cost |
| -------------------- | ----- | ----------- | -------------------- | ------------ |
| **Pilot (Current)**  | 3-5   | 500         | t3.medium + M10      | ₹10,500      |
| **Regional Rollout** | 20-50 | 5,000       | t3.large + M20       | ₹25,000      |
| **National Scale**   | 200+  | 50,000      | ECS Cluster + M30    | ₹75,000      |

---

## 6. ROI Justification

| Metric                         | Without LeadIntel | With LeadIntel | Improvement |
| ------------------------------ | ----------------- | -------------- | ----------- |
| Lead Discovery Time            | 3-5 days          | Real-time      | **90%↓**    |
| Manual Research per Lead       | 2-4 hours         | 5 minutes      | **95%↓**    |
| Lead Conversion Rate           | 5-8%              | 15-20%         | **2-3x↑**  |
| Missed Tender Opportunities    | 40-60%            | < 5%           | **90%↓**    |
| Sales Officer Productivity     | 10 leads/week     | 50 leads/week  | **5x↑**    |

### Estimated Annual Value Created:
- 500 additional qualified leads × 15% conversion × ₹20L avg deal = **₹15 Cr revenue impact**
- Platform cost: < ₹5L/year → **ROI > 300x**

---

## 7. Deployment Timeline

| Phase                 | Duration  | Milestone                           |
| --------------------- | --------- | ----------------------------------- |
| **Phase 1: PoC**      | Week 1-2  | Demo with seed data, internal test  |
| **Phase 2: Pilot**    | Week 3-6  | 3-5 DSROs, real sources configured  |
| **Phase 3: Regional** | Month 2-3 | Western region rollout, 20 users    |
| **Phase 4: National** | Month 4-6 | All India, 200+ users, full sources |

---

## 8. Technology Stack Cost Summary

All core technologies are **open-source / free**:
- React, Vite, Tailwind CSS, Shadcn/UI — MIT License
- Express.js, Mongoose, Socket.io — MIT License
- Cheerio, RSS-Parser, Natural NLP — MIT/ISC License
- MongoDB Community — SSPL (free for self-hosting)
- Node.js — MIT License

**Zero licensing cost** for the entire software stack.
