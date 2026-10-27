/**
 * Cache Service
 * Milestone 7: Redis Caching Layer
 * 
 * Provides unified interface for caching JSON data, strings, and query responses
 * with TTL expiration and pattern-based invalidation.
 */

const { getRedisClient } = require('../config/redis');

class CacheService {
  /**
   * Retrieve cached value by key
   * @param {string} key Cache key
   * @returns {Promise<any|null>} Parsed value or null if miss
   */
  static async get(key) {
    try {
      const client = getRedisClient();
      const raw = await client.get(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (_) {
        return raw;
      }
    } catch (err) {
      console.warn(`[CacheService] Error reading key "${key}":`, err.message);
      return null;
    }
  }

  /**
   * Store value into cache with TTL in seconds
   * @param {string} key Cache key
   * @param {any} value Value to store
   * @param {number} ttlSeconds Time to live in seconds (default: 300s / 5min)
   * @returns {Promise<boolean>} Success flag
   */
  static async set(key, value, ttlSeconds = 300) {
    try {
      const client = getRedisClient();
      const payload = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await client.set(key, payload, 'EX', ttlSeconds);
      } else {
        await client.set(key, payload);
      }
      return true;
    } catch (err) {
      console.warn(`[CacheService] Error setting key "${key}":`, err.message);
      return false;
    }
  }

  /**
   * Delete specific key from cache
   * @param {string} key Cache key
   * @returns {Promise<boolean>}
   */
  static async del(key) {
    try {
      const client = getRedisClient();
      await client.del(key);
      return true;
    } catch (err) {
      console.warn(`[CacheService] Error deleting key "${key}":`, err.message);
      return false;
    }
  }

  /**
   * Invalidate multiple keys matching a pattern (e.g., 'jobs:*', 'match:*')
   * @param {string} pattern Glob pattern
   * @returns {Promise<number>} Number of keys invalidated
   */
  static async delByPattern(pattern) {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);
      if (keys && keys.length > 0) {
        await client.del(...keys);
        return keys.length;
      }
      return 0;
    } catch (err) {
      console.warn(`[CacheService] Error deleting pattern "${pattern}":`, err.message);
      return 0;
    }
  }

  /**
   * Flush entire cache
   * @returns {Promise<boolean>}
   */
  static async flush() {
    try {
      const client = getRedisClient();
      await client.flushall();
      return true;
    } catch (err) {
      console.warn('[CacheService] Error flushing cache:', err.message);
      return false;
    }
  }
}

module.exports = CacheService;
