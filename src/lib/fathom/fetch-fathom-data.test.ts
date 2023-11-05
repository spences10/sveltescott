import { describe, expect, it } from 'vitest'
import { fetch_fathom_data } from './fetch-fathom-data'

export const mock_fetch = (
  response: { data: string },
  ok = true,
  status = 200,
  statusText = 'OK',
): Fetch => {
  return async (
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<Response> => {
    const headers = new Headers()
    const blob = new Blob([JSON.stringify(response)], {
      type: 'application/json',
    })
    return new Response(blob, {
      status,
      statusText,
      headers,
    })
  }
}

describe('fetch_fathom_data', () => {
  it('should fetch data from Fathom API, cache the response, and return the data', async () => {
    const mock_response = { data: 'test data' }
    const fetch = mock_fetch(mock_response)
    const endpoint = 'aggregations'
    const params = { site_id: 'test-site' }
    const cache_duration = 3600
    const cache_key_prefix = 'current_visitors'
    const block_fathom = false

    const data = await fetch_fathom_data(
      fetch,
      endpoint,
      params,
      cache_duration,
      cache_key_prefix,
      block_fathom,
    )

    expect(data).toEqual(mock_response)
  })
})
