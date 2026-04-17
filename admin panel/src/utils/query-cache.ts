import type { EntityRecord, ListPayload } from "../types";

const TTL_MS = 30_000;

type CacheEntry = {
  timestamp: number;
  payload: ListPayload<EntityRecord>;
};

const listCache = new Map<string, CacheEntry>();

function now() {
  return Date.now();
}

export function buildListCacheKey(resourceKey: string, limit: number, offset: number, query: Record<string, unknown>) {
  return `${resourceKey}:${limit}:${offset}:${JSON.stringify(query)}`;
}

export function readListCache(key: string): ListPayload<EntityRecord> | null {
  const hit = listCache.get(key);
  if (!hit) return null;
  if (now() - hit.timestamp > TTL_MS) {
    listCache.delete(key);
    return null;
  }
  return hit.payload;
}

export function writeListCache(key: string, payload: ListPayload<EntityRecord>) {
  listCache.set(key, { timestamp: now(), payload });
}

export function invalidateResourceCache(resourceKey: string) {
  for (const key of listCache.keys()) {
    if (key.startsWith(`${resourceKey}:`)) {
      listCache.delete(key);
    }
  }
}

