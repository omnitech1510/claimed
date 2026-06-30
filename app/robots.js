export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/goal", "/billing"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/sitemap.xml`,
  };
}
