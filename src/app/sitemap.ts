import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "https://weathernow-olive.vercel.app";
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/compare",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "always" : "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
