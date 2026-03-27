# Barbershop Booking API

Backend API for the barbershop booking MVP described in `Barber_Shop_Research_SRS.docx`.

## Quick start

1. Install deps: `npm install`
2. Configure env: copy `.env.example` to `.env` and update values.
3. Prepare database:
```bash
createdb barbershop
psql -d barbershop -f db/schema.sql
psql -d barbershop -f db/seed.sql
```
4. Start server: `npm run dev` (or `npm start`)

Note on `db/seed.sql`: it is intentionally empty in this repository (real-data only policy).  
Add real salons/barbers/services/products via SQL or admin tools.

Server runs on `http://localhost:4000` by default.

Quality checks:
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run ci`

## Frontend

Live frontend: `https://hairline-style-shop.vercel.app/`

To enable CORS for the frontend, set `CORS_ORIGIN` in your `.env`:
```
CORS_ORIGIN=https://hairline-style-shop.vercel.app,http://localhost:3000
```

## API endpoints

Public:
- `GET /api/health`
- `GET /api/ready`
- `GET /api/barbers` (returns full master cards data, including role/rating/specialties)
- `GET /api/salons`
- `GET /api/services`
- `GET /api/products?category=men|women|unisex&type=Care`
- `GET /api/slots?date=YYYY-MM-DD&barberId=1&status=available|booked|blocked`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/bookings` (requires user token)

Admin:
- `POST /api/admin/login`
- `GET /api/admin/bookings?date=YYYY-MM-DD&barberId=1`
- `DELETE /api/admin/bookings/:id`
- `GET /api/admin/slots?date=YYYY-MM-DD&barberId=1&status=available`
- `POST /api/admin/slots`
- `DELETE /api/admin/slots/:id`
- `GET /api/admin/users?limit=50&offset=0`
- `GET /api/admin/salons?includeInactive=false`
- `POST /api/admin/salons`
- `PATCH /api/admin/salons/:id`

Important auth config:
- `ADMIN_USER` must be set explicitly.
- In `NODE_ENV=production`, `ADMIN_PASSWORD_HASH` is required.
- `ADMIN_PASSWORD` should be used only for local/dev fallback.
- Login rate-limit env vars:
  - `AUTH_LOGIN_RATE_LIMIT_WINDOW_MS`, `AUTH_LOGIN_RATE_LIMIT_MAX`
  - `ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS`, `ADMIN_LOGIN_RATE_LIMIT_MAX`

## Request examples

Register user:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Aidar Example",
    "email": "aidar@example.com",
    "phone": "+996700000000",
    "password": "password123"
  }'
```

Login user:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aidar@example.com",
    "password": "password123"
  }'
```

Create booking (user):
```bash
curl -X POST http://localhost:4000/api/bookings \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": 1,
    "barberId": 1,
    "date": "2026-03-20",
    "time": "10:30"
  }'
```

Admin login:
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "change-me"
  }'
```

Create slots (admin):
```bash
curl -X POST http://localhost:4000/api/admin/slots \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": 1,
    "date": "2026-03-20",
    "times": ["10:00", "10:30", "11:00"],
    "status": "available"
  }'
```

