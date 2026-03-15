INSERT INTO barbers (name)
VALUES
  ('Azamat'),
  ('Beksultan'),
  ('Daniyar')
ON CONFLICT DO NOTHING;

INSERT INTO services (name, duration_minutes, price)
VALUES
  ('Classic haircut', 30, 500),
  ('Fade haircut', 45, 700),
  ('Beard trim', 20, 400)
ON CONFLICT DO NOTHING;
