# 🟣 Purple Mint — User Management System

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20OTP-F59E0B?style=flat-square&logo=jsonwebtokens&logoColor=white)

A **production-grade**, full-stack User Management System built on the **MERN stack**. Features a premium glassmorphism UI, enterprise-grade security, and a comprehensive Role-Based Access Control (RBAC) system.

---

## ✨ Features

### 🔐 Authentication & Security
- **Dual Authentication** — Password login and OTP-based login via email
- **JWT Tokens** — Stateless, secure session management
- **bcryptjs** — Passwords hashed with 10 salt rounds
- **Helmet.js** — Sets 11 production HTTP security headers automatically
- **Rate Limiting** — 100 req/15min globally; stricter 10 req/15min on auth endpoints
- **Input Validation** — Server-side validation via `express-validator` on all routes
- **Auto-logout** — Frontend detects 401 and clears session automatically

### 👥 User Management (Admin)
- Full CRUD — Create, Read, Update, Delete users
- Role assignment — `admin`, `moderator`, `user`
- Account activation/deactivation
- Server-side pagination and real-time search
- Filter by role and status
- **Export to CSV** — One-click download of all user data
- Audit tracking — `createdBy` and `updatedBy` fields on every record

### 📊 Dashboard (Admin)
- Live statistics: total users, active accounts, admins, moderators
- Monthly new user trend — **Recharts area chart** (last 6 months)
- System info panel (tech stack, security config)

### 👤 User Profile
- Self-service name and password update
- Password strength indicator with per-rule validation feedback
- Role and account status display

### 🎨 Premium UI/UX
- Dark glassmorphism design with subtle noise texture
- Gradient avatar initials (no image required)
- Custom toast notification system (replaces browser alerts)
- Custom confirmation modal (replaces `window.confirm`)
- Skeleton loaders for all async states
- Badge system for roles and statuses
- Collapsible sidebar with smooth animation
- Responsive layout

---

## 🏗️ Architecture

```
Purple Mint Project/
├── backend/                        # Express REST API
│   ├── config/db.js               # MongoDB Atlas connection
│   ├── controllers/
│   │   └── userController.js      # All business logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── roleMiddleware.js      # RBAC: authorize()
│   │   ├── validationMiddleware.js # express-validator rules
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/userModel.js        # Mongoose schema
│   ├── routes/userRoutes.js       # API route definitions
│   ├── utils/
│   │   ├── generateToken.js       # JWT creation
│   │   └── sendEmail.js           # Nodemailer OTP sender
│   └── server.js                  # App entry point
│
└── frontend/                       # React + Vite SPA
    └── src/
        ├── api/axios.js            # Axios instance + interceptors
        ├── components/
        │   ├── Layout.jsx          # App shell (sidebar + header)
        │   ├── ProtectedRoute.jsx  # Route guard
        │   ├── UserModal.jsx       # Create/Edit user dialog
        │   └── ConfirmModal.jsx    # Delete confirmation dialog
        ├── context/
        │   ├── AuthContext.jsx     # Global auth state
        │   └── ToastContext.jsx    # Global toast notifications
        └── pages/
            ├── LoginPage.jsx       # Password + OTP login
            ├── RegisterPage.jsx    # Public registration
            ├── DashboardPage.jsx   # Stats + chart (admin)
            ├── UserListPage.jsx    # User management table (admin)
            └── ProfilePage.jsx     # Self-service profile
```

---

## 📡 API Reference (`/api/v1`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/users` | Public | Register new user |
| `POST` | `/users/login` | Public | Authenticate (password) |
| `POST` | `/users/send-otp` | Public | Request OTP code |
| `POST` | `/users/verify-otp` | Public | Login with OTP |
| `GET` | `/users/profile` | Private | Get own profile |
| `PUT` | `/users/profile` | Private | Update own profile/password |
| `GET` | `/users/stats` | Admin | Live dashboard statistics |
| `GET` | `/users/export` | Admin | Download CSV of all users |
| `GET` | `/users` | Admin | List users (paginated, search, filter) |
| `GET` | `/users/:id` | Admin | Get user by ID |
| `PUT` | `/users/:id` | Admin | Update user role/status |
| `DELETE` | `/users/:id` | Admin | Delete user |
| `GET` | `/health` | Public | API health check |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install
```bash
git clone https://github.com/sahanipriyanshu/Purple_mint_project.git
cd Purple_mint_project
npm run install-all
```

### 2. Configure Environment
```bash
# backend/.env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_32_char_random_secret_here
NODE_ENV=development

# Optional — for OTP email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Run
```bash
npm run dev        # Starts both backend (:5000) and frontend (:5173)
```

### 4. First Admin Setup
1. Register at `http://localhost:5173/register`
2. In MongoDB Atlas → Browse Collections → Users
3. Update your document: `"role": "user"` → `"role": "admin"`
4. Log back in — you now have admin access

---

## 🛡️ Security Highlights

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcryptjs, 10 rounds |
| Token auth | JWT, configurable expiry |
| OTP expiry | 10 minutes, single-use |
| Rate limiting | express-rate-limit (stricter on auth) |
| Security headers | helmet (11 headers) |
| Input validation | express-validator, server-side |
| CORS | Whitelist-based origin control |
| Auto-logout | 401 interceptor on frontend |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Recharts |
| Styling | Vanilla CSS (glassmorphism, CSS variables) |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs, Nodemailer |
| Security | Helmet, express-rate-limit, express-validator |
| Dev Tools | Nodemon, morgan |
