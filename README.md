# INCOCOM 2K26 – Full Stack Conference Management System

6th International Conference on Contemporary Management and Computing  
**NPR College of Engineering and Technology, Natham, Dindigul – 624 401, Tamil Nadu**  
Conference Date: **21.04.2026 (Tuesday)**

---

## 🌟 Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Framer Motion, React Hot Toast, Lucide/React Icons
- **Backend**: Node.js, Express.js, Sequelize ORM, JWT, Multer (file upload), Nodemailer
- **Database**: MySQL 8+ (Supports Cloud MySQL / TiDB / Aiven / PlanetScale / Railway / Local XAMPP)

---

## 🚀 Free Hosting & Deployment Guide

### Option 1: Frontend on Vercel + Backend on Render (Recommended)

#### A. Backend Deployment (Render.com / Railway.app)
1. Go to [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository: `https://github.com/sankar734/Incocom-Conference`.
3. Set the configuration:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In the **Environment Variables** tab, add:
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=mysql://your_user:your_password@your_host:3306/incocom2k26?ssl=true
   JWT_SECRET=your_long_random_jwt_secret_key
   ADMIN_EMAIL=mbamcaadmin@nprcet.org
   ADMIN_PASSWORD=Incocom@2026
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
5. Click **Deploy**. Your backend API will be live at `https://your-app.onrender.com`.

---

#### B. Frontend Deployment (Vercel / Netlify)
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository `Incocom-Conference`.
3. Set configuration:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
4. In **Environment Variables**, add:
   ```env
   REACT_APP_API_URL=https://your-app.onrender.com/api
   ```
5. Click **Deploy**. Your conference website will be live with full SPA routing support!

---

### Option 2: Cloud Database Setup (Free MySQL)
You can get a free managed cloud MySQL database from any of the following providers:
- **TiDB Cloud (Serverless)**: Free 5GB MySQL-compatible database.
- **Aiven.io**: Free tier MySQL.
- **Railway.app**: Instant provisioned MySQL.
- **Clever Cloud**: Free MySQL database addon.

Simply copy the connection URI and paste it as `DATABASE_URL` in your backend environment variables.

---

## 💻 Local Development Setup

### 1. Database Setup
Ensure MySQL is running (e.g. through XAMPP, WAMP, or local MySQL service):
```sql
CREATE DATABASE incocom2k26 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend starts at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend opens at `http://localhost:3000`.

---

## 🔑 Default Admin Credentials

- **Email**: `mbamcaadmin@nprcet.org`
- **Password**: `Incocom@2026`
- **Admin Portal**: `/admin/login`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health Check |
| `POST` | `/api/auth/login` | Admin Login |
| `GET` | `/api/auth/verify` | Verify Admin Token |
| `POST` | `/api/registration/submit` | Submit Paper Registration |
| `GET` | `/api/registration/status/:id` | Track Registration Status |
| `GET` | `/api/payment/details/:id` | Get Payment Information |
| `POST` | `/api/payment/submit` | Submit Payment Transaction & Proof |
| `GET` | `/api/admin/dashboard` | Dashboard Analytics Stats |
| `GET` | `/api/admin/registrations` | List All Registrations |
| `GET` | `/api/admin/registrations/export-excel` | Export Registrations as CSV/Excel |
| `GET` | `/api/admin/registrations/:id/download` | Download Uploaded Paper |
| `GET` | `/api/admin/registrations/:id/screenshot` | View Payment Screenshot |
| `PATCH` | `/api/admin/registrations/:id/status` | Update Paper / Payment Status |
