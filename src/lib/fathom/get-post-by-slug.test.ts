import { describe, it, expect } from 'vitest'
import { get_posts_by_slug } from './get-post-by-slug'

describe('get_posts_by_slug', () => {
  it('should correctly map posts by slug', () => {
    const posts_data: Array<Post> = [
      {
        date: '2023-11-05',
        title: 'Title 1',
        tags: ['tag1', 'tag2'],
        isPrivate: false,
        readingTime: {
          text: '5 min read',
          minutes: 5,
          time: 300,
          words: 1000,
        },
        preview: 'Preview 1',
        previewHtml: '<p>Preview 1</p>',
        slug: 'post-1',
      },
      // ...other posts
    ]

    const expected_output: Record<string, Post> = {
      'post-1': {
        date: '2023-11-05',
        title: 'Title 1',
        tags: ['tag1', 'tag2'],
        isPrivate: false,
        readingTime: {
          text: '5 min read',
          minutes: 5,
          time: 300,
          words: 1000,
        },
        preview: 'Preview 1',
        previewHtml: '<p>Preview 1</p>',
        slug: 'post-1',
      },
      // ...other posts
    }

    const result = get_posts_by_slug(posts_data)
    expect(result).toEqual(expected_output)
  })

  it('should handle posts without a slug', () => {
    const posts_data: Array<Post> = [
      {
        date: '2023-11-05',
        title: 'Title 1',
        tags: ['tag1', 'tag2'],
        isPrivate: false,
        readingTime: {
          text: '5 min read',
          minutes: 5,
          time: 300,
          words: 1000,
        },
        preview: 'Preview 1',
        previewHtml: '<p>Preview 1</p>',
        slug: null,
      },
      // ...other posts
    ]

    const expected_output: Record<string, Post> = {
      // ...other posts (excluding the post with a null slug)
    }

    const result = get_posts_by_slug(posts_data)
    expect(result).toEqual(expected_output)
  })

  it('should return an empty object when no posts are provided', () => {
    const posts_data: Array<Post> = []
    const expected_output: Record<string, Post> = {}
    const result = get_posts_by_slug(posts_data)
    expect(result).toEqual(expected_output)
  })
})
