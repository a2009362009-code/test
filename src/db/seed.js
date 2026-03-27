const { pool } = require('./pool');

// Real-data only policy:
// keep seed lists empty by default and add actual business data explicitly.
const salons = [];
const barbers = [];
const services = [];
const products = [];

async function upsertSalons(client) {
  for (const salon of salons) {
    await client.query(
      `
      INSERT INTO salons (
        code, name, address, work_hours, latitude, longitude, is_active, sort_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        work_hours = EXCLUDED.work_hours,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        is_active = EXCLUDED.is_active,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
      `,
      [
        salon.code,
        salon.name,
        salon.address,
        salon.workHours,
        salon.latitude || null,
        salon.longitude || null,
        salon.isActive !== false,
        Number.isInteger(salon.sortOrder) ? salon.sortOrder : 100
      ]
    );
  }
}

async function loadSalonIdsByCode(client) {
  const result = await client.query('SELECT id, code FROM salons');
  const map = new Map();
  for (const row of result.rows) {
    map.set(row.code, row.id);
  }
  return map;
}

async function upsertBarbers(client, salonIdByCode) {
  for (const barber of barbers) {
    await client.query(
      `
      INSERT INTO barbers (
        name, role, experience_years, rating, reviews_count, image_url,
        is_available, specialties, location, bio, salon_id, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::text[], $9, $10, $11, $12)
      ON CONFLICT (name) DO UPDATE SET
        role = EXCLUDED.role,
        experience_years = EXCLUDED.experience_years,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        image_url = EXCLUDED.image_url,
        is_available = EXCLUDED.is_available,
        specialties = EXCLUDED.specialties,
        location = EXCLUDED.location,
        bio = EXCLUDED.bio,
        salon_id = EXCLUDED.salon_id,
        is_active = EXCLUDED.is_active
      `,
      [
        barber.name,
        barber.role,
        barber.experienceYears,
        barber.rating,
        barber.reviewsCount,
        barber.imageUrl,
        barber.isAvailable,
        barber.specialties,
        barber.location,
        barber.bio,
        barber.salonCode ? (salonIdByCode.get(barber.salonCode) || null) : null,
        barber.isActive !== false
      ]
    );
  }
}

async function upsertServices(client) {
  for (const service of services) {
    await client.query(
      `
      INSERT INTO services (name, duration_minutes, price, is_active)
      VALUES ($1, $2, $3, TRUE)
      ON CONFLICT (name) DO UPDATE SET
        duration_minutes = EXCLUDED.duration_minutes,
        price = EXCLUDED.price,
        is_active = TRUE
      `,
      [service.name, service.duration, service.price]
    );
  }
}

async function upsertProducts(client) {
  for (const product of products) {
    await client.query(
      `
      INSERT INTO products (
        name, description, price, image_url, category, type, stock_qty, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
      ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        image_url = EXCLUDED.image_url,
        category = EXCLUDED.category,
        type = EXCLUDED.type,
        stock_qty = EXCLUDED.stock_qty,
        is_active = TRUE
      `,
      [
        product.name,
        product.description,
        product.price,
        product.imageUrl,
        product.category,
        product.type,
        product.stockQty
      ]
    );
  }
}

async function deactivateMissingBarbers(client) {
  const names = barbers.map((barber) => barber.name);
  if (!names.length) {
    return;
  }

  await client.query(
    'UPDATE barbers SET is_active = FALSE WHERE is_active = TRUE AND name <> ALL($1::text[])',
    [names]
  );
}

async function deactivateMissingServices(client) {
  const names = services.map((service) => service.name);
  if (!names.length) {
    return;
  }

  await client.query(
    'UPDATE services SET is_active = FALSE WHERE is_active = TRUE AND name <> ALL($1::text[])',
    [names]
  );
}

async function deactivateMissingSalons(client) {
  const codes = salons.map((salon) => salon.code);
  if (!codes.length) {
    return;
  }

  await client.query(
    'UPDATE salons SET is_active = FALSE, updated_at = NOW() WHERE is_active = TRUE AND code <> ALL($1::text[])',
    [codes]
  );
}

async function deactivateMissingProducts(client) {
  const names = products.map((product) => product.name);
  if (!names.length) {
    return;
  }

  await client.query(
    'UPDATE products SET is_active = FALSE WHERE is_active = TRUE AND name <> ALL($1::text[])',
    [names]
  );
}

async function resetDemoData(client) {
  await client.query('TRUNCATE bookings, slots RESTART IDENTITY');
}

async function refreshSeeds(options = {}) {
  const { resetDemo = false } = options;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (resetDemo) {
      await resetDemoData(client);
    }

    await upsertSalons(client);
    const salonIdByCode = await loadSalonIdsByCode(client);
    await upsertBarbers(client, salonIdByCode);
    await upsertServices(client);
    await upsertProducts(client);
    await deactivateMissingSalons(client);
    await deactivateMissingBarbers(client);
    await deactivateMissingServices(client);
    await deactivateMissingProducts(client);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { refreshSeeds, salons, barbers, services, products };
