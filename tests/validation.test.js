const test = require('node:test');
const assert = require('node:assert/strict');

const {
  bookingSchema,
  registerSchema,
  slotCreateSchema,
  normalizeRegisterPayload,
  normalizeUserLoginPayload,
  validate
} = require('../src/utils/validation');

test('booking payload: valid request passes', () => {
  const result = validate(bookingSchema, {
    serviceId: 1,
    barberId: 2,
    date: '2026-04-10',
    time: '10:30'
  });

  assert.ok(result.data);
  assert.equal(result.error, undefined);
});

test('booking payload: invalid date fails', () => {
  const result = validate(bookingSchema, {
    serviceId: 1,
    barberId: 2,
    date: '2026-02-31',
    time: '10:30'
  });

  assert.ok(result.error);
});

test('register payload: invalid phone fails', () => {
  const result = validate(registerSchema, {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: 'abc',
    password: 'password123'
  });

  assert.ok(result.error);
});

test('slot create payload: invalid status fails', () => {
  const result = validate(slotCreateSchema, {
    barberId: 1,
    date: '2026-04-10',
    times: ['09:00', '09:30'],
    status: 'booked'
  });

  assert.ok(result.error);
});

test('register payload normalization: fullName/email/phone are normalized', () => {
  const normalized = normalizeRegisterPayload({
    fullName: '  Aidar   Example  ',
    email: '  AIDAR@Example.COM ',
    phone: ' +996 (700) 000-001 ',
    password: 'password123'
  });

  assert.equal(normalized.fullName, 'Aidar Example');
  assert.equal(normalized.email, 'aidar@example.com');
  assert.equal(normalized.phone, '+996700000001');
});

test('login payload normalization: email is trimmed and lowercased', () => {
  const normalized = normalizeUserLoginPayload({
    email: '  TeSt.User+1@Example.COM  ',
    password: 'password123'
  });

  assert.equal(normalized.email, 'test.user+1@example.com');
});

test('register payload: normalized phone passes schema validation', () => {
  const normalized = normalizeRegisterPayload({
    fullName: 'Test User',
    email: 'Test@Example.com',
    phone: '+996 (700) 000-001',
    password: 'password123'
  });

  const result = validate(registerSchema, normalized);
  assert.ok(result.data);
});
