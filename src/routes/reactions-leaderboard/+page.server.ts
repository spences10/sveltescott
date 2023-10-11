import { reactions } from '$lib/reactions-config.js'
import { get_reactions_leaderboard_key, redis } from '$lib/redis.js'
import { time_to_seconds } from '$lib/utils/time-to-seconds.js'

const fetch_posts_data = async (fetch: Fetch): Promise<Post[]> => {
  const response = await fetch('posts.json')
  return await response.json()
}

const fetch_reaction_data = async (): Promise<ReactionPage[]> => {
  const keys = await redis.keys('reactions:*')
  return await Promise.all(
    keys.map(async (key: string) => {
      const count = await redis.get(key)
      return {
        path: key,
        count: parseInt(count as string, 10),
      }
    }),
  )
}

const transform_leaderboard = (
  pages: ReactionPage[],
  posts_data: Post[],
): Record<string, ReactionEntry> => {
  return pages.reduce(
    (acc: Record<string, ReactionEntry>, { path, count }) => {
      const [_, post_path, reaction_type] = path.split(':')
      const stripped_path = post_path.replace('/posts/', '')

      if (!acc[post_path]) {
        acc[post_path] = { path: post_path }
      }

      const post = posts_data.find(
        (p: Post) => p.slug === stripped_path,
      )
      if (post) {
        acc[post_path].title = post.title
      }

      acc[post_path][reaction_type] = count

      const reaction_info = reactions.find(
        r => r.type === reaction_type,
      )
      if (reaction_info) {
        acc[post_path][`${reaction_type}_emoji`] = reaction_info.emoji
      }

      return acc
    },
    {},
  )
}

const get_leaderboard_with_ranking = async (fetch: Fetch) => {
  const [posts_data, reaction_data] = await Promise.all([
    fetch_posts_data(fetch),
    fetch_reaction_data(),
  ])

  const sorted_pages = reaction_data.sort((a, b) => b.count - a.count)

  // Assign ranking numbers
  sorted_pages.forEach((page, index) => {
    page.rank = index + 1
  })

  const leaderboard = transform_leaderboard(sorted_pages, posts_data)

  return Object.values(leaderboard).map((entry, index) => {
    entry.rank = index + 1
    return entry
  })
}

// TODO: Should probably store the total count in Redis
const get_total_reaction_count = async (): Promise<number> => {
  const reaction_data = await fetch_reaction_data()
  return reaction_data.reduce((total, page) => total + page.count, 0)
}

export const load = async ({ fetch }) => {
  try {
    const cached = await redis.get(get_reactions_leaderboard_key())
    if (cached) {
      return {
        leaderboard: cached,
      }
    }
  } catch (error) {
    console.error('Error fetching from Redis:', error)
  }

  // if cache miss, fetch from API
  const leaderboard = await get_leaderboard_with_ranking(fetch)

  try {
    await redis.set(
      get_reactions_leaderboard_key(),
      JSON.stringify(leaderboard),
      {
        ex: time_to_seconds({ hours: 24 }),
      },
    )
  } catch (error) {
    console.error('Error setting to Redis:', error)
  }

  return {
    leaderboard,
  }
}
