import NodeCache from 'node-cache';
import { Redis } from 'ioredis';
import { env } from './env.js';

// Caching abstraction used by the WCA proxy. Uses Redis when REDIS_URL is set,
// otherwise falls back to an in-memory node-cache instance.
interface CacheBackend {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
}

class MemoryBackend implements CacheBackend {
  private cache = new NodeCache();
  async get(key: string) {
    return this.cache.get<string>(key) ?? null;
  }
  async set(key: string, value: string, ttlSeconds: number) {
    this.cache.set(key, value, ttlSeconds);
  }
}

class RedisBackend implements CacheBackend {
  private client: Redis;
  constructor(url: string) {
    this.client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 2 });
    this.client.on('error', (e) => console.warn('[cache] redis error:', e.message));
    this.client.connect().catch((e) => console.warn('[cache] redis connect failed:', e.message));
  }
  async get(key: string) {
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }
  async set(key: string, value: string, ttlSeconds: number) {
    try {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } catch {
      /* ignore */
    }
  }
}

const backend: CacheBackend = env.REDIS_URL ? new RedisBackend(env.REDIS_URL) : new MemoryBackend();

if (!env.REDIS_URL) {
  console.log('[cache] Using in-memory cache (no REDIS_URL configured).');
}

export async function cacheGetJSON<T>(key: string): Promise<T | null> {
  const raw = await backend.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSetJSON(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  await backend.set(key, JSON.stringify(value), ttlSeconds);
}

/** Fetch-through helper: returns cached value or computes + caches it. */
export async function cached<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
  const hit = await cacheGetJSON<T>(key);
  if (hit !== null) return hit;
  const fresh = await fn();
  await cacheSetJSON(key, fresh, ttlSeconds);
  return fresh;
}
