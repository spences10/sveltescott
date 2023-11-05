import { describe, expect, it, vi } from 'vitest'
import { get_data_from_cache } from './get-data-from-cache'

// Mock the redis module
vi.mock('$lib/redis', () => ({
  redis: {
    get: async (cache_key: string) => {
      return cache_key === 'existing-key'
        ? JSON.stringify({ data: 'cached data' })
        : null
    },
  },
}))

describe('get_data_from_cache', () => {
  it.skip('should return cached data when it exists', async () => {
    const cache_key = 'existing-key'
    const expected_data = { data: 'cached data' }

    const data = await get_data_from_cache(cache_key)

    expect(data).toEqual(expected_data)
  })

  it('should return null when cached data does not exist', async () => {
    const cache_key = 'non-existing-key'

    const data = await get_data_from_cache(cache_key)

    expect(data).toBeNull()
  })

  it('should handle errors when fetching data from cache', async () => {
    // Override the mock to throw an error
    vi.mock('$lib/redis', () => ({
      redis: {
        get: async () => {
          throw new Error('redis error')
        },
      },
    }))

    const console_spy = vi.spyOn(console, 'error')
    const cache_key = 'error-key'

    const data = await get_data_from_cache(cache_key)

    expect(console_spy).toHaveBeenCalledWith(
      'Error fetching data from cache: Error: redis error',
    )
    expect(data).toBeNull()
  })
})
