import { redis } from '$lib/redis'

/**
 * Caches a response in Redis.
 *
 * @param cache_key - The cache key to use for storing the response.
 * @param data - The data to cache.
 * @param cache_duration - The number of seconds to cache the data for.
 */
export const cache_response = async (
  cache_key: string,
  data: any,
  cache_duration: number,
) => {
  let retries = 3
  while (retries > 0) {
    try {
      await redis.set(cache_key, JSON.stringify(data), {
        ex: cache_duration,
      })
      break
    } catch (e) {
      console.error(`Error caching response: ${e}`)
      retries--
    }
  }
}
