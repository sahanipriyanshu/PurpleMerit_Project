# Premium User Management System (MERN)

A professional-grade User Management System built with the MERN stack (MongoDB, Express, React, Node.js), featuring Role-Based Access Control (RBAC), JWT authentication, and a stunning glassmorphism UI.

## ✨ Features

- **JWT Authentication**: Secure login and session persistence.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin`, `Moderator`, and `User`.
- **User CRUD**: Full administrative dashboard to manage users (create, update, delete).
- **Audit Tracking**: Automatic tracking of which admin created or last updated a user profile.
- **Server-Side Pagination**: Efficient data loading with search and filtering.
- **Premium UI/UX**: Built with Vanilla CSS, featuring glassmorphism, smooth animations, and a responsive sidebar layout.
- **Profile Management**: Users can manage their own account details.

## 🚀 Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS.
- **Frontend**: React (Vite), React Router 6, Axios, Lucide React (Icons).
- **Styling**: Premium Vanilla CSS.

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 2. Installation
Run the following command in the root directory to install all dependencies for both frontend and backend:
```bash
npm run install-all
```

### 3. Configuration
- Rename `backend/.env.example` to `backend/.env` and add your `MONGO_URI` and `JWT_SECRET`.
- Rename `frontend/.env.example` to `frontend/.env` and verify the `VITE_API_BASE_URL`.

### 4. Running the App
Start both the backend and frontend concurrently:
```bash
npm run dev
```

## 📖 Deployment
To generate a production build:
```bash
npm run build
```

---

*Built with ❤️ by Purple Mint Team*
