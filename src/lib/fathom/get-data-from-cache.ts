import { redis } from '$lib/redis'

/**
 * Asserts the shape of the analytics data.
 *
 * @param data - The data to assert the shape of.
 */
const assert_analytics_data_shape = (
  data: any,
): data is AnalyticsData => {
  return (
    typeof data.visits === 'string' &&
    typeof data.uniques === 'string' &&
    typeof data.pageviews === 'string' &&
    (typeof data.avg_duration === 'string' ||
      data.avg_duration === null) &&
    typeof data.bounce_rate === 'number' &&
    typeof data.date === 'string' &&
    typeof data.pathname === 'string' &&
    (data.total === undefined || typeof data.total === 'number') &&
    (data.content === undefined || typeof data.content === 'string')
  )
}

/**
 * Retrieves data from the Redis cache.
 *
 * @param cache_key - The cache key to retrieve data for.
 * @returns The cached data, or null if the data is not in the cache.
 */
export const get_data_from_cache = async (
  cache_key: string,
): Promise<AnalyticsData | null | {}> => {
  try {
    const cached = await redis.get(cache_key)
    if (cached && assert_analytics_data_shape(cached)) {
      return cached
    }
  } catch (e) {
    console.error(`Error fetching data from cache: ${e}`)
  }
  return null
}
