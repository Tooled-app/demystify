import { getAllPosts } from "./lib/posts";

export default async function sitemap() {
  const posts = await getAllPosts();
  const baseUrl = "https://demystify.website";

  // Static routes
  const staticRoutes = [
    "/",
    "/c3-confessionals",
    "/quick-takes",
    "/ai-humour",
    "/archive",
    "/newsletter",
    "/archive/long-form",
    "/archive/quick-takes",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "/" ? 1.0 : 0.8,
  }));

  // Dynamic post routes
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
