import { describe, expect, it } from 'vitest'
import { handle_block_fathom } from './handle-block-fathom'

describe('handle_block_fathom', () => {
  it('should return cached data when data is an array and not empty', () => {
    const data = [1, 2, 3]
    const data_key = 'results'
    const expected_output = {
      body: {
        results: [1, 2, 3],
      },
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }

    const result = handle_block_fathom(data, data_key)
    expect(result).toEqual(expected_output)
  })

  it('should return cached data when data has total and content properties', () => {
    const data = {
      total: 3,
      content: 'some content',
    }
    const data_key = 'results'
    const expected_output = {
      body: {
        results: {
          total: 3,
          content: 'some content',
        },
      },
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }

    const result = handle_block_fathom(data, data_key)
    expect(result).toEqual(expected_output)
  })

  it('should return empty array in body when data is an empty array', () => {
    const data: any[] = []
    const data_key = 'results'
    const expected_output = {
      body: {
        results: [],
        message: 'Fathom script is blocked on the client-side.',
      },
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }

    const result = handle_block_fathom(data, data_key)
    expect(result).toEqual(expected_output)
  })

  it('should return empty object in body when data is an object without total and content properties', () => {
    const data = {}
    const data_key = 'results'
    const expected_output = {
      body: {
        results: {},
        message: 'Fathom script is blocked on the client-side.',
      },
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }

    const result = handle_block_fathom(data, data_key)
    expect(result).toEqual(expected_output)
  })
})
