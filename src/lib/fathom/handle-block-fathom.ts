/**
 * Handles the block fathom scenario.
 *
 * @param data - The cached data.
 * @param data_key - The key for the response body.
 *
 * @returns {Object|null} - Returns an object containing the response
 * body and headers if the Fathom script is blocked, or null.
 */
export const handle_block_fathom = (
  data: any,
  data_key: string,
): object | null => {
  let is_data_available = false
  let response_body = {}

  if (Array.isArray(data)) {
    is_data_available = data.length > 0
    if (!is_data_available) {
      response_body = []
    }
  } else {
    is_data_available = data?.total != null && data.content
    if (!is_data_available) {
      response_body = {}
    }
  }

  if (is_data_available) {
    response_body = data
  }

  return {
    body: {
      [data_key]: response_body,
      message: is_data_available
        ? undefined
        : 'Fathom script is blocked on the client-side.',
    },
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
    },
  }
}
