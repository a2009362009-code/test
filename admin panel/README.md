# HairLine Admin Panel v2

Отдельный frontend-проект для администрирования `barbershop-booking-api`.

## Run locally

```powershell
npm install
npm run dev
```

## Environment

- `.env` is optional.
- By default admin panel auto-detects API base:
  - `localhost`/`127.0.0.1` -> `http://localhost:4000`
  - any other host -> `https://test-4p5l.onrender.com`
- Optional override:
  - `VITE_API_BASE_URL=<your-api-base-url>`

## What is implemented

- Admin auth by `phone + password` via `POST /api/admin/login`
- Protected routing with default landing on `/admins`
- Light HairLine shell (header + sidebar + dense content area)
- DataGrip-like workflow:
  - tabular CRUD for all admin resources,
  - search/sort/pagination,
  - row actions (`View`, `Edit`, `Delete`),
  - create/edit via right-side drawer forms
- Explicit `admins` table page with fields `id`, `full_name`, `phone`, `created_at`, `updated_at`
- Improved `barbers` onboarding form:
  - salon select,
  - specialties tag input,
  - image URL preview,
  - toggles for availability/active state
- `slots` page includes **Bulk slot generator**:
  - barber + date range + start/end + interval (15/30/60) + status,
  - batch requests to `/api/admin/slots`,
  - summary report `created/skipped/errors`

## Routes

- `/login`
- `/admins` (default after login)
- `/users`
- `/salons`
- `/barbers`
- `/services`
- `/products`
- `/slots`
- `/bookings`
- `/reviews`
- `/cart-items`

## Validation notes

- Kyrgyz phone format in forms: `+996XXXXXXXXX`
- Password length in admin/user forms: `6..50`

## Checks

```powershell
npm run lint
npm run build
```
