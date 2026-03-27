function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

function extractClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function createRateLimiter(options = {}) {
  const windowMs = toPositiveInt(options.windowMs, 15 * 60 * 1000);
  const max = toPositiveInt(options.max, 10);
  const keyPrefix = options.keyPrefix || 'rate-limit';
  const errorMessage = options.errorMessage || 'Too many requests, please try again later';
  const buckets = new Map();
  let lastCleanupAt = 0;

  return (req, res, next) => {
    const now = Date.now();
    const clientIp = extractClientIp(req);
    const key = `${keyPrefix}:${clientIp}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      if (now - lastCleanupAt > windowMs) {
        for (const [bucketKey, entry] of buckets.entries()) {
          if (entry.resetAt <= now) {
            buckets.delete(bucketKey);
          }
        }
        lastCleanupAt = now;
      }
      return next();
    }

    bucket.count += 1;
    if (bucket.count > max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({ error: errorMessage });
    }

    return next();
  };
}

module.exports = { createRateLimiter };
