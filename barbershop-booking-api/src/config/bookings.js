function parsePositiveInt(raw, fallback) {
  const value = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
}

function getMaxActiveBookingsPerUser() {
  return parsePositiveInt(process.env.MAX_ACTIVE_BOOKINGS_PER_USER, 2);
}

module.exports = {
  getMaxActiveBookingsPerUser,
};
