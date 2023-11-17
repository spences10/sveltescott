import { PUBLIC_FATHOM_ID } from '$env/static/public'
import { fetch_fathom_data } from '$lib/fathom'
import { time_to_seconds } from '$lib/utils/time-to-seconds.js'
import type { ServerlessConfig } from '@sveltejs/adapter-vercel'
import { json } from '@sveltejs/kit'
import { formatISO, sub } from 'date-fns'

export const config: ServerlessConfig = {
  runtime: 'nodejs18.x',
}

export const GET = async ({ fetch, url }) => {
  const period = url.searchParams.get('period') ?? 'week'
  const params = build_popular_params(period)

  const analytics_data = await fetch_fathom_data(
    fetch,
    `aggregations`,
    params,
    time_to_seconds({ hours: 24 }),
    `popular_posts_${period}`,
    false, // fetch and cache
  )

  if (Array.isArray(analytics_data) && analytics_data.length > 0) {
    return json(
      {
        analytics: analytics_data,
      },
      {
        headers: {
          'X-Robots-Tag': 'noindex, nofollow',
        },
      },
    )
  } else {
    console.error(
      `popular-posts.json returned data in unexpected format. ${JSON.stringify(
        params,
        null,
        2,
      )}`,
    )
    return json({
      analytics: [],
      message:
        'No analytics data available for the given parameters.',
    })
  }
}

const build_popular_params = (period: string) => {
  let date_from

  switch (period) {
    case 'day':
      date_from = formatISO(sub(new Date(), { days: 1 }))
      break
    case 'week':
      date_from = formatISO(sub(new Date(), { weeks: 1 }))
      break
    case 'month':
      date_from = formatISO(sub(new Date(), { months: 1 }))
      break
    case 'year':
      date_from = formatISO(sub(new Date(), { years: 1 }))
      break
    default:
      throw new Error(`Unknown period: ${period}`)
  }

  return {
    entity: 'pageview',
    entity_id: PUBLIC_FATHOM_ID,
    aggregates: 'visits,pageviews',
    field_grouping: 'pathname',
    date_from,
    date_to: formatISO(new Date()),
    sort_by: 'pageviews:desc',
    limit: '15',
  }
}
