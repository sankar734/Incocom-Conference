# INCOCOM 2K26 – Conference Website (MySQL Edition)

Full-stack conference registration system.  
**Backend**: Node.js + Express + **MySQL** (via Sequelize ORM)  
**Frontend**: React + Tailwind CSS (mobile-responsive)

---

## Changes from Original (MongoDB → MySQL)

- Replaced `mongoose` with `sequelize` + `mysql2`
- All models rewritten as Sequelize models (`Registration`, `Admin`)
- `Registration.toApiShape()` helper maintains API shape compatibility
- `.env` now uses `MYSQL_*` variables instead of `MONGODB_URI`
- Registration page: **Initial field removed**, full **mobile-responsive** layout

---

## Setup

### 1. MySQL Database

```sql
CREATE DATABASE incocom2k26 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```

Tables are auto-created via `sequelize.sync({ alter: true })` on first run.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

---

## Environment Variables (backend/.env)

```
PORT=5000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=incocom2k26
MYSQL_USER=root
MYSQL_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@nprcet.edu.in
ADMIN_PASSWORD=Admin@2026
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
FRONTEND_URL=http://localhost:3000
```

---

## Key URLs

| Route | Description |
|---|---|
| `GET /api/health` | Health check |
| `POST /api/auth/login` | Admin login |
| `POST /api/registration/submit` | Submit registration |
| `GET /api/registration/status/:id` | Track registration |
| `POST /api/payment/submit` | Submit payment |
| `GET /api/admin/registrations` | List all registrations |
| `PATCH /api/admin/registrations/:id/status` | Update status |
