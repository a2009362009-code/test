const fs = require('node:fs');
const path = require('node:path');

exports.shorthands = undefined;

exports.up = (pgm) => {
  const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
  pgm.sql(schemaSql);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS slots;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS services;
    DROP TABLE IF EXISTS barbers;
  `);
};
