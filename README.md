# HAIRLINE — Frontend + Backend

This repository contains both the frontend application and the backend API.

## Structure
1. `./` — Frontend (Vite + React)
2. `./barbershop-booking-api/` — Backend (Node.js + Express + PostgreSQL)

## Live URLs
1. Frontend: `https://hairline-style-shop.vercel.app/`
2. Backend API: `https://barbershop-booking-api.onrender.com`
3. Swagger: `https://barbershop-booking-api.onrender.com/api/docs/`

## Local Development

### Backend
```bash
cd barbershop-booking-api
npm install
```

Create `.env` from `.env.example` and set:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
ADMIN_USER=...
ADMIN_PASSWORD=...
```

Run:
```bash
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

If you connect frontend to the API, make sure backend CORS allows your frontend
domain (see `barbershop-booking-api/.env.example`).

## Notes
1. Backend docs: see `barbershop-booking-api/README.md`
2. Backend testing: see `barbershop-booking-api/TESTING.md`
