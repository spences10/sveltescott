import { get_related_posts } from '$lib/server/embeddings'
import { json } from '@sveltejs/kit'

export const GET = async ({ url }) => {
	const post_id = url.searchParams.get('post_id')

	if (!post_id) {
		return json(
			{ error: 'Missing post_id parameter' },
			{ status: 400 },
		)
	}

	const related_post_ids = await get_related_posts(post_id)

	const related_posts = await get_posts_by_slugs(related_post_ids)

	return json(related_posts)
}

async function get_posts_by_slugs(slugs: string[]): Promise<Post[]> {
	const posts = await Promise.all(
		slugs.map(async slug => {
			const post = await import(`../../../../posts/${slug}.md`)
			return {
				...post.metadata,
				slug,
				path: `/posts/${slug}`,
			} as Post
		}),
	)
	return posts
}
