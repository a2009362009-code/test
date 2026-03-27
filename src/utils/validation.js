const { z } = require('zod');

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const phoneRegex = /^\+?[0-9]{7,20}$/;
const salonCodeRegex = /^[a-z0-9][a-z0-9-_]{1,39}$/;

function normalizeFullName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeEmail(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function normalizePhone(value) {
  const raw = String(value || '').trim();
  const hasPlus = raw.startsWith('+');
  const digitsOnly = raw.replace(/\D/g, '');
  if (!digitsOnly) {
    return '';
  }
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

function normalizeRegisterPayload(payload = {}) {
  return {
    ...payload,
    fullName: normalizeFullName(payload.fullName),
    email: normalizeEmail(payload.email),
    phone: normalizePhone(payload.phone)
  };
}

function normalizeUserLoginPayload(payload = {}) {
  return {
    ...payload,
    email: normalizeEmail(payload.email)
  };
}

function isValidDateString(value) {
  if (!dateRegex.test(value)) {
    return false;
  }

  const [yearRaw, monthRaw, dayRaw] = value.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

const dateStringSchema = z
  .string()
  .regex(dateRegex, 'Invalid date format')
  .refine(isValidDateString, 'Invalid date value');

const timeStringSchema = z.string().regex(timeRegex, 'Invalid time format');

const bookingSchema = z.object({
  serviceId: z.coerce.number().int().positive(),
  barberId: z.coerce.number().int().positive(),
  date: dateStringSchema,
  time: timeStringSchema
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const registerSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex, 'Invalid phone number'),
  password: z.string().min(6)
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const slotCreateSchema = z.object({
  barberId: z.coerce.number().int().positive(),
  date: dateStringSchema,
  times: z.array(timeStringSchema).min(1),
  status: z.enum(['available', 'blocked']).optional()
});

const slotQuerySchema = z.object({
  date: dateStringSchema,
  barberId: z.coerce.number().int().positive().optional(),
  status: z.enum(['available', 'booked', 'blocked']).optional()
});

const bookingsQuerySchema = z.object({
  date: dateStringSchema.optional(),
  barberId: z.coerce.number().int().positive().optional()
});

const usersQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(200).optional(),
  offset: z.coerce.number().int().nonnegative().optional()
});

const productsQuerySchema = z.object({
  category: z.enum(['men', 'women', 'unisex']).optional(),
  type: z.string().min(1).max(60).optional()
});

const salonCreateSchema = z.object({
  code: z.string().regex(salonCodeRegex, 'Invalid salon code'),
  name: z.string().min(2).max(120),
  address: z.string().min(3).max(240),
  workHours: z.string().min(3).max(80),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  sortOrder: z.coerce.number().int().min(0).max(100000).optional(),
  isActive: z.boolean().optional()
});

const salonUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  address: z.string().min(3).max(240).optional(),
  workHours: z.string().min(3).max(80).optional(),
  latitude: z.coerce.number().min(-90).max(90).nullable().optional(),
  longitude: z.coerce.number().min(-180).max(180).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(100000).optional(),
  isActive: z.boolean().optional()
}).refine((payload) => Object.keys(payload).length > 0, {
  message: 'At least one field is required'
});

const salonsAdminQuerySchema = z.object({
  includeInactive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional()
});

function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { data: result.data };
  }
  return { error: result.error.flatten() };
}

module.exports = {
  bookingSchema,
  loginSchema,
  registerSchema,
  userLoginSchema,
  slotCreateSchema,
  slotQuerySchema,
  bookingsQuerySchema,
  usersQuerySchema,
  productsQuerySchema,
  salonCreateSchema,
  salonUpdateSchema,
  salonsAdminQuerySchema,
  normalizeFullName,
  normalizeEmail,
  normalizePhone,
  normalizeRegisterPayload,
  normalizeUserLoginPayload,
  validate
};
