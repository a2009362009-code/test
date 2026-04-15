export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://test-4p5l.onrender.com";

export const USE_MOCK_API = import.meta.env.VITE_MOCK_MODE === "true";

function parsePositiveInt(value: unknown, fallback: number) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

export const MAX_ACTIVE_BOOKINGS_PER_USER = parsePositiveInt(
  import.meta.env.VITE_MAX_ACTIVE_BOOKINGS_PER_USER,
  2,
);
