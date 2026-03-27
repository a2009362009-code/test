**Manual Test Checklist**

**Base URL**
`https://test-4p5l.onrender.com`

**Preconditions**
1. The service is deployed and `/api/health` + `/api/ready` return `200`.
2. Database has at least 1 barber and 1 service.
3. Admin credentials are configured in Render env vars: `ADMIN_USER`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`.

**Data Formats**
1. Date: `YYYY-MM-DD`
2. Time: `HH:MM` (24h)
3. Phone: 7-20 chars, digits and `+() -` allowed

**Checklist**
1. Open `/api/health` and confirm `200`.
2. Open `/api/ready` and confirm `200`.
3. Open `/api/barbers` and confirm list is not empty.
4. Open `/api/services` and confirm list is not empty.
5. Register a new user at `/api/auth/register`.
6. Login at `/api/auth/login` and copy `token` as `USER_TOKEN`.
7. Admin login at `/api/admin/login` and copy `token` as `ADMIN_TOKEN`.
8. Create slots via `/api/admin/slots` for a future date.
9. Check `/api/slots` and confirm created times are visible.
10. Create booking via `/api/bookings` with `USER_TOKEN`.
11. Check `/api/slots` and confirm booked time is gone.
12. List bookings via `/api/admin/bookings` with `ADMIN_TOKEN`.
13. Delete booking via `/api/admin/bookings/:id`.
14. Check `/api/slots` and confirm time returns to available.

**Negative Checks**
1. `POST /api/bookings` without token returns `401`.
2. `GET /api/admin/bookings` with user token returns `403`.
3. Invalid `date` or `time` returns `400`.
4. Duplicate user register returns `409`.
5. Booking an occupied slot returns `409`.
6. Deleting nonexistent booking or slot returns `404`.
7. Too many login attempts return `429`.

