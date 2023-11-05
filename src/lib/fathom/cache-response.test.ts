import { redis } from '$lib/redis'
import { describe, expect, it, vi } from 'vitest'
import { cache_response } from './cache-response'

vi.mock('$lib/redis', () => ({
  redis: {
    set: async () => 'OK',
  },
}))

describe('cache_response', () => {
  it('should call redis.set with correct arguments', async () => {
    const spy = vi.spyOn(redis, 'set')
    const cache_key = 'some-key'
    const data = { some: 'data' }
    const cache_duration = 3600

    await cache_response(cache_key, data, cache_duration)

    expect(spy).toHaveBeenCalledWith(
      cache_key,
      JSON.stringify(data),
      { ex: cache_duration },
    )
  })

  it('should handle errors gracefully', async () => {
    const error = new Error('some error')
    const spy = vi
      .spyOn(redis, 'set')
      .mockImplementation(async () => {
        throw error
      })
    const console_spy = vi.spyOn(console, 'error')

    const cache_key = 'some-key'
    const data = { some: 'data' }
    const cache_duration = 3600

    await cache_response(cache_key, data, cache_duration)

    expect(console_spy).toHaveBeenCalledWith(
      `Error caching response: ${error}`,
    )
  })
})
