# WorkNear — Hyperlocal Job Marketplace (MVP)

> **WorkNear** connects informal, part-time, and entry-level workers (cafe staff, kitchen helpers, retail assistants, delivery riders, event crew) with local micro-businesses within walking/short-distance radius in **Hyderabad**.

---

## ⚡ Core Philosophy & MVP Guardrails

1. **No Resumes, No Friction:** A worker's mobile number, locality, and availability tags serve as their digital identity. 1-tap applications.
2. **Direct Telephony & WhatsApp Rails:** We intentionally omitted in-app chat. When an employer shortlists a candidate, native `tel:` and `https://wa.me/` direct contact links unlock instantly.
3. **No Middleman Payment Liabilities:** Wages are settled directly on-site between worker and employer (Cash/UPI).
4. **Target Launch Market:** Hyderabad (Madhapur, Gachibowli, Ameerpet, Kukatpally, Banjara Hills, Jubilee Hills, Hitec City, Secunderabad, etc.).

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v7, Axios, Lucide React
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, bcryptjs, Helmet, Express Rate Limit
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **MongoDB Atlas** cluster connection URI (or local MongoDB on port 27017)

### 2. Environment Setup
In `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/worknear?retryWrites=true&w=majority
JWT_SECRET=worknear_super_secure_jwt_secret_key_2026_hyderabad
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

In `client/.env` (Optional for production, Vite proxies `/api` to port 5000 in dev):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Seed Hyderabad Test Data
Populate realistic Hyderabad jobs, employers, workers, and sample applications:
```bash
npm run seed
```

### 4. Run Development Servers
In one terminal, start the Express backend:
```bash
npm run server
# or cd server && npm run dev
```

In another terminal, start the React frontend:
```bash
npm run client
# or cd client && npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 👥 Pre-Seeded Test Accounts

Password for all pre-seeded accounts: **`password123`**

| Role | Name | Phone Number | Area / Business |
| :--- | :--- | :--- | :--- |
| **Worker 1** | Kiran Kumar | `+919876511111` | Madhapur (Cafe Waiter / Counter Service) |
| **Worker 2** | Mohammad Ali | `+919876522222` | Gachibowli (Delivery Rider / Courier) |
| **Worker 3** | Sunita Bai | `+919876533333` | Kukatpally (Retail Helper / Stocker) |
| **Employer 1** | Ravi Teja | `+919876500001` | Chai & Bites Cafe, Madhapur |
| **Employer 2** | Pooja Reddy | `+919876500002` | Spice Heritage Restaurant, Banjara Hills |
| **Employer 3** | Suresh Varma | `+919876500003` | Kukatpally Daily Mart, Kukatpally |
| **Admin** | Admin | `+919000000000` | Platform Moderator |

*(Note: In the Login page, click the **Autofill** button under "Quick Test Credentials" to instantly populate these credentials).*

---

## 📁 Repository Structure

```
worknear/
├── client/                     # React + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── components/         # JobCard, JobFilterBar, ApplicantCard, Navbar, Modal
│   │   ├── context/            # AuthContext (JWT session), ToastContext
│   │   ├── pages/              # Home, JobFeed, JobDetails, Login, Register, Dashboards
│   │   ├── routes/             # AppRoutes, ProtectedRoute (Role-based)
│   │   ├── services/           # apiClient (Axios interceptor), jobService, authService
│   │   └── utils/              # Hyderabad localities, categories, constants
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection (db.js)
│   │   ├── controllers/        # auth, job, application, profile, admin
│   │   ├── middlewares/        # authenticateJWT, authorizeRoles, errorHandler, rateLimiter
│   │   ├── models/             # User, WorkerProfile, EmployerProfile, Job, Application
│   │   ├── routes/             # auth, job, application, profile, admin
│   │   ├── seeds/              # seedHyderabad.js (Realistic test dataset)
│   │   └── utils/              # AppError, ApiResponse, asyncHandler
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚢 Production Deployment

### Backend on Render (Web Service)
1. Push repo to GitHub.
2. In Render dashboard, create **New Web Service**.
3. Set **Root Directory** to `server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Secure Random String>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `NODE_ENV`: `production`

### Frontend on Vercel
1. In Vercel dashboard, create **New Project** and select your GitHub repo.
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api/v1`
