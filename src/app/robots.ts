import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/progress", "/api/"],
    },
    sitemap: "https://www.sql-learning.net/sitemap.xml",
  };
}
