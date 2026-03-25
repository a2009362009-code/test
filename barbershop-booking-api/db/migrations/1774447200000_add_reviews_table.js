exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      barber_id INT NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      author_name TEXT NOT NULL,
      rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
      comment TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (barber_id, author_name, comment)
    );

    CREATE INDEX IF NOT EXISTS reviews_barber_idx ON reviews(barber_id);
    CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS reviews;
  `);
};
