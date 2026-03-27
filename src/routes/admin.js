const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimit');
const {
  loginSchema,
  slotCreateSchema,
  slotQuerySchema,
  bookingsQuerySchema,
  usersQuerySchema,
  salonCreateSchema,
  salonUpdateSchema,
  salonsAdminQuerySchema,
  validate
} = require('../utils/validation');

const router = express.Router();
const adminLoginRateLimiter = createRateLimiter({
  windowMs: process.env.ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
  max: process.env.ADMIN_LOGIN_RATE_LIMIT_MAX,
  keyPrefix: 'admin-login'
});

router.post('/login', adminLoginRateLimiter, asyncHandler(async (req, res) => {
  const { data, error } = validate(loginSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors });
  }

  const nodeEnv = process.env.NODE_ENV || 'development';
  const adminUser = (process.env.ADMIN_USER || '').trim();
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';
  const requireHash = nodeEnv === 'production';

  if (!adminUser) {
    return res.status(500).json({ error: 'ADMIN_USER is not configured' });
  }

  if (requireHash && !adminPasswordHash) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD_HASH is required in production' });
  }

  if (!adminPasswordHash && !adminPassword) {
    return res.status(500).json({ error: 'Admin credentials are not configured' });
  }

  if (data.username !== adminUser) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  let valid = false;
  if (adminPasswordHash) {
    valid = await bcrypt.compare(data.password, adminPasswordHash);
  } else {
    valid = data.password === adminPassword;
  }

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET is not configured' });
  }

  const token = jwt.sign(
    { sub: adminUser, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TTL || '12h' }
  );

  res.json({ token });
}));

router.use(requireAuth, requireRole('admin'));

router.get('/salons', asyncHandler(async (req, res, next) => {
  const { data, error } = validate(salonsAdminQuerySchema, req.query);
  if (error) {
    return res.status(400).json({ error: 'Invalid query', details: error.fieldErrors });
  }

  try {
    const includeInactive = data.includeInactive || false;
    const result = await pool.query(
      `
      SELECT id, code, name, address, work_hours, latitude, longitude, sort_order, is_active, created_at, updated_at
      FROM salons
      WHERE ($1::boolean = true OR is_active = true)
      ORDER BY sort_order ASC, name ASC
      `,
      [includeInactive]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}));

router.post('/salons', asyncHandler(async (req, res, next) => {
  const { data, error } = validate(salonCreateSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO salons (code, name, address, work_hours, latitude, longitude, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, code, name, address, work_hours, latitude, longitude, sort_order, is_active, created_at, updated_at
      `,
      [
        data.code,
        data.name,
        data.address,
        data.workHours,
        data.latitude || null,
        data.longitude || null,
        data.sortOrder || 100,
        data.isActive !== false
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Salon with this code or name already exists' });
    }
    next(err);
  }
}));

router.patch('/salons/:id', asyncHandler(async (req, res, next) => {
  const salonId = Number(req.params.id);
  if (!Number.isInteger(salonId) || salonId <= 0) {
    return res.status(400).json({ error: 'Invalid salon id' });
  }

  const { data, error } = validate(salonUpdateSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors || error.formErrors });
  }

  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (Object.prototype.hasOwnProperty.call(data, 'name')) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'address')) {
      fields.push(`address = $${idx++}`);
      values.push(data.address);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'workHours')) {
      fields.push(`work_hours = $${idx++}`);
      values.push(data.workHours);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'latitude')) {
      fields.push(`latitude = $${idx++}`);
      values.push(data.latitude);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'longitude')) {
      fields.push(`longitude = $${idx++}`);
      values.push(data.longitude);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'sortOrder')) {
      fields.push(`sort_order = $${idx++}`);
      values.push(data.sortOrder);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'isActive')) {
      fields.push(`is_active = $${idx++}`);
      values.push(data.isActive);
    }

    fields.push('updated_at = NOW()');
    values.push(salonId);

    const result = await pool.query(
      `
      UPDATE salons
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING id, code, name, address, work_hours, latitude, longitude, sort_order, is_active, created_at, updated_at
      `,
      values
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: 'Salon not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Salon with this name already exists' });
    }
    next(err);
  }
}));

router.get('/bookings', asyncHandler(async (req, res, next) => {
  const { data, error } = validate(bookingsQuerySchema, req.query);
  if (error) {
    return res.status(400).json({ error: 'Invalid query', details: error.fieldErrors });
  }

  try {
    const params = [];
    let sql = `
      SELECT b.id, b.client_name, b.client_phone, b.date, b.time,
             s.name AS service_name, br.name AS barber_name
      FROM bookings b
      JOIN services s ON s.id = b.service_id
      JOIN barbers br ON br.id = b.barber_id
      WHERE 1=1
    `;

    if (data.date) {
      params.push(data.date);
      sql += ` AND b.date = $${params.length}`;
    }

    if (data.barberId) {
      params.push(data.barberId);
      sql += ` AND b.barber_id = $${params.length}`;
    }

    sql += ' ORDER BY b.date, b.time';

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}));

router.get('/users', asyncHandler(async (req, res, next) => {
  const { data, error } = validate(usersQuerySchema, req.query);
  if (error) {
    return res.status(400).json({ error: 'Invalid query', details: error.fieldErrors });
  }

  const limit = data.limit || 50;
  const offset = data.offset || 0;

  try {
    const result = await pool.query(
      `
      SELECT id, full_name, email, phone, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );
    res.json({ items: result.rows, limit, offset });
  } catch (err) {
    next(err);
  }
}));

router.delete('/bookings/:id', asyncHandler(async (req, res, next) => {
  const bookingId = Number(req.params.id);
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({ error: 'Invalid booking id' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const bookingRes = await client.query(
      'SELECT id, slot_id FROM bookings WHERE id = $1 FOR UPDATE',
      [bookingId]
    );

    if (!bookingRes.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    const slotId = bookingRes.rows[0].slot_id;
    await client.query('DELETE FROM bookings WHERE id = $1', [bookingId]);
    await client.query('UPDATE slots SET status = $1 WHERE id = $2', ['available', slotId]);
    await client.query('COMMIT');

    res.json({ status: 'deleted' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}));

router.get('/slots', asyncHandler(async (req, res, next) => {
  const { data, error } = validate(slotQuerySchema, req.query);
  if (error) {
    return res.status(400).json({ error: 'Invalid query', details: error.fieldErrors });
  }

  try {
    const params = [data.date];
    let sql = 'SELECT id, barber_id, date, time, status FROM slots WHERE date = $1';

    if (data.barberId) {
      params.push(data.barberId);
      sql += ` AND barber_id = $${params.length}`;
    }

    if (data.status) {
      params.push(data.status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY time';

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}));

router.post('/slots', asyncHandler(async (req, res, next) => {
  const { data, error } = validate(slotCreateSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors });
  }

  const times = Array.from(new Set(data.times));
  const status = data.status || 'available';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const barberRes = await client.query(
      `
      SELECT b.id
      FROM barbers b
      LEFT JOIN salons s ON s.id = b.salon_id
      WHERE b.id = $1
        AND b.is_active = true
        AND (b.salon_id IS NULL OR s.is_active = true)
      `,
      [data.barberId]
    );
    if (!barberRes.rowCount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Barber not found' });
    }

    const insertRes = await client.query(
      `
      INSERT INTO slots (barber_id, date, time, status)
      SELECT $1, $2, UNNEST($3::time[]), $4
      ON CONFLICT DO NOTHING
      RETURNING id, time, status
      `,
      [data.barberId, data.date, times, status]
    );

    await client.query('COMMIT');

    res.status(201).json({
      created: insertRes.rows,
      skipped: times.length - insertRes.rowCount
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}));

router.delete('/slots/:id', asyncHandler(async (req, res, next) => {
  const slotId = Number(req.params.id);
  if (!Number.isInteger(slotId) || slotId <= 0) {
    return res.status(400).json({ error: 'Invalid slot id' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const slotRes = await client.query(
      'SELECT id, status FROM slots WHERE id = $1 FOR UPDATE',
      [slotId]
    );

    if (!slotRes.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slotRes.rows[0].status === 'booked') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Cannot delete a booked slot' });
    }

    await client.query('DELETE FROM slots WHERE id = $1', [slotId]);
    await client.query('COMMIT');

    res.json({ status: 'deleted' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}));

module.exports = router;
