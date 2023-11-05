import { expect, test } from 'vitest'
import { analytics_data_with_titles } from './analytics-data-with-titles'

const analytics_data = [
  {
    visits: '45243',
    pageviews: '76929',
    pathname: '/posts/change-scrollbar-color-tailwind-css',
  },
  {
    visits: '31735',
    pageviews: '56446',
    pathname: '/posts/use-chrome-in-ubuntu-wsl',
  },
  { visits: '6991', pageviews: '13208', pathname: '/' },
]

const posts_by_slug: Record<string, Post> = {
  'change-scrollbar-color-tailwind-css': {
    date: '11/4/2023',
    title: 'Change Scrollbar Color with Tailwind CSS',
    tags: ['tailwind', 'css'],
    isPrivate: false,
    readingTime: {
      text: '7 min read',
      minutes: 6.045,
      time: 362700,
      words: 1209,
    },
    preview: 'Preview text...',
    previewHtml: '<p>Preview text...</p>',
    slug: 'change-scrollbar-color-tailwind-css',
  },
  'use-chrome-in-ubuntu-wsl': {
    date: '10/23/2023',
    title: 'Use Chrome in Ubuntu WSL',
    tags: ['ubuntu', 'wsl', 'chrome'],
    isPrivate: false,
    readingTime: {
      text: '7 min read',
      minutes: 6.585,
      time: 395100,
      words: 1317,
    },
    preview: 'Preview text...',
    previewHtml: '<p>Preview text...</p>',
    slug: 'use-chrome-in-ubuntu-wsl',
  },
}

const expected = [
  {
    visits: '45243',
    pageviews: '76929',
    pathname: '/posts/change-scrollbar-color-tailwind-css',
    title: 'Change Scrollbar Color with Tailwind CSS',
  },
  {
    visits: '31735',
    pageviews: '56446',
    pathname: '/posts/use-chrome-in-ubuntu-wsl',
    title: 'Use Chrome in Ubuntu WSL',
  },
].slice(0, 10)

test('analytics_data_with_titles should augment analytics data with titles from posts by slug', () => {
  const result = analytics_data_with_titles(
    analytics_data,
    posts_by_slug,
  )
  expect(result).toEqual(expected)
})

test('should handle empty analytics_data and posts_by_slug gracefully', () => {
  const result = analytics_data_with_titles([], {})
  expect(result).toEqual([])
})

test('should augment all analytics_data with titles when all slugs match', () => {
  const result = analytics_data_with_titles(
    analytics_data,
    posts_by_slug,
  )
  expect(result).toEqual(expected)
})

test('should limit the output to 2 items', () => {
  const result = analytics_data_with_titles(
    analytics_data,
    posts_by_slug,
  )
  expect(result.length).toBe(2)
})
