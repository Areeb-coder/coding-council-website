# Coding Council Platform

A production-grade community platform for developer communities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npm run dev
# Opens at http://localhost:5000
```

### Admin Access
- URL: http://localhost:5173/admin
- Email: `admin@codingcouncil.com`
- Password: `admin123`

---

## 📁 Project Structure

```
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/    # UI components (Hero, About, Events, etc.)
│   │   ├── pages/         # Route pages (admin)
│   │   ├── stores/        # Zustand state
│   │   ├── api/           # Axios API client
│   │   └── data/          # Sample data
│   └── ...
│
└── backend/               # Express + TypeScript + MongoDB
    ├── src/
    │   ├── models/        # Mongoose schemas
    │   ├── routes/        # API endpoints
    │   ├── middleware/    # Auth, validation
    │   └── config/        # Environment config
    └── ...
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add env variable: `VITE_API_URL=https://your-backend.railway.app/api/v1`

### Backend → Railway
1. Connect GitHub repo to Railway
2. Set root directory: `backend`
3. Add environment variables from `.env.example`
4. Railway auto-detects Node.js

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Get connection string
3. Add to backend's `MONGODB_URI` env var

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-site.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
```

---

## ✨ Features

- **Public Website**: Hero, About, Events, Team, Projects, Testimonials, Contact
- **Admin Panel**: Dashboard, Events CRUD, Team CRUD, Registrations, Messages
- **API**: RESTful with JWT auth, rate limiting, validation
- **Design**: Dark/Light mode, Framer Motion animations, responsive

---

## 📄 License

MIT
