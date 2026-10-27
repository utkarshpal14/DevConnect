/**
 * Redis Cache Middleware
 * Milestone 7: API Response Caching for High-Speed Queries
 * 
 * Intercepts GET requests, serving responses from Redis / in-memory cache
 * when available and tagging response headers with X-Cache: HIT or MISS.
 */

const CacheService = require('./cache.service');

/**
 * Cache middleware generator for Express routes
 * @param {number} ttlSeconds Time to live in seconds (default: 60s)
 * @param {string} prefix Optional custom key prefix
 */
function cacheMiddleware(ttlSeconds = 60, prefix = 'route') {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${prefix}:${req.originalUrl || req.url}`;
    const startTime = Date.now();

    try {
      const cachedResponse = await CacheService.get(cacheKey);

      if (cachedResponse) {
        const duration = Date.now() - startTime;
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Duration-Ms', duration);
        return res.status(200).json(cachedResponse);
      }

      // Cache Miss: intercept res.json to capture response payload
      res.setHeader('X-Cache', 'MISS');

      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // Only cache successful 200 responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          CacheService.set(cacheKey, body, ttlSeconds).catch((err) => {
            console.warn('[CacheMiddleware] Failed to store response in cache:', err.message);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.warn('[CacheMiddleware] Cache inspection error, bypassing:', err.message);
      next();
    }
  };
}

/**
 * Invalidate cache helper for mutations
 * @param {string} pattern Glob pattern (e.g. 'jobs:*')
 */
async function invalidateCache(pattern) {
  return await CacheService.delByPattern(pattern);
}

module.exports = {
  cacheMiddleware,
  invalidateCache
};
