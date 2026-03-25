# Barbershop Booking API

Node.js + Express + PostgreSQL backend for booking, catalog, and admin operations.

## Quick start

1. Install dependencies:
```bash
npm install
```
2. Copy env and edit values:
```bash
cp .env.example .env
```
3. Run migrations and seed data:
```bash
npm run migrate:up
npm run seed:refresh
```
4. Start API:
```bash
npm run dev
```

Default URL: `http://localhost:4000`

## Database management

Migrations are the source of truth for schema evolution.

- Apply migrations: `npm run migrate:up`
- Rollback one migration: `npm run migrate:down`
- Create migration: `npm run migrate:create -- <name>`

`db/schema.sql` remains as a snapshot/bootstrap SQL and is used by the initial migration.

## Health endpoints

- `GET /api/health` - liveness (process is alive)
- `GET /api/ready` - readiness (checks DB with `SELECT 1`)

## Security defaults

- Rate limiting:
  - `POST /api/auth/login`
  - `POST /api/admin/login`
- In production (`NODE_ENV=production`) only `ADMIN_PASSWORD_HASH` is accepted.
- JWT rotation supported via `JWT_SECRETS` / `JWT_SECRET_CURRENT` + `JWT_SECRET_PREVIOUS`.

## Logging / observability

- Structured JSON logs for every request.
- Request correlation with `x-request-id` (generated if absent).

## Tests

```bash
npm run test:smoke
npm run test:integration
```

## API docs

Swagger UI: `http://localhost:4000/api/docs`
OpenAPI source: `src/docs/openapi.json`

## Main endpoints

Public:
- `GET /api/health`
- `GET /api/ready`
- `GET /api/barbers`
- `GET /api/barbers/:id/reviews`
- `GET /api/services`
- `GET /api/products`
- `GET /api/slots`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/bookings` (Bearer user token)

Admin:
- `POST /api/admin/login`
- `GET /api/admin/bookings`
- `DELETE /api/admin/bookings/:id`
- `GET /api/admin/slots`
- `POST /api/admin/slots`
- `DELETE /api/admin/slots/:id`
- `GET /api/admin/users`

## Demo data after `npm run seed:refresh`

- User 1: `ivan.petrov@example.com` / `password123`
- User 2: `aida.user@example.com` / `password123`
- User 3: `test.client@example.com` / `qwerty123`
- Slots: generated for all active barbers for the next 14 days
