# HAIRLINE - Frontend + Backend

Monorepo with React frontend and Node.js API.

## Structure

1. `./` - Frontend (Vite + React + TypeScript)
2. `./barbershop-booking-api/` - Backend (Express + PostgreSQL)

## Local run

### 1) Backend

```bash
cd barbershop-booking-api
npm install
cp .env.example .env
npm run migrate:up
npm run seed:refresh
npm run dev
```

Backend URL: `http://localhost:4000`

### 2) Frontend

```bash
cd ..
npm install
cp .env.example .env
npm run api:types
npm run dev
```

Frontend URL: `http://localhost:8080`

## Contract-first API client

OpenAPI source: `barbershop-booking-api/src/docs/openapi.json`

Generate frontend types:

```bash
npm run api:types
```

Generated file: `src/api/generated/openapi.ts`

## CI expectations

- Frontend: install -> lint -> test -> build
- Backend: install -> migrate -> seed -> smoke test -> integration test

## Deployment URLs

- Frontend: `https://hairline-style-shop.vercel.app/`
- Backend: `https://barbershop-booking-api.onrender.com`
- Swagger: `https://barbershop-booking-api.onrender.com/api/docs/`
