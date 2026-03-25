const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { signAccessToken, getJwtConfig } = require('../auth/jwt');
const { requireAuth, requireRole } = require('../middleware/auth');
const { createRateLimit } = require('../middleware/rate-limit');
const {
  bookingSchema,
  slotQuerySchema,
  productsQuerySchema,
  registerSchema,
  userLoginSchema,
  validate
} = require('../utils/validation');

const router = express.Router();

const loginRateLimiter = createRateLimit({
  windowMs: process.env.AUTH_LOGIN_RATE_LIMIT_WINDOW_MS,
  max: process.env.AUTH_LOGIN_RATE_LIMIT_MAX,
  message: 'Too many login attempts. Try again later.'
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable' });
  }
});

router.get('/barbers', async (req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        role,
        experience_years,
        rating,
        reviews_count,
        image_url,
        is_available,
        specialties,
        location,
        bio,
        is_active,
        created_at
      FROM barbers
      WHERE is_active = true
      ORDER BY name
      `
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/barbers/:id/reviews', async (req, res, next) => {
  const barberId = Number(req.params.id);
  if (!Number.isInteger(barberId) || barberId <= 0) {
    return res.status(400).json({ error: 'Invalid barber id' });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        barber_id,
        author_name,
        rating,
        comment,
        created_at
      FROM reviews
      WHERE barber_id = $1
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [barberId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/services', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, duration_minutes, price FROM services WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/products', async (req, res, next) => {
  const { data, error } = validate(productsQuerySchema, req.query);
  if (error) {
    return res.status(400).json({ error: 'Invalid query', details: error.fieldErrors });
  }

  try {
    const params = [];
    let sql = `
      SELECT
        id,
        name,
        description,
        price,
        image_url,
        category,
        type,
        stock_qty
      FROM products
      WHERE is_active = true
    `;

    if (data.category) {
      params.push(data.category);
      sql += ` AND category = $${params.length}`;
    }

    if (data.type) {
      params.push(data.type);
      sql += ` AND type = $${params.length}`;
    }

    sql += ' ORDER BY name';

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/slots', async (req, res, next) => {
  const { data, error } = validate(slotQuerySchema, req.query);
  if (error) {
    return res.status(400).json({ error: 'Invalid query', details: error.fieldErrors });
  }

  try {
    const params = [data.date];
    let sql = `
      SELECT s.id, s.barber_id, s.date, s.time
      FROM slots s
      JOIN barbers b ON b.id = s.barber_id
      WHERE s.status = $1
        AND s.date = $2
        AND b.is_active = true
    `;
    params.unshift('available');

    if (data.barberId) {
      params.push(data.barberId);
      sql += ` AND barber_id = $${params.length}`;
    }

    sql += ' ORDER BY time';

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/auth/register', async (req, res, next) => {
  const { data, error } = validate(registerSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors });
  }

  if (!getJwtConfig().signingSecret) {
    return res.status(500).json({ error: 'JWT_SECRET is not configured' });
  }

  const client = await pool.connect();
  try {
    const exists = await client.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [data.email, data.phone]
    );
    if (exists.rowCount) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const insertRes = await client.query(
      `INSERT INTO users (full_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, phone, created_at`,
      [data.fullName, data.email, data.phone, passwordHash]
    );

    res.status(201).json({ user: insertRes.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'User already exists' });
    }
    next(err);
  } finally {
    client.release();
  }
});

router.post('/auth/login', loginRateLimiter, async (req, res, next) => {
  const { data, error } = validate(userLoginSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors });
  }

  if (!getJwtConfig().signingSecret) {
    return res.status(500).json({ error: 'JWT_SECRET is not configured' });
  }

  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, password_hash FROM users WHERE email = $1',
      [data.email]
    );
    if (!result.rowCount) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signAccessToken(
      { sub: user.id, role: 'user' },
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/bookings', requireAuth, requireRole('user'), async (req, res, next) => {
  const { data, error } = validate(bookingSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors });
  }

  const userId = Number(req.user.sub);
  if (!Number.isInteger(userId)) {
    return res.status(401).json({ error: 'Invalid token subject' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userRes = await client.query(
      'SELECT id, full_name, phone FROM users WHERE id = $1',
      [userId]
    );
    if (!userRes.rowCount) {
      await client.query('ROLLBACK');
      return res.status(401).json({ error: 'User not found' });
    }

    const serviceRes = await client.query(
      'SELECT id FROM services WHERE id = $1 AND is_active = true',
      [data.serviceId]
    );
    if (!serviceRes.rowCount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Service not found' });
    }

    const barberRes = await client.query(
      'SELECT id FROM barbers WHERE id = $1 AND is_active = true',
      [data.barberId]
    );
    if (!barberRes.rowCount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Barber not found' });
    }

    const slotRes = await client.query(
      'SELECT id FROM slots WHERE barber_id = $1 AND date = $2 AND time = $3 AND status = $4 FOR UPDATE',
      [data.barberId, data.date, data.time, 'available']
    );

    if (!slotRes.rowCount) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Selected time slot is not available' });
    }

    const user = userRes.rows[0];
    const slotId = slotRes.rows[0].id;
    const bookingRes = await client.query(
      `INSERT INTO bookings (user_id, client_name, client_phone, service_id, barber_id, slot_id, date, time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, created_at`,
      [
        user.id,
        user.full_name,
        user.phone,
        data.serviceId,
        data.barberId,
        slotId,
        data.date,
        data.time
      ]
    );

    await client.query('UPDATE slots SET status = $1 WHERE id = $2', ['booked', slotId]);
    await client.query('COMMIT');

    res.status(201).json({
      id: bookingRes.rows[0].id,
      createdAt: bookingRes.rows[0].created_at
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
