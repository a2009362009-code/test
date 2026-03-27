exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO salons (
      code, name, address, work_hours, latitude, longitude, sort_order, is_active, updated_at
    )
    VALUES (
      'unassigned',
      'HairLine Unassigned',
      'Address not specified',
      '09:00 - 21:00',
      42.876731,
      74.606215,
      9999,
      TRUE,
      NOW()
    )
    ON CONFLICT (code) DO UPDATE SET
      name = EXCLUDED.name,
      address = EXCLUDED.address,
      work_hours = EXCLUDED.work_hours,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      sort_order = EXCLUDED.sort_order,
      is_active = TRUE,
      updated_at = NOW();
  `);

  pgm.sql(`
    UPDATE barbers b
    SET salon_id = s.id
    FROM salons s
    WHERE b.salon_id IS NULL
      AND b.location IS NOT NULL
      AND LOWER(TRIM(b.location)) = LOWER(TRIM(s.address))
      AND s.is_active = TRUE;
  `);

  pgm.sql(`
    UPDATE barbers b
    SET salon_id = s.id
    FROM salons s
    WHERE b.salon_id IS NULL
      AND s.code = 'center'
      AND b.location IS NOT NULL
      AND (
        b.location ILIKE '%center%'
        OR b.location ILIKE '%chuy%'
        OR b.location ILIKE '%toktogul%'
      );
  `);

  pgm.sql(`
    UPDATE barbers b
    SET salon_id = s.id
    FROM salons s
    WHERE b.salon_id IS NULL
      AND s.code = 'north'
      AND b.location IS NOT NULL
      AND (
        b.location ILIKE '%north%'
        OR b.location ILIKE '%jibek%'
        OR b.location ILIKE '%kiev%'
      );
  `);

  pgm.sql(`
    UPDATE barbers b
    SET salon_id = s.id
    FROM salons s
    WHERE b.salon_id IS NULL
      AND s.code = 'south'
      AND b.location IS NOT NULL
      AND (
        b.location ILIKE '%south%'
        OR b.location ILIKE '%akhunbaev%'
        OR b.location ILIKE '%manasa%'
        OR b.location ILIKE '%isanova%'
      );
  `);

  pgm.sql(`
    WITH fallback AS (
      SELECT id
      FROM salons
      WHERE code = 'unassigned'
      LIMIT 1
    )
    UPDATE barbers
    SET salon_id = (SELECT id FROM fallback)
    WHERE salon_id IS NULL;
  `);

  pgm.sql(`
    ALTER TABLE barbers
    ALTER COLUMN salon_id SET NOT NULL;
  `);

  pgm.sql(`
    ALTER TABLE barbers DROP CONSTRAINT IF EXISTS barbers_salon_id_fkey;
    ALTER TABLE barbers
      ADD CONSTRAINT barbers_salon_id_fkey
      FOREIGN KEY (salon_id)
      REFERENCES salons(id)
      ON DELETE RESTRICT;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE barbers DROP CONSTRAINT IF EXISTS barbers_salon_id_fkey;
    ALTER TABLE barbers
      ADD CONSTRAINT barbers_salon_id_fkey
      FOREIGN KEY (salon_id)
      REFERENCES salons(id)
      ON DELETE SET NULL;

    ALTER TABLE barbers
    ALTER COLUMN salon_id DROP NOT NULL;
  `);
};
