export const KYRGYZ_PHONE_PREFIX = "+996";
export const KYRGYZ_PHONE_TOTAL_LENGTH = 13;

export function normalizeKyrgyzPhone(value: string) {
  const digits = String(value || "").replace(/\D/g, "");
  const withoutCountryCode = digits.startsWith("996") ? digits.slice(3) : digits;
  return `${KYRGYZ_PHONE_PREFIX}${withoutCountryCode.slice(0, 9)}`;
}

export function ensureKyrgyzPhonePrefix(value: string) {
  if (!value) return KYRGYZ_PHONE_PREFIX;
  return normalizeKyrgyzPhone(value);
}

export function isValidKyrgyzPhone(value: string) {
  return /^\+996\d{9}$/.test(value);
}

