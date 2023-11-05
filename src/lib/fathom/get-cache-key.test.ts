import { describe, expect, it, vi } from 'vitest'
import { get_cache_key } from './get-cache-key'

// Mock the imported functions from $lib/redis
vi.mock('$lib/redis', () => ({
  current_visitors_key: () => 'current-visitors-key',
  page_views_key: (prefix: any, params: { some_param: any }) =>
    `${prefix}-key-${params.some_param}`,
  popular_posts_key: (prefix: any) => `${prefix}-key`,
}))

describe('get_cache_key', () => {
  it('should return the correct key for current_visitors', () => {
    const prefix = 'current_visitors'
    const params = {}
    const expected_key = 'current-visitors-key'

    const key = get_cache_key(prefix, params)

    expect(key).toEqual(expected_key)
  })

  it('should return the correct key for page views', () => {
    const prefixes = [
      'page_views_day',
      'page_views_month',
      'page_views_year',
    ]
    const params = { some_param: 'value' }

    prefixes.forEach(prefix => {
      const expected_key = `${prefix}-key-value`
      const key = get_cache_key(prefix, params)

      expect(key).toEqual(expected_key)
    })
  })

  it('should return the correct key for popular posts', () => {
    const prefixes = [
      'popular_posts_day',
      'popular_posts_month',
      'popular_posts_year',
    ]

    prefixes.forEach((prefix: string) => {
      const expected_key = `${prefix}-key`
      const key = get_cache_key(prefix, {})

      expect(key).toEqual(expected_key)
    })
  })

  it('should throw an error for unknown cache_key_prefix', () => {
    const prefix = 'unknown_prefix'
    const params = {}

    expect(() => get_cache_key(prefix, params)).toThrow(
      `Unknown cache_key_prefix: ${prefix}`,
    )
  })
})
