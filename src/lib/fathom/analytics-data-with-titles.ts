export const analytics_data_with_titles = (
  analytics_data: AnalyticsData[],
  posts_by_slug: Record<string, Post>,
) => {
  return analytics_data
    .filter((data: { pathname: string }) =>
      data.pathname.startsWith('/posts/'),
    )
    .map((data: { pathname: string }) => {
      const post = posts_by_slug[data.pathname.slice(7)]
      return post ? { ...data, title: post.title } : data
    })
    .slice(0, 10)
}
