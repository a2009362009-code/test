const express = require('express');
const { pool } = require('../db/pool');
const { bookingSchema, slotQuerySchema, validate } = require('../utils/validation');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/barbers', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM barbers WHERE is_active = true ORDER BY name'
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

router.get('/slots', async (req, res, next) => {
  const { data, error } = validate(slotQuerySchema, req.query);
  if (error) {
    return res.status(400).json({ error: 'Invalid query', details: error.fieldErrors });
  }

  try {
    const params = [data.date];
    let sql = 'SELECT id, barber_id, date, time FROM slots WHERE status = $1 AND date = $2';
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

router.post('/bookings', async (req, res, next) => {
  const { data, error } = validate(bookingSchema, req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.fieldErrors });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

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

    const slotId = slotRes.rows[0].id;
    const bookingRes = await client.query(
      `INSERT INTO bookings (client_name, client_phone, service_id, barber_id, slot_id, date, time)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        data.clientName,
        data.clientPhone,
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
