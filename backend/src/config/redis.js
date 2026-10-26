/**
 * Redis Configuration & Connection Manager
 * Milestone 7: Core Redis Cloud Caching Layer
 * 
 * Provides an ioredis client connected to Redis Cloud / local Redis,
 * with a high-performance in-memory fallback cache when Redis is offline or unconfigured.
 */

const Redis = require('ioredis');

let redisClient = null;
let isConnected = false;
let isFallback = false;

// High-performance In-Memory Fallback Cache Store
class MemoryCacheStore {
  constructor() {
    this.store = new Map();
    this.ttls = new Map();
  }

  async get(key) {
    if (!this.store.has(key)) return null;
    const expiresAt = this.ttls.get(key);
    if (expiresAt && Date.now() > expiresAt) {
      this.del(key);
      return null;
    }
    return this.store.get(key);
  }

  async set(key, value, mode, duration) {
    this.store.set(key, value);
    if (mode === 'EX' && duration) {
      this.ttls.set(key, Date.now() + duration * 1000);
    } else if (mode === 'PX' && duration) {
      this.ttls.set(key, Date.now() + duration);
    } else {
      this.ttls.delete(key);
    }
    return 'OK';
  }

  async del(...keys) {
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) {
        this.ttls.delete(key);
        count++;
      }
    }
    return count;
  }

  async keys(pattern = '*') {
    const now = Date.now();
    const activeKeys = [];
    for (const [key, expiresAt] of this.ttls.entries()) {
      if (expiresAt && now > expiresAt) {
        this.store.delete(key);
        this.ttls.delete(key);
      }
    }
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        activeKeys.push(key);
      }
    }
    return activeKeys;
  }

  async flushall() {
    this.store.clear();
    this.ttls.clear();
    return 'OK';
  }

  async quit() {
    return 'OK';
  }
}

const memoryStore = new MemoryCacheStore();

/**
 * Initialize Redis connection or fallback
 */
function initRedis() {
  const redisUrl = process.env.REDIS_URL;
  const redisHost = process.env.REDIS_HOST;

  // If explicitly configured for Redis, initialize ioredis
  if (redisUrl || redisHost) {
    try {
      const options = {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        enableOfflineQueue: false,
        retryStrategy(times) {
          if (times > 2) return null; // stop reconnecting after 2 tries
          return 500;
        }
      };

      if (redisUrl) {
        redisClient = new Redis(redisUrl, options);
      } else {
        redisClient = new Redis({
          host: redisHost || '127.0.0.1',
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          ...options
        });
      }

      redisClient.on('connect', () => {
        isConnected = true;
        isFallback = false;
        console.log('✅ Connected to Redis Cache server');
      });

      redisClient.on('error', (err) => {
        // Switch to transparent memory cache fallback on connection failures
        isConnected = false;
        isFallback = true;
      });
    } catch (e) {
      isFallback = true;
      isConnected = false;
    }
  } else {
    // When no REDIS_URL or REDIS_HOST is specified, use memory store
    isFallback = true;
    isConnected = false;
  }
}

initRedis();

/**
 * Retrieve active Redis client or in-memory fallback
 */
function getRedisClient() {
  if (redisClient && isConnected && !isFallback) {
    return redisClient;
  }
  return memoryStore;
}

/**
 * Check if real Redis server is currently active
 */
function isRedisConnected() {
  return isConnected && !isFallback;
}

/**
 * Disconnect Redis on server shutdown
 */
async function disconnectRedis() {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (_) {}
    isConnected = false;
  }
}

module.exports = {
  getRedisClient,
  isRedisConnected,
  disconnectRedis,
  memoryStore
};
